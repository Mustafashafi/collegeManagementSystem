const mongoose = require('mongoose');

const BookRequestSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  bookTitle: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userRole: { type: String, enum: ['student', 'teacher'], required: true },
  studentId: { type: String }, // Optional for teachers
  requestDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Issued', 'Returned', 'Overdue'], 
    default: 'Pending' 
  },
  issueDate: { type: Date },
  dueDate: { type: Date },
  returnDate: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('BookRequest', BookRequestSchema);
