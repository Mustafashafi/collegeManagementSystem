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
    
    // Format notifications to set isRead dynamically per user if it's role-based
    const formattedNotifications = notifications.map(notification => {
      const nObj = notification.toObject();
      if (email) {
        const userEmail = email.toLowerCase().trim();
        nObj.isRead = nObj.recipientEmail 
          ? nObj.isRead 
          : (nObj.readBy && nObj.readBy.includes(userEmail));
      }
      return nObj;
    });

    res.json(formattedNotifications);
  } catch (err) {
    console.error('Error fetching notifications:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark a notification as read (supports user email tracking for role-based notifications)
router.put('/:id/read', async (req, res) => {
  try {
    const { email } = req.body || {};
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    notification.isRead = true;
    if (email) {
      const userEmail = email.toLowerCase().trim();
      if (!notification.readBy) {
        notification.readBy = [];
      }
      if (!notification.readBy.includes(userEmail)) {
        notification.readBy.push(userEmail);
      }
    }
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
    const { email, role } = req.body || {};
    
    if (email) {
      const userEmail = email.toLowerCase().trim();
      
      // 1. Mark individual ones as read directly
      await Notification.updateMany(
        { recipientEmail: userEmail },
        { $set: { isRead: true } }
      );
      
      // 2. Append to readBy for role-based notifications
      if (role) {
        const roleNotifications = await Notification.find({ recipientRole: role.toLowerCase() });
        for (const n of roleNotifications) {
          if (!n.readBy) n.readBy = [];
          if (!n.readBy.includes(userEmail)) {
            n.readBy.push(userEmail);
            await n.save();
          }
        }
      }
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
