const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const checkPermission = require('../middleware/permission');

// @route   POST /api/results/bulk
// @desc    Save multiple result records
router.post('/bulk', checkPermission('Teacher', 'Upload Results'), async (req, res) => {
  try {
    const { records } = req.body;
    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ msg: 'Invalid records format' });
    }

    // Optional: Delete existing records for the same exam/subject/program to avoid duplicates
    const { examType, subject, program } = records[0];
    
    // Only delete if we have all necessary identifiers, else fallback to just examType and subject
    let deleteQuery = { examType, subject };
    if (program) {
        deleteQuery.program = program;
    }
    await Result.deleteMany(deleteQuery);

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
    const { subject, examType, program } = req.query;
    if (!subject || !examType) {
      return res.status(400).json({ msg: 'Subject and examType are required' });
    }
    
    let query = { subject, examType };
    if (program) {
        query.program = program;
    }
    
    const results = await Result.find(query);
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
