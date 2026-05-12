const mongoose = require('mongoose');

const TeacherAttendanceSchema = new mongoose.Schema({
  teacherEmail: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'On Leave'], required: true },
  checkIn: { type: String },
  checkOut: { type: String },
  remarks: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TeacherAttendance', TeacherAttendanceSchema);
