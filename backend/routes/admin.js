const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Fee = require('../models/Fee');
const Application = require('../models/Application');
const User = require('../models/User');
const Book = require('../models/Book');
const BookRequest = require('../models/BookRequest');
const Assignment = require('../models/Assignment');

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    // Count parents by distinct parentEmail entries in Student collection so numbers always match
    const distinctParents = await Student.distinct('parentEmail', { parentEmail: { $ne: null, $ne: '' } });
    const totalParents = distinctParents.length;
    const totalTeachers = await Teacher.countDocuments();
    const newInquiries = await Application.countDocuments({
      appliedDate: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    // Sum of all paid fees
    const feesCollected = await Fee.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Library Stats
    const totalBooks = await Book.countDocuments();
    const currentlyIssued = await BookRequest.countDocuments({ status: 'Issued' });
    const pendingRequests = await BookRequest.countDocuments({ status: 'Pending' });

    res.json({
      totalStudents,
      totalParents,
      totalTeachers,
      newInquiries,
      feesCollected: feesCollected.length > 0 ? feesCollected[0].total : 0,
      library: {
        totalBooks,
        currentlyIssued,
        pendingRequests
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   GET /api/admin/reports
// @desc    Get real consolidated reports for the Admin Reports Tab
router.get('/reports', async (req, res) => {
  try {
    const { type } = req.query;

    if (type === 'admission') {
      const Lead = require('../models/Lead');
      const leads = await Lead.find();
      
      const conversionStats = {
        totalLeads: leads.length,
        admitted: leads.filter(l => l.status === 'Admitted').length,
        inProgress: leads.filter(l => ['Applied', 'Interview', 'Offer Extended', 'New Inquiry', 'Contacted', 'Interested', 'Application Submitted'].includes(l.status)).length,
        lost: leads.filter(l => ['Rejected', 'Inactive', 'Lost'].includes(l.status)).length,
      };
      
      const sources = {};
      leads.forEach(l => {
        const src = l.source || 'Other';
        sources[src] = (sources[src] || 0) + 1;
      });

      return res.json({ success: true, conversionStats, sources });
    }

    if (type === 'fees') {
      const Fee = require('../models/Fee');
      const defaulters = await Fee.find({ status: { $in: ['Pending', 'Partial'] } });
      return res.json({ success: true, defaulters });
    }

    if (type === 'attendance') {
      const Student = require('../models/Student');
      const Attendance = require('../models/Attendance');
      
      const students = await Student.find();
      const attendanceRecords = await Attendance.find();
      
      const defaulters = [];
      for (const student of students) {
        const studentLogs = attendanceRecords.filter(a => a.studentEmail === student.email);
        if (studentLogs.length > 0) {
          const present = studentLogs.filter(l => ['Present', 'Late'].includes(l.status)).length;
          const rate = (present / studentLogs.length) * 100;
          if (rate < 75) {
            defaulters.push({
              name: `${student.firstName} ${student.lastName}`,
              email: student.email,
              program: student.program,
              year: student.year,
              totalClasses: studentLogs.length,
              presentClasses: present,
              attendanceRate: rate.toFixed(1)
            });
          }
        } else {
          defaulters.push({
            name: `${student.firstName} ${student.lastName}`,
            email: student.email,
            program: student.program,
            year: student.year,
            totalClasses: 0,
            presentClasses: 0,
            attendanceRate: '0.0'
          });
        }
      }
      return res.json({ success: true, defaulters });
    }

    if (type === 'teacher-attendance') {
      const Teacher = require('../models/Teacher');
      const TeacherAttendance = require('../models/TeacherAttendance');
      
      const teachers = await Teacher.find();
      const attendance = await TeacherAttendance.find();
      
      const report = teachers.map(t => {
        const logs = attendance.filter(a => a.teacherEmail === t.email);
        const present = logs.filter(a => a.status === 'Present').length;
        const absent = logs.filter(a => a.status === 'Absent').length;
        const late = logs.filter(a => a.status === 'Late').length;
        const percentage = logs.length > 0 ? (((present + late) / logs.length) * 100).toFixed(1) : '0.0';
        
        return {
          name: t.name,
          email: t.email,
          teacherId: t.employeeId,
          present,
          absent,
          late,
          percentage
        };
      });
      return res.json({ success: true, report });
    }

    if (type === 'academic') {
      const Result = require('../models/Result');
      const results = await Result.find();

      const programs = {};
      results.forEach(r => {
        if (!r.program) return;
        if (!programs[r.program]) {
          programs[r.program] = { totalMarks: 0, obtainedMarks: 0, count: 0, subjectScores: {} };
        }
        programs[r.program].totalMarks += r.totalMarks;
        programs[r.program].obtainedMarks += r.marksObtained;
        programs[r.program].count += 1;
        
        if (!programs[r.program].subjectScores[r.subject]) {
          programs[r.program].subjectScores[r.subject] = { total: 0, obtained: 0, count: 0 };
        }
        programs[r.program].subjectScores[r.subject].total += r.totalMarks;
        programs[r.program].subjectScores[r.subject].obtained += r.marksObtained;
        programs[r.program].subjectScores[r.subject].count += 1;
      });

      const report = Object.keys(programs).map(progName => {
        const progData = programs[progName];
        const avgPercentage = progData.totalMarks > 0 ? ((progData.obtainedMarks / progData.totalMarks) * 100).toFixed(1) : '0.0';
        
        const subjectBreakdown = Object.keys(progData.subjectScores).map(subName => {
          const subData = progData.subjectScores[subName];
          const subAvg = subData.total > 0 ? ((subData.obtained / subData.total) * 100).toFixed(1) : '0.0';
          return { subjectName: subName, averageScore: subAvg };
        });

        return {
          program: progName,
          averageScore: avgPercentage,
          totalExams: progData.count,
          subjects: subjectBreakdown
        };
      });

      return res.json({ success: true, report });
    }

    res.status(400).json({ success: false, msg: 'Invalid report type requested' });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   GET /api/admin/students
// @desc    Get all students with pagination and search
router.get('/students', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', program = '', year = '', status = '' } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (program) query.program = program;
    if (year) query.year = year;
    if (status) query.status = status;

    const students = await Student.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ studentId: 1 });

    const count = await Student.countDocuments(query);

    res.json({
      students,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalEntries: count
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   GET /api/admin/teachers
// @desc    Get all teachers with filters
router.get('/teachers', async (req, res) => {
  try {
    const { department = '', search = '' } = req.query;
    const query = {};
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { teacherId: { $regex: search, $options: 'i' } }
      ];
    }

    const teachers = await Teacher.find(query).sort({ createdAt: -1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   POST /api/admin/teachers
// @desc    Add a new teacher
router.post('/teachers', async (req, res) => {
  try {
    const { name, email, phone, teacherId } = req.body;
    const targetEmployeeId = teacherId || `T-${Date.now().toString().slice(-4)}`;

    // 1. Check if email already exists in Users (Portal Accounts)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, msg: `Email ${email} is already registered as a ${existingUser.role}.` });
    }

    // 2. Check if email already exists in Teachers collection
    const existingTeacherEmail = await Teacher.findOne({ email });
    if (existingTeacherEmail) {
      return res.status(400).json({ success: false, msg: 'This email is already assigned to another teacher.' });
    }

    // 3. Check if Teacher ID (employeeId) already exists
    const existingId = await Teacher.findOne({ employeeId: targetEmployeeId });
    if (existingId) {
      return res.status(400).json({ success: false, msg: `Teacher ID ${targetEmployeeId} is already taken.` });
    }

    req.body.employeeId = targetEmployeeId;

    // Create Teacher Record
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();

    // Create Portal Account (User)
    const newUser = new User({
      name: name,
      email: email,
      password: phone, // Default password is phone number
      role: 'teacher'
    });
    await newUser.save();

    res.json({ success: true, teacher: newTeacher });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   DELETE /api/admin/teachers/:id
// @desc    Delete teacher record and all associated data
router.delete('/teachers/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (teacher) {
      // 1. Delete corresponding User account (Portal login)
      await User.findOneAndDelete({ email: teacher.email });

      // 2. Delete teacher attendance records
      await TeacherAttendance.deleteMany({ teacherEmail: teacher.email });

      // 3. Delete teacher slots from Timetable
      await Timetable.deleteMany({ teacher: teacher.name });

      // 4. Delete teacher record itself
      await Teacher.findByIdAndDelete(req.params.id);

      res.json({ success: true, msg: 'Teacher and all associated data (Portal, Attendance, Timetable) deleted successfully' });
    } else {
      res.status(404).json({ success: false, msg: 'Teacher not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   POST /api/admin/students
// @desc    Add a new student
router.post('/students', async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    // Create Student Record
    const newStudent = new Student(req.body);
    await newStudent.save();

    // 2. Create Portal Account (User)
    const newUser = new User({
      name: `${firstName} ${lastName}`,
      email: email,
      password: phone, // Default password is phone number
      role: 'student'
    });
    await newUser.save();

    // 2.5 Create Parent Portal Account if parentEmail exists
    if (req.body.parentEmail) {
      const parentEmail = req.body.parentEmail.toLowerCase();
      const existingParent = await User.findOne({ email: parentEmail });
      
      if (!existingParent) {
        const newParent = new User({
          name: req.body.fatherName || `Parent of ${firstName}`,
          email: parentEmail,
          password: phone, // Use student phone as default parent password too
          role: 'parent'
        });
        await newParent.save();
        console.log(`--- Parent Portal Created: ${parentEmail} ---`);
      }
    }

    // 3. Auto-assign existing assignments for this class
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
    }

    res.json({ success: true, student: newStudent });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   PUT /api/admin/students/:id
// @desc    Update student record + sync portals
router.put('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // 1. Create Parent Portal Account if parentEmail is being set and doesn't exist yet
    if (req.body.parentEmail) {
      const parentEmail = req.body.parentEmail.toLowerCase();
      const existingParent = await User.findOne({ email: parentEmail });
      
      if (!existingParent) {
        const newParent = new User({
          name: req.body.fatherName || `Parent of ${student.firstName}`,
          email: parentEmail,
          password: student.phone, // Parent password = student's phone number
          role: 'parent'
        });
        await newParent.save();
        console.log(`--- Parent Portal Created during Update: ${parentEmail} ---`);
      }
    }

    // 2. If phone number changed, sync password for BOTH student AND parent portals
    if (req.body.phone) {
      // 2a. Update Student Portal password
      const studentUser = await User.findOne({ email: student.email });
      if (studentUser) {
        studentUser.password = req.body.phone;
        await studentUser.save(); // Triggers bcrypt hashing middleware
        console.log(`--- Sync: Student password updated for ${student.email} ---`);
      }

      // 2b. Update Parent Portal password (if linked)
      if (student.parentEmail) {
        const parentUser = await User.findOne({ email: student.parentEmail });
        if (parentUser) {
          parentUser.password = req.body.phone;
          await parentUser.save(); // Triggers bcrypt hashing middleware
          console.log(`--- Sync: Parent password updated for ${student.parentEmail} ---`);
        }
      }
    }

    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   DELETE /api/admin/students/:id
// @desc    Delete student record
router.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (student) {
      // Delete corresponding User account
      await User.findOneAndDelete({ email: student.email });
      // Delete student record
      await Student.findByIdAndDelete(req.params.id);
    }
    res.json({ success: true, msg: 'Student and portal account deleted' });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   GET /api/admin/fees
// @desc    Get all fee records with filters
router.get('/fees', async (req, res) => {
  try {
    const { status, program } = req.query;
    const query = {};
    if (status && status !== 'All Status') {
      if (status === 'Paid (Full)') query.status = 'Paid';
      if (status === 'Unpaid / Overdue') query.status = { $in: ['Pending', 'Partial'] };
    }
    if (program && program !== 'All Programs') {
      query.program = program;
    }

    const fees = await Fee.find(query).sort({ createdAt: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   POST /api/admin/fees
// @desc    Generate fee invoice(s)
router.post('/fees', async (req, res) => {
  try {
    const { studentEmail, studentName, program, year, feeType, amount, dueDate, description } = req.body;
    const { createNotification } = require('../utils/notifier');

    if (studentEmail) {
      // Check for existing invoice of same type
      const existing = await Fee.findOne({ studentEmail, feeType });
      if (existing) return res.status(400).json({ success: false, msg: `An invoice for ${feeType} already exists for this student.` });

      // Single student - we need to find their program
      const student = await Student.findOne({ email: studentEmail });
      const finalInvoiceId = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newFee = new Fee({
        studentEmail,
        studentName,
        program: student ? student.program : '',
        feeType,
        amount,
        dueDate,
        description,
        invoiceId: finalInvoiceId,
        status: 'Pending',
        amountPaid: 0
      });
      await newFee.save();

      // Notify student
      try {
        await createNotification({
          recipientEmail: studentEmail,
          title: 'New Fee Invoice Assigned',
          message: `A new fee invoice for "${feeType}" of $${amount} has been assigned to you. Due: ${new Date(dueDate).toLocaleDateString()}.`,
          type: 'fee_payment',
          link: '/student/fees'
        });
        // Notify parent
        if (student && student.parentEmail) {
          await createNotification({
            recipientEmail: student.parentEmail,
            title: 'New Fee Invoice Assigned',
            message: `A new fee invoice for "${feeType}" of $${amount} has been assigned to your child (${student.firstName} ${student.lastName}). Due: ${new Date(dueDate).toLocaleDateString()}.`,
            type: 'fee_payment',
            link: '/parent/fees'
          });
        }
      } catch (notifierErr) {
        console.error('Notifier failed (single fee):', notifierErr.message);
      }

      return res.json({ success: true, msg: 'Invoice generated for student' });

    } else if (program && year) {
      // Bulk generation for a class
      const students = await Student.find({ program, year });
      if (students.length === 0) return res.status(404).json({ success: false, msg: 'No students found in this program/year' });

      // Filter out students who already have an invoice of this type
      const existingFees = await Fee.find({ 
        studentEmail: { $in: students.map(s => s.email) },
        feeType 
      });
      const emailsWithFee = new Set(existingFees.map(f => f.studentEmail));
      const studentsToInvoiced = students.filter(s => !emailsWithFee.has(s.email));

      if (studentsToInvoiced.length === 0) {
        return res.status(400).json({ success: false, msg: `All students in this class already have an invoice for ${feeType}.` });
      }

      const feeRecords = studentsToInvoiced.map(s => ({
        studentEmail: s.email,
        studentName: `${s.firstName} ${s.lastName}`,
        program: s.program,
        feeType,
        amount,
        dueDate,
        description,
        invoiceId: `INV-${Date.now()}-${s.studentId || s._id}-${Math.floor(Math.random() * 1000)}`,
        status: 'Pending',
        amountPaid: 0
      }));

      await Fee.insertMany(feeRecords);

      // Notify all students + parents in bulk
      try {
        for (const student of studentsToInvoiced) {
          // Notify student
          await createNotification({
            recipientEmail: student.email,
            title: 'New Fee Invoice Assigned',
            message: `A new fee invoice for "${feeType}" of $${amount} has been assigned to you. Due: ${new Date(dueDate).toLocaleDateString()}.`,
            type: 'fee_payment',
            link: '/student/fees'
          });
          // Notify parent
          if (student.parentEmail) {
            await createNotification({
              recipientEmail: student.parentEmail,
              title: 'New Fee Invoice Assigned',
              message: `A new fee invoice for "${feeType}" of $${amount} has been assigned to your child (${student.firstName} ${student.lastName}). Due: ${new Date(dueDate).toLocaleDateString()}.`,
              type: 'fee_payment',
              link: '/parent/fees'
            });
          }
        }
      } catch (notifierErr) {
        console.error('Notifier failed (bulk fees):', notifierErr.message);
      }

      return res.json({ 
        success: true, 
        msg: `Invoices generated for ${studentsToInvoiced.length} students. ${students.length - studentsToInvoiced.length} skipped (duplicates).` 
      });
    } else {
      return res.status(400).json({ success: false, msg: 'Please provide either a student or a program/year' });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});


// @route   PUT /api/admin/fees/:id/record
// @desc    Record a payment
router.put('/fees/:id/record', async (req, res) => {
  try {
    const { amountPaid, mode } = req.body;
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ success: false, msg: 'Fee record not found' });

    fee.amountPaid = (fee.amountPaid || 0) + Number(amountPaid);
    if (fee.amountPaid >= fee.amount) {
      fee.status = 'Paid';
    } else if (fee.amountPaid > 0) {
      fee.status = 'Partial';
    }

    fee.paymentHistory = fee.paymentHistory || [];
    fee.paymentHistory.push({
      date: new Date(),
      amount: Number(amountPaid),
      mode
    });

    await fee.save();
    res.json({ success: true, fee });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   PUT /api/admin/fees/:id/review-receipt
// @desc    Accept or Reject a fee receipt
router.put('/fees/:id/review-receipt', async (req, res) => {
  try {
    const { action, reason } = req.body; // action: 'accept' or 'reject'
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ success: false, msg: 'Fee record not found' });

    if (action === 'accept') {
      fee.status = 'Paid';
      fee.amountPaid = fee.amount;
      fee.paymentHistory = fee.paymentHistory || [];
      fee.paymentHistory.push({
        date: new Date(),
        amount: fee.amount,
        mode: fee.pendingPaymentMode || 'Online Upload',
        receiptUrl: fee.receiptUrl
      });
      fee.rejectionReason = null;
      fee.pendingPaymentMode = null;
    } else if (action === 'reject') {
      fee.status = 'Rejected';
      fee.rejectionReason = reason || 'Your receipt was invalid or illegible. Please upload a clear, valid receipt.';
    } else {
      return res.status(400).json({ success: false, msg: 'Invalid action' });
    }

    await fee.save();

    // Notify Parent
    const { createNotification } = require('../utils/notifier');
    try {
      const student = await require('../models/Student').findOne({ email: fee.studentEmail });
      const parentEmail = student ? student.parentEmail : undefined;
      if (parentEmail) {
        await createNotification({
          recipientEmail: parentEmail,
          title: action === 'accept' ? 'Fee Payment Approved' : 'Fee Payment Rejected',
          message: action === 'accept'
            ? `Your receipt submission for "${fee.feeType}" has been reviewed and approved!`
            : `Your receipt submission for "${fee.feeType}" was rejected. Reason: ${fee.rejectionReason}`,
          type: 'fee_payment',
          link: '/parent/fees'
        });
      }
    } catch (notifierErr) {
      console.error('Notifier failed:', notifierErr.message);
    }

    res.json({ success: true, msg: `Receipt ${action}ed successfully.`, fee });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   DELETE /api/admin/fees/:id
// @desc    Delete a fee record
router.delete('/fees/:id', async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) return res.status(404).json({ success: false, msg: 'Fee record not found' });
    res.json({ success: true, msg: 'Fee record deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

const TeacherAttendance = require('../models/TeacherAttendance');

// @route   GET /api/admin/teacher-attendance
// @desc    Get teacher attendance for a specific date
router.get('/teacher-attendance', async (req, res) => {
  try {
    const { date } = req.query;
    const searchDate = date ? new Date(date) : new Date();
    searchDate.setHours(0, 0, 0, 0);
    const endDate = new Date(searchDate);
    endDate.setHours(23, 59, 59, 999);

    const attendance = await TeacherAttendance.find({
      date: { $gte: searchDate, $lte: endDate }
    });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   POST /api/admin/teacher-attendance
// @desc    Mark teacher attendance
router.post('/teacher-attendance', async (req, res) => {
  try {
    const { teacherEmail, status, date, checkIn, remarks } = req.body;
    const markDate = date ? new Date(date) : new Date();
    markDate.setHours(0, 0, 0, 0);

    let record = await TeacherAttendance.findOne({ teacherEmail, date: markDate });
    if (record) {
      record.status = status;
      record.checkIn = checkIn;
      record.remarks = remarks;
    } else {
      record = new TeacherAttendance({ teacherEmail, status, date: markDate, checkIn, remarks });
    }
    await record.save();
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

const Timetable = require('../models/Timetable');

// @route   GET /api/admin/classes
// @desc    Get all classes (Program + Year) with student counts and subjects
router.get('/classes', async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true });
    const students = await Student.aggregate([
      { $group: { _id: { program: "$program", year: "$year" }, count: { $sum: 1 } } }
    ]);

    const result = programs.map(p => {
      const studentStat = students.find(s => s._id.program === p.name && s._id.year === p.year);
      return {
        _id: p._id,
        title: p.name,
        badge: p.year,
        students: studentStat ? studentStat.count : 0,
        subjectsCount: p.subjects.length,
        subjects: p.subjects.map(s => ({ name: s.name, teacher: s.teacher || 'Unassigned' }))
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   GET /api/admin/teacher-attendance/report
// @desc    Get monthly attendance report for all teachers (or individual history)
router.get('/teacher-attendance/report', async (req, res) => {
  try {
    const { month, year, email } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    if (email) {
      // Individual history
      const history = await TeacherAttendance.find({
        teacherEmail: email,
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: 1 });
      return res.json(history);
    }

    const teachers = await Teacher.find();
    const attendance = await TeacherAttendance.find({
      date: { $gte: startDate, $lte: endDate }
    });

    const report = teachers.map(t => {
      const teacherLogs = attendance.filter(a => a.teacherEmail === t.email);
      const present = teacherLogs.filter(a => a.status === 'Present').length;
      const absent = teacherLogs.filter(a => a.status === 'Absent').length;
      const late = teacherLogs.filter(a => a.status === 'Late').length;
      const total = teacherLogs.length;
      const percentage = total > 0 ? ((present + late) / total * 100).toFixed(1) + '%' : '0%';

      return {
        _id: t._id,
        name: t.name,
        email: t.email,
        teacherId: t.teacherId,
        present,
        absent,
        late,
        total,
        percentage
      };
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   GET /api/admin/filters
// @desc    Get unique programs and departments for filters
router.get('/filters', async (req, res) => {
  try {
    const programs = await Program.distinct('name', { isActive: true });
    const departments = await Teacher.distinct('department');
    res.json({ programs, departments });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   GET /api/admin/librarians
// @desc    Get all librarians
router.get('/librarians', async (req, res) => {
  try {
    const librarians = await User.find({ role: 'librarian' }).select('-password').sort({ createdAt: -1 });
    res.json(librarians);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   POST /api/admin/librarians
// @desc    Add a new librarian
router.post('/librarians', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists with this email' });

    const newUser = new User({
      name,
      email,
      password: password || 'lib123', // default password
      role: 'librarian'
    });
    await newUser.save();
    res.json({ success: true, librarian: newUser });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   DELETE /api/admin/librarians/:id
// @desc    Delete a librarian
router.delete('/librarians/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, msg: 'Librarian deleted' });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

const Program = require('../models/Program');

// @route   GET /api/admin/programs
// @desc    Get all active programs
router.get('/programs', async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true }).sort({ name: 1 });
    res.json(programs);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   POST /api/admin/programs
// @desc    Add a new program with subjects and automate teacher portals
router.post('/programs', async (req, res) => {
  try {
    const { name, year, subjects } = req.body;

    // 1. Save the Program
    const newProgram = new Program(req.body);
    await newProgram.save();

    // 2. Automate Teacher Logic
    for (const sub of subjects) {
      if (sub.teacherEmail) {
        let teacher = await Teacher.findOne({ email: sub.teacherEmail });
        const classLabel = `${name} (${year})`;

        if (teacher) {
          // Update existing teacher
          if (!teacher.assignedClasses.includes(classLabel)) {
            teacher.assignedClasses.push(classLabel);
          }
          if (!teacher.subjects.includes(sub.name)) {
            teacher.subjects.push(sub.name);
          }
          await teacher.save();
        } else {
          // Create new teacher
          const teacherId = sub.teacherId || `T-${Date.now().toString().slice(-4)}`;
          const newTeacher = new Teacher({
            name: sub.teacher || 'Unassigned Teacher',
            email: sub.teacherEmail,
            employeeId: teacherId,
            department: 'General Studies', // Default department
            designation: 'Professor',
            phone: sub.teacherPhone || '',
            assignedClasses: [classLabel],
            subjects: [sub.name]
          });
          await newTeacher.save();

          // Create portal account
          const newUser = new User({
            name: sub.teacher || 'Unassigned Teacher',
            email: sub.teacherEmail,
            password: sub.teacherPhone || 'teacher123', // use phone as password or default
            role: 'teacher'
          });
          await newUser.save();
        }
      }
    }

    res.json({ success: true, program: newProgram });
  } catch (err) {
    console.error('Program creation error:', err);
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   DELETE /api/admin/programs/:id
// @desc    Delete a program and clean up orphaned teachers
router.delete('/programs/:id', async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ success: false, msg: 'Program not found' });

    const classLabel = `${program.name} (${program.year})`;

    // Check each teacher in this program's subjects
    for (const sub of program.subjects) {
      if (!sub.teacherEmail) continue;

      // Count how many OTHER programs also use this teacher
      const otherPrograms = await Program.countDocuments({
        _id: { $ne: program._id },
        'subjects.teacherEmail': sub.teacherEmail
      });

      if (otherPrograms === 0) {
        // Teacher is exclusive to this program — delete everything
        await Teacher.findOneAndDelete({ email: sub.teacherEmail });
        await User.findOneAndDelete({ email: sub.teacherEmail });
      } else {
        // Teacher is shared — just remove this class from their assignments
        await Teacher.findOneAndUpdate(
          { email: sub.teacherEmail },
          {
            $pull: {
              assignedClasses: classLabel,
              subjects: sub.name
            }
          }
        );
      }
    }

    // Delete the program itself
    await Program.findByIdAndDelete(req.params.id);
    res.json({ success: true, msg: 'Program and exclusive teachers deleted' });
  } catch (err) {
    console.error('Program delete error:', err);
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   GET /api/admin/timetable
// @desc    Get timetable by program and year
router.get('/timetable', async (req, res) => {
  try {
    const { program, year } = req.query;
    const query = {};
    if (program) query.program = program;
    if (year) query.year = year;
    const timetable = await Timetable.find(query);
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   POST /api/admin/timetable
// @desc    Add a new timetable entry
router.post('/timetable', async (req, res) => {
  try {
    const newEntry = new Timetable(req.body);
    await newEntry.save();

    // 1. Automatically assign subject and program to teacher's profile
    const teacher = await Teacher.findOne({ name: req.body.teacher });
    if (teacher) {
      if (!teacher.subjects.includes(req.body.subject)) {
        teacher.subjects.push(req.body.subject);
      }
      if (!teacher.assignedClasses.includes(req.body.program)) {
        teacher.assignedClasses.push(req.body.program);
      }
      await teacher.save();
    }

    // 2. Automatically update the Program (Classes & Subjects) subjects list
    const program = await Program.findOne({ name: req.body.program, year: req.body.year });
    if (program) {
      const subjectIndex = program.subjects.findIndex(s => s.name === req.body.subject);
      if (subjectIndex > -1) {
        // Update teacher if it changed
        program.subjects[subjectIndex].teacher = req.body.teacher;
        program.subjects[subjectIndex].teacherEmail = teacher ? teacher.email : '';
      } else {
        // Add new subject
        program.subjects.push({
          name: req.body.subject,
          teacher: req.body.teacher,
          teacherEmail: teacher ? teacher.email : ''
        });
      }
      await program.save();
    }

    res.json({ success: true, entry: newEntry });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   PUT /api/admin/timetable/:id
// @desc    Update a timetable entry
router.put('/timetable/:id', async (req, res) => {
  try {
    const entry = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Sync with Program on update as well
    const program = await Program.findOne({ name: entry.program, year: entry.year });
    if (program) {
      const subjectIndex = program.subjects.findIndex(s => s.name === entry.subject);
      if (subjectIndex > -1) {
        program.subjects[subjectIndex].teacher = entry.teacher;
        // Find teacher email for the update
        const teacher = await Teacher.findOne({ name: entry.teacher });
        program.subjects[subjectIndex].teacherEmail = teacher ? teacher.email : '';
        await program.save();
      }
    }

    res.json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   DELETE /api/admin/timetable/:id
// @desc    Delete a timetable entry
router.delete('/timetable/:id', async (req, res) => {
  try {
    const entry = await Timetable.findById(req.params.id);
    if (!entry) return res.status(404).json({ msg: 'Entry not found' });

    await Timetable.findByIdAndDelete(req.params.id);

    // Check if this was the last slot for this subject in this program
    const remainingSlots = await Timetable.findOne({
      program: entry.program,
      year: entry.year,
      subject: entry.subject
    });

    if (!remainingSlots) {
      // No more slots for this subject, remove from Program list
      const program = await Program.findOne({ name: entry.program, year: entry.year });
      if (program) {
        program.subjects = program.subjects.filter(s => s.name !== entry.subject);
        await program.save();
      }
    }

    res.json({ success: true, msg: 'Entry deleted and Program synced' });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

const Role = require('../models/Role');

// @route   GET /api/admin/roles
// @desc    Get all roles with user counts
router.get('/roles', async (req, res) => {
  try {
    let roles = await Role.find().sort({ createdAt: 1 });
    
    // Initialize defaults if empty
    if (roles.length === 0) {
      const defaults = [
        {
          title: "Teacher",
          icon: "fas fa-chalkboard-teacher",
          permissions: [
            { name: "Mark Attendance", enabled: true },
            { name: "Upload Results", enabled: true },
            { name: "Manage Assignments", enabled: true },
            { name: "Access Finance", enabled: false },
          ]
        },
        {
          title: "Librarian",
          icon: "fas fa-user-tie",
          permissions: [
            { name: "Manage Books", enabled: true },
            { name: "Issue Books", enabled: true },
            { name: "View Student Profile", enabled: true },
            { name: "Delete Records", enabled: false },
          ]
        },
        {
          title: "Admissions Officer",
          icon: "fas fa-user-check",
          permissions: [
            { name: "Manage Leads", enabled: true },
            { name: "Approve Applications", enabled: true },
            { name: "Marketing Campaigns", enabled: true },
            { name: "Edit Fee Structure", enabled: false },
          ]
        }
      ];
      await Role.insertMany(defaults);
      roles = await Role.find().sort({ createdAt: 1 });
    }

    // Map user counts
    const result = await Promise.all(roles.map(async (r) => {
      let count = 0;
      if (r.title === 'Teacher') count = await Teacher.countDocuments();
      else if (r.title === 'Librarian') count = await User.countDocuments({ role: 'librarian' });
      else if (r.title === 'Admissions Officer') count = await User.countDocuments({ role: 'crm' });
      else count = await User.countDocuments({ role: r.title.toLowerCase() });

      return {
        ...r.toObject(),
        count: `${count} Users`
      };
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   PUT /api/admin/roles/:id
// @desc    Update role permissions
router.put('/roles/:id', async (req, res) => {
  try {
    const { permissions } = req.body;
    const role = await Role.findByIdAndUpdate(req.params.id, { permissions }, { new: true });
    res.json({ success: true, role });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   POST /api/admin/roles
// @desc    Add a new role
router.post('/roles', async (req, res) => {
  try {
    const { title, icon, permissions } = req.body;
    const existing = await Role.findOne({ title });
    if (existing) return res.status(400).json({ msg: 'Role already exists' });

    const newRole = new Role({ title, icon, permissions });
    await newRole.save();
    res.json({ success: true, role: newRole });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// @route   DELETE /api/admin/roles/:id
// @desc    Delete a role
router.delete('/roles/:id', async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ success: false, msg: 'Role not found' });
    res.json({ success: true, msg: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

module.exports = router;
