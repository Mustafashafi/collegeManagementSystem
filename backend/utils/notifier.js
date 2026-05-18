const Notification = require('../models/Notification');

const createNotification = async ({ recipientEmail, recipientRole, title, message, type, link }) => {
  try {
    const notification = new Notification({
      recipientEmail: recipientEmail ? recipientEmail.toLowerCase().trim() : undefined,
      recipientRole,
      title,
      message,
      type,
      link
    });
    await notification.save();
    console.log(`🔔 [Notification Created] Role: ${recipientRole || 'N/A'}, Email: ${recipientEmail || 'N/A'}, Title: ${title}`);
    return notification;
  } catch (err) {
    console.error('❌ Error creating notification:', err.message);
  }
};

module.exports = { createNotification };
