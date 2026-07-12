const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  village: String,
  district: String,
  state: String,
  pincode: String
}, { _id: false });

const docSchema = new mongoose.Schema({
  doc_type: { type: String, required: true },
  file_ref: { type: String, required: true },
  uploaded_at: { type: Date, required: true }
}, { _id: false });

const landParcelSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxLength: 150
  },
  area_ha: {
    type: Number,
    required: true,
    min: 0.1
  },
  soil_type: {
    type: String,
    enum: ['alluvial', 'black', 'red', 'laterite', 'sandy', 'loamy']
  },
  water_source: {
    type: String,
    enum: ['canal', 'borewell', 'rainfed', 'river', 'mixed']
  },
  status: {
    type: String,
    required: true,
    enum: ['listed', 'active', 'inactive'],
    default: 'listed'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  address: addressSchema,
  docs: [docSchema]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false
});

// Indexes
landParcelSchema.index({ owner_id: 1 });
landParcelSchema.index({ location: '2dsphere' });
landParcelSchema.index({ status: 1, 'address.state': 1 });

const LandParcel = mongoose.model('LandParcel', landParcelSchema);

module.exports = LandParcel;
