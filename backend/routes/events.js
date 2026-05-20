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

const tagImages = {
  ACADEMIC: [
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop'
  ],
  HOLIDAY: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=800&auto=format&fit=crop'
  ],
  EVENT: [
    'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop'
  ],
  NOTICE: [
    'https://images.unsplash.com/photo-1572945281864-7079c6d4907a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop'
  ],
  LIBRARY: [
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop'
  ]
};

// @route   POST /api/events
// @desc    Create an event (usually for admin, but added for completeness)
router.post('/', async (req, res) => {
  try {
    const tag = req.body.tag || 'EVENT';
    const images = tagImages[tag] || tagImages['EVENT'];
    const randomImage = images[Math.floor(Math.random() * images.length)];

    const newEvent = new Event({
      ...req.body,
      image: req.body.image || randomImage
    });
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
