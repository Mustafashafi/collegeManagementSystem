const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipientEmail: { type: String, required: false, lowercase: true, trim: true },
  recipientRole: { type: String, required: false }, // 'admin', 'superadmin', 'teacher', 'parent', 'student', 'librarian', 'crm'
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true }, // e.g. 'fee_payment', 'book_request', 'assignment', 'grade'
  link: { type: String, required: false },
  isRead: { type: Boolean, default: false },
  readBy: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
