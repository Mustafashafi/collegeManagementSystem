const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');
const Student = require('../models/Student');
const User = require('../models/User');
const Fee = require('../models/Fee');
const Assignment = require('../models/Assignment');

// Multer Config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|jpg|png|jpeg/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("File upload only supports the following filetypes - " + filetypes));
  }
});

// @route   GET /api/applications
// @desc    Get all applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find().sort({ appliedDate: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   POST /api/applications
// @desc    Submit a new application
router.post('/', upload.fields([
  { name: 'idDocument', maxCount: 1 },
  { name: 'transcriptDocument', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      firstName, lastName, dob, gender, email, phone, address,
      previousInstitution, passingYear, marks, program
    } = req.body;

    // Generate Application ID: APP-YYYY-001
    const count = await Application.countDocuments();
    const year = new Date().getFullYear();
    const appId = `APP-${year}-${(count + 1).toString().padStart(3, '0')}`;

    const newApplication = new Application({
      appId,
      firstName,
      lastName,
      dob,
      gender,
      email,
      phone,
      address,
      previousInstitution,
      passingYear,
      marks,
      program,
      idDocument: req.files['idDocument'] ? req.files['idDocument'][0].path : null,
      transcriptDocument: req.files['transcriptDocument'] ? req.files['transcriptDocument'][0].path : null
    });

    await newApplication.save();
    res.json({ success: true, application: newApplication });
  } catch (err) {
    console.error('Submit Application Error:', err);
    res.status(500).json({ success: false, msg: err.message });
  }
});


// @route   PUT /api/applications/:id/status
// @desc    Update application status
router.put('/:id/status', async (req, res) => {
  try {
    const { status, statusClass } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, statusClass },
      { new: true }
    );
    res.json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});


// @route   POST /api/applications/:id/enroll
// @desc    Enroll applicant as a student, create user account, and initial fee
router.post('/:id/enroll', async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ success: false, msg: 'Application not found' });

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: app.email });
    if (existingUser) return res.status(400).json({ success: false, msg: 'A user with this email already exists' });

    // 2. Generate Student ID
    const count = await Student.countDocuments();
    const year = new Date().getFullYear();
    const studentId = `S-${year}-${(count + 1).toString().padStart(3, '0')}`;

    // 3. Create Student Record
    const newStudent = new Student({
      studentId,
      firstName: app.firstName,
      lastName: app.lastName,
      email: app.email,
      phone: app.phone,
      dob: app.dob,
      gender: app.gender,
      address: app.address,
      program: app.program,
      applicationRef: app._id
    });
    await newStudent.save();

    // 4. Create User Account
    const defaultPassword = app.phone.replace(/\D/g, ''); 
    const newUser = new User({
      name: `${app.firstName} ${app.lastName}`,
      email: app.email,
      password: defaultPassword,
      role: 'student'
    });
    await newUser.save();


    // 5. Create Initial Fee Record (Admission Fee)
    const newFee = new Fee({
      studentEmail: app.email,
      invoiceId: `INV-${year}-${Math.floor(Math.random() * 9000 + 1000)}`,
      description: 'Admission & Term 1 Tuition Fee',
      amount: 1200,
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) // Due in 1 month
    });
    await newFee.save();

    // 6. Create Initial Assignment
    const newAssignment = new Assignment({
      studentEmail: app.email,
      title: 'Introduction to Computing - Quiz 1',
      subject: 'CS 101',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Due in 7 days
      teacher: 'Prof. Smith',
      status: 'Pending'
    });
    await newAssignment.save();

    // 7. Update application status
    app.status = 'Enrolled';
    app.statusClass = 'status-approved';
    await app.save();

    res.json({ 
      success: true, 
      student: newStudent, 
      msg: `Student enrolled successfully! Portal access granted. Password: ${defaultPassword}` 
    });
  } catch (err) {
    console.error('Enrollment Error:', err);
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Delete an application
router.delete('/:id', async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ success: false, msg: 'Application not found' });
    res.json({ success: true, msg: 'Application deleted from database successfully' });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

module.exports = router;
