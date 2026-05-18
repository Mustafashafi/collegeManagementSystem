const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// @route   GET /api/notifications
// @desc    Get notifications for a user based on email and role
router.get('/', async (req, res) => {
  try {
    const { email, role } = req.query;
    if (!email && !role) {
      return res.status(400).json({ msg: 'Please provide email or role to fetch notifications' });
    }

    const query = { $or: [] };
    if (email) {
      query.$or.push({ recipientEmail: email.toLowerCase().trim() });
    }
    if (role) {
      query.$or.push({ recipientRole: role.toLowerCase() });
    }

    if (query.$or.length === 0) {
      return res.json([]);
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark a notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }
    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    console.error('Error marking read:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications for a user as read
router.put('/read-all', async (req, res) => {
  try {
    const { email, role } = req.body;
    const query = { $or: [] };
    if (email) {
      query.$or.push({ recipientEmail: email.toLowerCase().trim() });
    }
    if (role) {
      query.$or.push({ recipientRole: role.toLowerCase() });
    }

    if (query.$or.length > 0) {
      await Notification.updateMany(query, { $set: { isRead: true } });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking all read:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }
    await notification.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting notification:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
