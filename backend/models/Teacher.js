const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  employeeId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  phone: { type: String },
  joinedDate: { type: Date, default: Date.now },
  subjects: [{ type: String }],
  assignedClasses: [{ type: String }], // e.g. ["B.Sc CS - 2nd Year", "BBA - 1st Year"]
  status: { type: String, default: 'Active' },
  profileImage: { type: String }
});

module.exports = mongoose.model('Teacher', TeacherSchema);
