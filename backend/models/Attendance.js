const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true },
  subject: { type: String, required: true }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
