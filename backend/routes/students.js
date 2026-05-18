const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Assignment = require('../models/Assignment');
const Student = require('../models/Student');
const Fee = require('../models/Fee');
const checkPermission = require('../middleware/permission');

// @route   POST /api/students/assignments/submit/:id
// @desc    Submit an assignment with file
router.post('/assignments/submit/:id', checkPermission('Student', 'Submit Assignments'), (req, res, next) => {
  console.log(`--- INCOMING SUBMISSION REQUEST ---`);
  console.log(`Method: ${req.method} | URL: ${req.originalUrl}`);
  next();
}, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error('Multer Error:', err);
      return res.status(400).json({ success: false, msg: `File upload error: ${err.message}` });
    }

    console.log(`--- PROCESSING SUBMISSION ---`);
    console.log(`ID: ${req.params.id}`);
    
    try {
      const { notes } = req.body;
      const assignment = await Assignment.findById(req.params.id);
      if (!assignment) {
        console.log(`❌ Assignment not found: ${req.params.id}`);
        return res.status(404).json({ success: false, msg: 'Assignment not found' });
      }

      // Check if deadline has passed (Allow until end of the day)
      const now = new Date();
      const deadline = new Date(assignment.dueDate);
      deadline.setHours(23, 59, 59, 999); 

      if (now > deadline) {
        console.log(`❌ Submission Rejected: Deadline passed for ${assignment.title}`);
        return res.status(400).json({ success: false, msg: 'Submission failed: The deadline for this assignment has passed.' });
      }

      assignment.status = 'Submitted';
      assignment.submissionNotes = notes;
      if (req.file) {
        console.log(`File received: ${req.file.filename}`);
        assignment.submissionFile = `/uploads/assignments/${req.file.filename}`;
      }
      
      await assignment.save();
      console.log(`✅ Assignment ${req.params.id} submitted successfully!`);

      // Notify Teacher
      const { createNotification } = require('../utils/notifier');
      try {
        const student = await require('../models/Student').findOne({ email: assignment.studentEmail });
        const studentName = student ? `${student.firstName} ${student.lastName}` : assignment.studentEmail;

        const User = require('../models/User');
        const teacherUser = await User.findOne({ name: assignment.teacher, role: 'teacher' });
        const recipientEmail = teacherUser ? teacherUser.email : undefined;

        await createNotification({
          recipientEmail,
          recipientRole: recipientEmail ? undefined : 'teacher',
          title: 'Assignment Submitted',
          message: `${studentName} has submitted the assignment "${assignment.title}".`,
          type: 'assignment',
          link: '/teacher/dashboard'
        });
      } catch (notifierErr) {
        console.error('Notifier failed:', notifierErr.message);
      }

      res.json({ success: true, msg: 'Assignment submitted successfully', assignment });
    } catch (err) {
      console.error(`❌ Submission Error:`, err);
      res.status(500).json({ success: false, msg: err.message });
    }
  });
});

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


// @route   GET /api/students/assignments/:email
// @desc    Get student assignments by email
router.get('/assignments/:email', checkPermission('Student', 'Submit Assignments'), async (req, res) => {
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
router.get('/results/:email', checkPermission('Student', 'View Results'), async (req, res) => {
  try {
    const results = await Result.find({ studentEmail: req.params.email }).sort({ date: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

const Timetable = require('../models/Timetable');

// @route   GET /api/students/timetable/:program
// @desc    Get timetable by program and year
router.get('/timetable/:program', checkPermission('Student', 'View Timetable'), async (req, res) => {
  try {
    const { year } = req.query;
    const query = { program: req.params.program };
    if (year) query.year = year;
    const timetable = await Timetable.find(query);
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});


// Student router 404 handler
router.use((req, res) => {
  console.log(`❌ STUDENTS ROUTER 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, msg: `Student route ${req.originalUrl} not found` });
});

module.exports = router;
