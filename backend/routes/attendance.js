const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// @route   POST /api/attendance/bulk
// @desc    Save multiple attendance records
router.post('/bulk', async (req, res) => {
  try {
    const { records } = req.body;
    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ msg: 'Invalid records format' });
    }

    // Optional: Delete existing records for the same day/subject/teacher to avoid duplicates if re-marking
    const { date, subject, teacher } = records[0];
    await Attendance.deleteMany({ date: new Date(date), subject, teacher });

    await Attendance.insertMany(records.map(r => ({
      ...r,
      date: new Date(r.date)
    })));

    res.json({ success: true, count: records.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
