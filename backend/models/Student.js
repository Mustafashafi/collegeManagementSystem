const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String },
  address: { type: String },
  program: { type: String, required: true },
  admissionDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Active' }, // Active, Graduated, Dropped
  rollNo: { type: String },
  batch: { type: String },
  applicationRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' }
});

module.exports = mongoose.model('Student', StudentSchema);
