const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  subject: { type: String, required: true },
  examType: { type: String, required: true }, // Midterm, Final, Quiz
  marksObtained: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  grade: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', ResultSchema);
