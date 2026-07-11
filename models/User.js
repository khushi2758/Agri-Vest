const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  doc_type: {
    type: String,
    enum: ['PAN', 'AADHAAR', 'PASSPORT']
  },
  doc_ref: {
    type: String
  },
  verified_at: {
    type: Date
  }
}, { _id: false });

const walletSchema = new mongoose.Schema({
  balance: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'INR'
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    maxLength: 100
  },
  phone: {
    type: String,
    match: /^\+?[0-9]{10,14}$/
  },
  role: {
    type: String,
    required: true,
    enum: ['landowner', 'investor', 'agronomist', 'agri_tech', 'admin']
  },
  is_active: {
    type: Boolean,
    default: true
  },
  last_login: {
    type: Date
  },
  kyc: {
    type: kycSchema
  },
  wallet: {
    type: walletSchema,
    required: true
  }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false // Disabled to avoid conflicts with strict database schemas
});

// Create index for role
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
