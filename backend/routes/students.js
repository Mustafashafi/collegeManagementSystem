const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Fee = require('../models/Fee');

// @route   GET /api/students/profile/:email
// @desc    Get student profile by email
router.get('/profile/:email', async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.params.email }).populate('applicationRef');
    if (!student) {
      return res.status(404).json({ success: false, msg: 'Student profile not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   GET /api/students/fees/:email
// @desc    Get student fee records by email
router.get('/fees/:email', async (req, res) => {
  try {
    const fees = await Fee.find({ studentEmail: req.params.email }).sort({ dueDate: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

const Assignment = require('../models/Assignment');

// @route   GET /api/students/assignments/:email
// @desc    Get student assignments by email
router.get('/assignments/:email', async (req, res) => {
  try {
    const assignments = await Assignment.find({ studentEmail: req.params.email }).sort({ dueDate: 1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

const Attendance = require('../models/Attendance');

// @route   GET /api/students/attendance/:email
// @desc    Get student attendance records by email
router.get('/attendance/:email', async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentEmail: req.params.email }).sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

const Result = require('../models/Result');

// @route   GET /api/students/results/:email
// @desc    Get student exam results by email
router.get('/results/:email', async (req, res) => {
  try {
    const results = await Result.find({ studentEmail: req.params.email }).sort({ date: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

const Timetable = require('../models/Timetable');

// @route   GET /api/students/timetable/:program
// @desc    Get timetable by program
router.get('/timetable/:program', async (req, res) => {
  try {
    const timetable = await Timetable.find({ program: req.params.program });
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

module.exports = router;
