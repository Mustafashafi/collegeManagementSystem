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
      previousInstitution, passingYear, marks, program, fatherName, parentEmail
    } = req.body;

    // Generate unique Application ID: APP-YYYY-NNN
    const year = new Date().getFullYear();
    const lastApp = await Application.findOne({ appId: { $regex: `^APP-${year}` } }).sort({ appId: -1 });
    let nextNum = 1;
    if (lastApp) {
      const lastNum = parseInt(lastApp.appId.split('-')[2]);
      nextNum = lastNum + 1;
    }
    const appId = `APP-${year}-${nextNum.toString().padStart(3, '0')}`;

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
      fatherName,
      parentEmail,
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
// @desc    Enroll applicant as a student, create user account, and parent portal
router.post('/:id/enroll', async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ success: false, msg: 'Application not found' });

    console.log(`\n=== ENROLLMENT START: ${app.firstName} ${app.lastName} ===`);
    console.log(`  App ID: ${app.appId}`);
    console.log(`  Email: ${app.email}`);
    console.log(`  Phone: ${app.phone}`);
    console.log(`  Father Name: [${app.fatherName}]`);
    console.log(`  Parent Email: [${app.parentEmail}]`);

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: app.email });
    if (existingUser) return res.status(400).json({ success: false, msg: 'A user with this email already exists' });

    // 2. Generate Student ID (find highest existing ID numerically to avoid duplicates)
    const year = new Date().getFullYear();
    const existingStudents = await Student.find({ studentId: { $regex: `^S-${year}` } }, { studentId: 1 });
    
    let nextNum = 1;
    if (existingStudents.length > 0) {
      const maxNum = existingStudents.reduce((max, student) => {
        const parts = student.studentId.split('-');
        if (parts.length === 3) {
          const num = parseInt(parts[2], 10);
          return num > max ? num : max;
        }
        return max;
      }, 0);
      nextNum = maxNum + 1;
    }
    const studentId = `S-${year}-${nextNum.toString().padStart(3, '0')}`;

    // 3. Default password = student phone number (digits only)
    const defaultPassword = app.phone.replace(/\D/g, '');

    // 4. Create Student Record (with parent details from application)
    const studentData = {
      studentId,
      firstName: app.firstName,
      lastName: app.lastName,
      email: app.email,
      phone: app.phone,
      dob: app.dob,
      gender: app.gender,
      address: app.address,
      program: app.program,
      year: '1st Year',
      applicationRef: app._id
    };

    // Only set parent fields if they actually have values
    if (app.fatherName && app.fatherName.trim()) {
      studentData.fatherName = app.fatherName.trim();
    }
    if (app.parentEmail && app.parentEmail.trim()) {
      studentData.parentEmail = app.parentEmail.trim().toLowerCase();
    }

    const newStudent = new Student(studentData);
    await newStudent.save();
    console.log(`  ✅ Student Record Created: ${studentId}`);
    console.log(`  Student.fatherName = [${newStudent.fatherName}]`);
    console.log(`  Student.parentEmail = [${newStudent.parentEmail}]`);

    // 5. Create Student Portal Account
    const newUser = new User({
      name: `${app.firstName} ${app.lastName}`,
      email: app.email,
      password: defaultPassword,
      role: 'student'
    });
    await newUser.save();
    console.log(`  ✅ Student Portal Created: ${app.email} (pwd: ${defaultPassword})`);

    // 6. Create Parent Portal Account if parentEmail exists
    if (newStudent.parentEmail) {
      const parentEmail = newStudent.parentEmail;
      const existingParent = await User.findOne({ email: parentEmail });
      
      if (!existingParent) {
        const parentName = newStudent.fatherName || `Parent of ${app.firstName}`;
        const newParent = new User({
          name: parentName,
          email: parentEmail,
          password: defaultPassword, // Parent password = student's phone number
          role: 'parent'
        });
        await newParent.save();
        console.log(`  ✅ Parent Portal Created: ${parentEmail} (name: ${parentName}, pwd: ${defaultPassword})`);
      } else {
        console.log(`  ⚠️ Parent account already exists: ${parentEmail} — skipping creation`);
      }
    } else {
      console.log(`  ⚠️ No parentEmail found — skipping parent portal creation`);
    }

    // 7. Update application status
    app.status = 'Enrolled';
    app.statusClass = 'status-approved';
    await app.save();

    // 8. Automatically mark all CRM tasks for this person as 'Completed'
    const Lead = require('../models/Lead');
    const Task = require('../models/Task');
    const lead = await Lead.findOne({ email: app.email });
    if (lead) {
      await Task.updateMany({ lead: lead._id }, { status: 'Completed' });
    }

    // 9. Auto-assign existing assignments for this class
    const classAssignments = await Assignment.aggregate([
      { $match: { program: newStudent.program, year: newStudent.year } },
      {
        $group: {
          _id: { title: "$title", subject: "$subject", teacher: "$teacher" },
          details: { $first: "$$ROOT" }
        }
      }
    ]);

    if (classAssignments.length > 0) {
      const studentAssignments = classAssignments.map(item => ({
        studentEmail: newStudent.email,
        title: item._id.title,
        subject: item._id.subject,
        teacher: item._id.teacher,
        program: newStudent.program,
        year: newStudent.year,
        dueDate: item.details.dueDate,
        description: item.details.description,
        assignmentFile: item.details.assignmentFile,
        status: 'Pending'
      }));
      await Assignment.insertMany(studentAssignments);
      console.log(`  ✅ Auto-assigned ${studentAssignments.length} past assignments.`);
    }

    // 10. Auto-assign existing fees for this class
    const classFees = await Fee.aggregate([
      { $match: { program: newStudent.program } },
      {
        $group: {
          _id: { feeType: "$feeType", amount: "$amount", dueDate: "$dueDate" },
          details: { $first: "$$ROOT" }
        }
      }
    ]);

    if (classFees.length > 0) {
      const studentFees = classFees.map(item => ({
        studentEmail: newStudent.email,
        studentName: `${newStudent.firstName} ${newStudent.lastName}`,
        program: newStudent.program,
        feeType: item._id.feeType,
        amount: item._id.amount,
        dueDate: item._id.dueDate,
        description: item.details.description,
        invoiceId: `INV-${Date.now()}-${newStudent.studentId}-${Math.floor(Math.random() * 1000)}`,
        status: 'Pending',
        amountPaid: 0
      }));
      await Fee.insertMany(studentFees);
      console.log(`  ✅ Auto-assigned ${studentFees.length} past fee invoices.`);
    }

    console.log(`=== ENROLLMENT COMPLETE: ${app.firstName} ${app.lastName} ===\n`);

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
