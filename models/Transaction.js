const mongoose = require('mongoose');

const gatewaySchema = new mongoose.Schema({
  provider: String,
  ref_id: String,
  raw_response: mongoose.Schema.Types.Mixed
}, { _id: false });

const transactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  investment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment'
  },
  type: {
    type: String,
    required: true,
    enum: ['deposit', 'withdrawal', 'return_payout', 'platform_fee', 'refund']
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  direction: {
    type: String,
    required: true,
    enum: ['credit', 'debit']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'reversed'],
    default: 'pending'
  },
  note: {
    type: String,
    maxLength: 300
  },
  gateway: gatewaySchema,
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  // We do not use mongoose auto-timestamps because only created_at exists in $jsonSchema
  versionKey: false
});

// Indexes
transactionSchema.index({ user_id: 1, created_at: -1 });
transactionSchema.index({ investment_id: 1 });
transactionSchema.index({ status: 1, type: 1 });
transactionSchema.index({ 'gateway.ref_id': 1 }, { sparse: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
