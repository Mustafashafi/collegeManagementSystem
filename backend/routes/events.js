const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { createNotification } = require('../utils/notifier');

// @route   GET /api/events
// @desc    Get events with optional audience filtering
router.get('/', async (req, res) => {
  try {
    const { audience } = req.query;
    const query = {};
    
    if (audience) {
      // Show events specifically for this audience OR for everyone
      query.$or = [{ audience: audience }, { audience: 'All' }];
    }

    const events = await Event.find(query).sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/events
// @desc    Create an event (usually for admin, but added for completeness)
router.post('/', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const event = await newEvent.save();
    
    // Send notifications to the targeted audience roles
    try {
      const audience = event.audience; // 'All', 'Student', 'Teacher', 'Librarian', 'Parent'
      const rolesToNotify = [];
      
      if (audience === 'All') {
        rolesToNotify.push('student', 'teacher', 'librarian', 'parent');
      } else {
        rolesToNotify.push(audience.toLowerCase());
      }

      for (const role of rolesToNotify) {
        let link = '/';
        if (role === 'student') link = '/student/events';
        else if (role === 'teacher') link = '/teacher/events';
        else if (role === 'librarian') link = '/librarian/events';
        else if (role === 'parent') link = '/parent/dashboard';

        await createNotification({
          recipientRole: role,
          title: `New Event: ${event.title}`,
          message: `${event.description}${event.time ? ' at ' + event.time : ''}${event.location ? ' - Place: ' + event.location : ''}`,
          type: 'event',
          link
        });
      }
    } catch (notifErr) {
      console.error('Failed to create notification for event:', notifErr.message);
    }

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/events/:id
// @desc    Get a single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, msg: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, msg: 'Event not found' });
    }
    await event.deleteOne();
    res.json({ success: true, msg: 'Event deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
});

module.exports = router;
