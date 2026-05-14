const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  appId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  previousInstitution: { type: String, required: true },
  passingYear: { type: String, required: true },
  marks: { type: String, required: true },
  program: { type: String, required: true },
  fatherName: { type: String },
  parentEmail: { type: String, lowercase: true, trim: true },
  idDocument: { type: String }, // Path to file
  transcriptDocument: { type: String }, // Path to file
  status: { type: String, default: 'Submitted' },
  statusClass: { type: String, default: 'status-submitted' },
  appliedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
