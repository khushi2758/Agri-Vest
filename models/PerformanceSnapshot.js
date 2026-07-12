const mongoose = require('mongoose');

const metricsSchema = new mongoose.Schema({
  soil_score: { type: Number, min: 0, max: 100 },
  efficiency: { type: Number, min: 0, max: 100 },
  yield_pct: Number,
  soil_moisture_avg: Number,
  temperature_avg: Number,
  humidity_avg: Number,
  rainfall_mm: Number
}, { _id: false });

const weatherSchema = new mongoose.Schema({
  source: { type: String, default: 'openweather' },
  temp_avg: Number,
  temp_min: Number,
  temp_max: Number,
  humidity: Number,
  description: String
}, { _id: false });

const anomalySchema = new mongoose.Schema({
  type: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
  detail: { type: String, required: true }
}, { _id: false });

const performanceSnapshotSchema = new mongoose.Schema({
  plot_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plot',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  metrics: metricsSchema,
  weather: weatherSchema,
  anomalies: [anomalySchema]
}, {
  versionKey: false
});

// Indexes
performanceSnapshotSchema.index({ plot_id: 1, date: -1 }, { unique: true });
performanceSnapshotSchema.index({ date: -1 });

const PerformanceSnapshot = mongoose.model('PerformanceSnapshot', performanceSnapshotSchema);

module.exports = PerformanceSnapshot;
