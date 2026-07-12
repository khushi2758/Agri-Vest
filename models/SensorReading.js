const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true
  },
  plot_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plot',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['soil_moisture', 'temperature', 'humidity', 'rainfall', 'co2', 'light']
  },
  v: {
    type: Number,
    required: true
  },
  u: {
    type: String,
    required: true
  },
  ts: {
    type: Date,
    required: true
  }
}, {
  // Sensor readings allow additional properties in DB, but we keep Mongoose schema strict by default.
  // We disable versionKey to maintain purity with raw insertions.
  versionKey: false
});

// Indexes
sensorReadingSchema.index({ plot_id: 1, type: 1, ts: -1 });
sensorReadingSchema.index({ ts: 1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL

const SensorReading = mongoose.model('SensorReading', sensorReadingSchema);

module.exports = SensorReading;
