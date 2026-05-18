const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const Fee = require('../models/Fee');
const Assignment = require('../models/Assignment');

const Application = require('../models/Application');

// @route   GET /api/parents/dashboard/:email
// @desc    Get all children (Students or Applicants) linked to a parent email
router.get('/dashboard/:email', async (req, res) => {
  try {
    const parentEmail = req.params.email.toLowerCase();
    
    // Find enrolled students
    const students = await Student.find({ parentEmail });
    
    // Find pending applications that aren't students yet
    const applications = await Application.find({ 
      parentEmail,
      status: { $ne: 'Enrolled' } // Don't duplicate if already enrolled
    });

    res.json({
      students,
      applications
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   GET /api/parents/student-360/:studentId
// @desc    Get a comprehensive view of a student's academic life for parents
router.get('/student-360/:studentId', async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    // Fetch everything in parallel for performance
    const [attendance, results, fees, assignments] = await Promise.all([
      Attendance.find({ studentEmail: student.email }),
      Result.find({ studentEmail: student.email }).sort({ date: -1 }),
      Fee.find({ studentEmail: student.email }).sort({ createdAt: -1 }),
      Assignment.find({ studentEmail: student.email }).sort({ dueDate: -1 })
    ]);

    // Calculate attendance percentage
    const totalSlots = attendance.length;
    const presentSlots = attendance.filter(a => a.status === 'Present').length;
    const attendanceRate = totalSlots > 0 ? ((presentSlots / totalSlots) * 100).toFixed(1) : 'N/A';

    res.json({
      profile: student,
      stats: {
        attendanceRate,
        totalSubjects: results.length,
        pendingFees: fees.filter(f => f.status !== 'Paid').length,
        activeAssignments: assignments.filter(a => a.status === 'Pending').length
      },
      attendance,
      results,
      fees,
      assignments
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

const multer = require('multer');
const path = require('path');

// Multer Config for fee receipts
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/fees/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// @route   POST /api/parents/fees/:id/upload-receipt
// @desc    Upload fee receipt and set status to 'Under Review'
router.post('/fees/:id/upload-receipt', upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, msg: 'No receipt file uploaded' });
    }

    const { paymentMode } = req.body;

    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ success: false, msg: 'Fee not found' });

    fee.receiptUrl = `/uploads/fees/${req.file.filename}`;
    fee.status = 'Under Review';
    fee.rejectionReason = null; // Clear previous rejection reason if any
    fee.pendingPaymentMode = paymentMode || 'Online Upload';

    await fee.save();
    
    // Create notification for admin review
    const { createNotification } = require('../utils/notifier');
    try {
      const student = await Student.findOne({ email: fee.studentEmail });
      const studentName = student ? `${student.firstName} ${student.lastName}` : fee.studentEmail;
      await createNotification({
        recipientRole: 'admin',
        title: 'Fee Receipt Submitted',
        message: `A fee receipt has been submitted for student ${studentName} (${fee.feeType}). Please review.`,
        type: 'fee_payment',
        link: '/admin/fees'
      });
    } catch (notifierErr) {
      console.error('Notifier failed:', notifierErr.message);
    }
    
    res.json({ success: true, msg: 'Receipt uploaded successfully. Waiting for Admin review.', fee });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

module.exports = router;
