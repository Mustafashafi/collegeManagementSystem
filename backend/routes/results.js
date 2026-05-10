const express = require('express');
const router = express.Router();
const Result = require('../models/Result');

// @route   POST /api/results/bulk
// @desc    Save multiple result records
router.post('/bulk', async (req, res) => {
  try {
    const { records } = req.body;
    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ msg: 'Invalid records format' });
    }

    // Optional: Delete existing records for the same exam/subject to avoid duplicates
    const { examType, subject } = records[0];
    await Result.deleteMany({ examType, subject });

    await Result.insertMany(records);

    res.json({ success: true, count: records.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/results/class
// @desc    Get result records for a specific class subject and exam type
router.get('/class', async (req, res) => {
  try {
    const { subject, examType } = req.query;
    if (!subject || !examType) {
      return res.status(400).json({ msg: 'Subject and examType are required' });
    }
    const results = await Result.find({ subject, examType });
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
