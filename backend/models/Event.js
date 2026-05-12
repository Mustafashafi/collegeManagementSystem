const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String },
  location: { type: String },
  tag: { type: String, enum: ['ACADEMIC', 'HOLIDAY', 'EVENT', 'NOTICE', 'LIBRARY'], default: 'EVENT' },
  audience: { type: String, enum: ['All', 'Student', 'Teacher', 'Librarian', 'Parent'], default: 'All' },
  tagBg: { type: String, default: '#f3f4f6' },
  tagColor: { type: String, default: '#111827' },
  createdBy: { type: String, default: 'Admin' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', EventSchema);
