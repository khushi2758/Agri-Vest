const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
  factor: {
    type: String,
    required: true,
    enum: ['irrigation', 'fertilizer', 'seeds', 'tech_upgrade', 'storage']
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  vendor: String,
  status: {
    type: String,
    enum: ['pending', 'deployed', 'completed']
  },
  deployed_at: Date
}, { _id: false });

const investmentSchema = new mongoose.Schema({
  investor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    enum: ['equity', 'factor_allocation']
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  ownership_pct: {
    type: Number,
    min: 0,
    max: 100
  },
  expected_return_pct: Number,
  maturity_date: Date,
  status: {
    type: String,
    enum: ['active', 'matured', 'withdrawn', 'cancelled'],
    default: 'active'
  },
  invested_at: {
    type: Date,
    required: true
  },
  allocations: [allocationSchema]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false
});

// Indexes
investmentSchema.index({ investor_id: 1, status: 1 });
investmentSchema.index({ plot_id: 1, status: 1 });
investmentSchema.index({ investor_id: 1, invested_at: -1 });

const Investment = mongoose.model('Investment', investmentSchema);

module.exports = Investment;
