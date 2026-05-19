const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Task = require('../models/Task');
const Application = require('../models/Application');

// ─── Follow-up config per lead status (mirrors tasks.js) ────────────────────
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
    notesFn: (lead) => `This lead is interested in ${lead.program} and may be ready to apply. Follow up to guide them through the application process. Contact: ${lead.email} / ${lead.phone}.`
  },
  'Application Submitted': {
    priority: 'Medium',
    dueDays: 5,
    titleFn: (lead) => `✅ Application Review: ${lead.firstName} ${lead.lastName} — ${lead.program}`,
    notesFn: (lead) => `This lead has submitted their application for ${lead.program}. Follow up to update them on status and next steps. Contact: ${lead.email} / ${lead.phone}.`
  }
  // 'Lost' → no follow-up generated
};

// ─── POST api/leads ──────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, program, institution, marks, source } = req.body;

    const counselors = ['Sarah Johnson', 'Mike Ross', 'Jessica Pearson', 'Harvey Specter', 'Louis Litt', 'Rachel Zane'];
    const randomCounselor = counselors[Math.floor(Math.random() * counselors.length)];

    const newLead = new Lead({
      firstName, lastName, email, phone, program, institution, marks,
      source: source || 'Admission Form',
      assigned: randomCounselor
    });

    const lead = await newLead.save();

    // Auto-create follow-up for New Inquiry
    const config = FOLLOWUP_CONFIG['New Inquiry'];
    const autoTask = new Task({
      title: config.titleFn(lead),
      lead: lead._id,
      dueDate: new Date(Date.now() + config.dueDays * 24 * 60 * 60 * 1000),
      priority: config.priority,
      type: 'auto-followup',
      notes: config.notesFn(lead)
    });
    await autoTask.save();

    res.json({ success: true, lead });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── GET api/leads ───────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ added: -1 });
    res.json(leads);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── GET api/leads/reports ───────────────────────────────────────────────────
router.get('/reports', async (req, res) => {
  try {
    const leads = await Lead.find();
    const applications = await Application.find();

    // 1. Lead Source Analysis
    const sources = ['Website', 'Social', 'Referral', 'Walk-in', 'Call'];
    const sourceCounts = {};
    sources.forEach(src => sourceCounts[src] = 0);

    leads.forEach(lead => {
      let src = lead.source || 'Website';
      const matched = sources.find(s => s.toLowerCase() === src.toLowerCase());
      if (matched) {
        sourceCounts[matched]++;
      } else {
        sourceCounts['Website']++;
      }
    });

    const maxSourceCount = Math.max(...Object.values(sourceCounts), 1);
    const sourceData = sources.map(src => {
      const count = sourceCounts[src];
      const pct = Math.round((count / maxSourceCount) * 100);
      return {
        label: src,
        count: count,
        height: `${Math.max(pct, 5)}%`
      };
    });

    // 2. Staff Conversion Performance
    const staffStats = {};
    leads.forEach(lead => {
      const name = lead.assigned || 'Unassigned';
      if (!staffStats[name]) {
        staffStats[name] = { name, leads: 0, admissions: 0 };
      }
      staffStats[name].leads++;
      if (['Application Submitted', 'Admitted'].includes(lead.status)) {
        staffStats[name].admissions++;
      }
    });

    const staffPerformance = Object.values(staffStats).map(staff => {
      const rate = staff.leads > 0 ? ((staff.admissions / staff.leads) * 100).toFixed(1) : '0.0';
      return {
        name: staff.name,
        leads: staff.leads,
        admissions: staff.admissions,
        rate: `${rate}%`
      };
    }).sort((a, b) => b.leads - a.leads);

    // 3. Enrollment Trends (Current vs Previous Intake)
    const totalApps = applications.length;
    const enrolledApps = applications.filter(a => a.status === 'Enrolled').length;
    const submittedApps = applications.filter(a => a.status === 'Submitted' || a.status === 'Approved').length;

    const trendData = [
      { prev: "35%", curr: `${Math.min(30 + Math.round((submittedApps / Math.max(totalApps, 1)) * 50), 100)}%` },
      { prev: "50%", curr: `${Math.min(45 + Math.round((enrolledApps / Math.max(totalApps, 1)) * 50), 100)}%` },
      { prev: "65%", curr: `${Math.min(60 + Math.round((totalApps / 10) * 10), 100)}%` }
    ];

    res.json({
      sourceData,
      staffPerformance,
      trendData
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── PUT api/leads/:id ───────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const statusClasses = {
      'New Inquiry': 'status-new',
      'Contacted': 'status-contacted',
      'Interested': 'status-interested',
      'Application Submitted': 'status-interested',
      'Admitted': 'status-approved',
      'Lost': 'status-new'
    };

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: { status, statusClass: statusClasses[status] || 'status-new' } },
      { new: true }
    );

    if (!lead) return res.status(404).json({ msg: 'Lead not found' });

    // ── Auto follow-up on status change ───────────────────────────────────
    // 1. Mark all existing pending auto-followups for this lead as Completed
    await Task.updateMany(
      { lead: lead._id, type: 'auto-followup', status: 'Pending' },
      { $set: { status: 'Completed' } }
    );

    // 2. Create a new follow-up task for the new status (if applicable)
    const config = FOLLOWUP_CONFIG[status];
    if (config) {
      const newTask = new Task({
        title: config.titleFn(lead),
        lead: lead._id,
        dueDate: new Date(Date.now() + config.dueDays * 24 * 60 * 60 * 1000),
        priority: config.priority,
        type: 'auto-followup',
        notes: config.notesFn(lead)
      });
      await newTask.save();
    }

    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── DELETE api/leads/:id ────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) return res.status(404).json({ success: false, msg: 'Lead not found' });

    // Also clean up any tasks linked to this lead
    await Task.deleteMany({ lead: lead._id });

    res.json({ success: true, msg: 'Lead deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
