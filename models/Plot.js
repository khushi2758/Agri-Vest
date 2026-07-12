const mongoose = require('mongoose');

const yieldSchema = new mongoose.Schema({
  target_tonnes: Number,
  actual_tonnes: {
    type: Number,
    default: null
  }
}, { _id: false });

const investmentSummarySchema = new mongoose.Schema({
  total_invested: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    default: 0
  },
  investor_count: {
    type: Number,
    required: true,
    default: 0
  },
  funding_target: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  }
}, { _id: false });

const snapshotSchema = new mongoose.Schema({
  soil_score: Number,
  efficiency: Number,
  yield_pct: Number,
  updated_at: Date
}, { _id: false });

const sensorSchema = new mongoose.Schema({
  device_id: { type: String, required: true },
  sensor_type: { 
    type: String, 
    required: true,
    enum: ['soil_moisture', 'temperature', 'humidity', 'rainfall', 'yield_sensor']
  },
  active: Boolean,
  installed_at: Date
}, { _id: false });

const plotSchema = new mongoose.Schema({
  parcel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LandParcel',
    required: true
  },
  agronomist_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  crop_type: {
    type: String,
    required: true
  },
  season: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pre_sowing', 'sowing', 'growing', 'harvested', 'failed'],
    default: 'pre_sowing'
  },
  area_ha: {
    type: Number,
    required: true,
    min: 0.1
  },
  season_start: {
    type: Date,
    required: true
  },
  season_end: Date,
  yield: yieldSchema,
  investment_summary: {
    type: investmentSummarySchema,
    required: true
  },
  latest_snapshot: snapshotSchema,
  sensors: [sensorSchema]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false
});

// Indexes
plotSchema.index({ parcel_id: 1, season: 1 }, { unique: true });
plotSchema.index({ status: 1, season: 1 });
plotSchema.index({ agronomist_id: 1 });

const Plot = mongoose.model('Plot', plotSchema);

module.exports = Plot;
