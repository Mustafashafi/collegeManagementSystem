const mongoose = require('mongoose');

const InstitutionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  subscription: { type: String, required: true },
  billingCycle: { type: String, required: true },
  adminName: { type: String, required: true },
  adminEmail: { type: String, required: true, unique: true },
  adminPhone: { type: String, required: true },
  status: { type: String, default: 'Active' },
  storageUsed: { type: String, default: '150 GB' },
  totalUsers: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Institution', InstitutionSchema);
