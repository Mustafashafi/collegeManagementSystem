const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
  program: { type: String, required: true },
  year: { type: String, required: true, default: '1st Year' },
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
  subject: { type: String, required: true },
  time: { type: String, required: true }, // e.g., "09:00 AM - 10:30 AM"
  room: { type: String, required: true },
  teacher: { type: String, required: true }
});

module.exports = mongoose.model('Timetable', TimetableSchema);
