const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  program: { type: String, required: true },
  institution: { type: String },
  marks: { type: String },
  source: { type: String, default: 'Website' },
  status: { type: String, default: 'New Inquiry' },
  statusClass: { type: String, default: 'status-new' },
  assigned: { type: String, default: 'Unassigned' },
  added: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
