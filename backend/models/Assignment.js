const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  dueDate: { type: Date, required: true },
  teacher: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Submitted', 'Graded'], default: 'Pending' },
  description: { type: String },
  assignmentFile: { type: String },
  submissionFile: { type: String },
  submissionNotes: { type: String },
  feedback: { type: String },
  grade: { type: String },
  showGrade: { type: Boolean, default: false }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
