const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const checkPermission = require('../middleware/permission');

// Helper function to normalize dates to the start of the day in UTC
const normalizeDate = (d) => {
  const dateObj = new Date(d);
  dateObj.setUTCHours(0, 0, 0, 0);
  return dateObj;
};

// @route   POST /api/attendance/bulk
// @desc    Save multiple attendance records
router.post('/bulk', checkPermission('Teacher', 'Mark Attendance'), async (req, res) => {
  try {
    const { records } = req.body;
    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ msg: 'Invalid records format' });
    }

    // Perform an upsert for each record so that a student can only ever have 
    // exactly one attendance state for a given subject on any single calendar day.
    const bulkOperations = records.map(r => {
      const normalizedDate = normalizeDate(r.date);
      return {
        updateOne: {
          filter: {
            studentEmail: r.studentEmail.toLowerCase().trim(),
            subject: r.subject,
            date: normalizedDate
          },
          update: {
            $set: {
              status: r.status
            }
          },
          upsert: true
        }
      };
    });

    const result = await Attendance.bulkWrite(bulkOperations);

    res.json({ success: true, count: records.length, result });
  } catch (err) {
    console.error('Error saving bulk attendance:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
