const mongoose = require('mongoose');

const SuperAdminActivitySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  institution: { type: String, default: 'Global System' },
  actor: { type: String, default: 'GA_Master' },
  eventType: { type: String, required: true }, // CREATE, UPDATE, DELETE, SECURITY
  description: { type: String, required: true },
  ipAddress: { type: String, default: '127.0.0.1' }
});

module.exports = mongoose.model('SuperAdminActivity', SuperAdminActivitySchema);
