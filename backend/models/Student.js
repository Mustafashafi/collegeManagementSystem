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
  year: { type: String, default: '1st Year' },
  secondarySubjects: [{ type: String }],
  fatherName: { type: String },
  parentEmail: { type: String, lowercase: true, trim: true },
  applicationRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  profileImage: { type: String }
});

module.exports = mongoose.model('Student', StudentSchema);
