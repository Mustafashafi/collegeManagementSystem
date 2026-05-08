const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Task = require('../models/Task');

// @route   POST api/leads
// @desc    Create a new lead (from admission form)
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, program, institution, marks, source } = req.body;
    
    const counselors = ['Sarah Johnson', 'Mike Ross', 'Jessica Pearson', 'Harvey Specter', 'Louis Litt', 'Rachel Zane'];
    const randomCounselor = counselors[Math.floor(Math.random() * counselors.length)];

    const newLead = new Lead({
      firstName,
      lastName,
      email,
      phone,
      program,
      institution,
      marks,
      source: source || 'Admission Form',
      assigned: randomCounselor
    });

    const lead = await newLead.save();

    // Automatically create a follow-up task for the new lead
    const autoTask = new Task({
      title: `Initial follow-up with ${firstName} ${lastName}`,
      lead: lead._id,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Due in 24 hours
      priority: 'Medium',
      notes: `New lead from ${source || 'Admission Form'}. Please contact them regarding ${program}.`
    });
    await autoTask.save();

    res.json({ success: true, lead });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/leads
// @desc    Get all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ added: -1 });
    res.json(leads);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/leads/:id
// @desc    Update lead status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    // Map status to statusClass
    const statusClasses = {
      'New Inquiry': 'status-new',
      'Contacted': 'status-contacted',
      'Interested': 'status-interested',
      'Application Submitted': 'status-interested', // or another class
      'Lost': 'status-new' // or another class
    };

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          status, 
          statusClass: statusClasses[status] || 'status-new' 
        } 
      },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ msg: 'Lead not found' });
    }

    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/leads/:id
// @desc    Delete a lead
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, msg: 'Lead not found' });
    }

    res.json({ success: true, msg: 'Lead deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
