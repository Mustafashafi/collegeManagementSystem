const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Lead = require('../models/Lead');

// ─── Follow-up config per lead status ───────────────────────────────────────
// Defines what kind of follow-up to generate for each lead stage
const FOLLOWUP_CONFIG = {
  'New Inquiry': {
    priority: 'High',
    dueDays: 1,
    titleFn: (lead) => `📞 Contact: ${lead.firstName} ${lead.lastName} — New Inquiry, Not Yet Contacted`,
    notesFn: (lead) => `This lead submitted an inquiry for ${lead.program} via ${lead.source || 'Admission Form'} but has NOT been contacted yet. Please call or email them at ${lead.email} / ${lead.phone} as soon as possible.`
  },
  'Contacted': {
    priority: 'High',
    dueDays: 2,
    titleFn: (lead) => `📋 Follow up: ${lead.firstName} ${lead.lastName} — Interested in ${lead.program} Admission`,
    notesFn: (lead) => `This lead has been contacted and is interested in ${lead.program}. Please follow up to address their admission queries, explain the process, and encourage them to submit an application. Contact: ${lead.email} / ${lead.phone}.`
  },
  'Interested': {
    priority: 'Medium',
    dueDays: 3,
    titleFn: (lead) => `📝 Push Application: ${lead.firstName} ${lead.lastName} — Ready for ${lead.program} Admission`,
    notesFn: (lead) => `This lead is interested in ${lead.program} and may be ready to apply. Follow up to guide them through the application process and answer any remaining questions. Contact: ${lead.email} / ${lead.phone}.`
  },
  'Application Submitted': {
    priority: 'Medium',
    dueDays: 5,
    titleFn: (lead) => `✅ Application Review: ${lead.firstName} ${lead.lastName} — ${lead.program}`,
    notesFn: (lead) => `This lead has submitted their application for ${lead.program}. Follow up to update them on their application status and next steps. Contact: ${lead.email} / ${lead.phone}.`
  }
  // 'Lost' → no follow-up generated
};

// ─── GET /api/tasks ──────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('lead', 'firstName lastName email phone program status source')
      .sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── POST /api/tasks/sync-followups ─────────────────────────────────────────
// Auto-generates follow-up tasks for ALL actionable lead statuses.
// Idempotent: won't create a duplicate if a pending auto-followup already exists
// for that lead at the same status level.
router.post('/sync-followups', async (req, res) => {
  try {
    const actionableStatuses = Object.keys(FOLLOWUP_CONFIG);
    const leads = await Lead.find({ status: { $in: actionableStatuses } });

    let created = 0;
    for (const lead of leads) {
      const config = FOLLOWUP_CONFIG[lead.status];
      if (!config) continue;

      // Check if a pending auto-followup already exists for this lead + status combo
      const existing = await Task.findOne({
        lead: lead._id,
        type: 'auto-followup',
        status: 'Pending',
        title: { $regex: lead.firstName, $options: 'i' }
      });

      if (!existing) {
        const dueDate = new Date(Date.now() + config.dueDays * 24 * 60 * 60 * 1000);

        const task = new Task({
          title: config.titleFn(lead),
          lead: lead._id,
          dueDate,
          priority: config.priority,
          type: 'auto-followup',
          notes: config.notesFn(lead)
        });
        await task.save();
        created++;
      }
    }

    res.json({ success: true, created, message: `${created} follow-up task(s) generated.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── POST /api/tasks ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { title, lead, dueDate, priority, notes, type } = req.body;

  try {
    const newTask = new Task({
      title,
      lead: lead || null,
      dueDate,
      priority,
      notes,
      type: type || 'manual'
    });

    const task = await newTask.save();
    const populatedTask = await Task.findById(task._id).populate('lead', 'firstName lastName');
    res.json(populatedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── PATCH /api/tasks/:id ─────────────────────────────────────────────────────
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    task.status = req.body.status || task.status;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    await task.deleteOne();
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
