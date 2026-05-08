const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  tag: { type: String, enum: ['ACADEMIC', 'HOLIDAY', 'EVENT', 'NOTICE'], default: 'EVENT' },
  tagBg: { type: String, default: '#f3f4f6' },
  tagColor: { type: String, default: '#111827' },
  createdBy: { type: String, default: 'Admin' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', EventSchema);
