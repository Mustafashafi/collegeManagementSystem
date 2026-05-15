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

    // Use bulkWrite for atomic upserts to prevent duplicates and ensure updates
    const bulkOps = records.map(record => ({
      updateOne: {
        filter: { 
          studentEmail: record.studentEmail, 
          subject: record.subject, 
          examType: record.examType 
        },
        update: { $set: record },
        upsert: true
      }
    }));

    await Result.bulkWrite(bulkOps);

    res.json({ success: true, count: records.length });
  } catch (err) {
    console.error('Bulk Result Error:', err.message);
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
