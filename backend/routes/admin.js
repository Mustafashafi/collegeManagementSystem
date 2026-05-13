const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Fee = require('../models/Fee');
const Application = require('../models/Application');
const User = require('../models/User');
const Book = require('../models/Book');
const BookRequest = require('../models/BookRequest');

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
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
      .sort({ createdAt: -1 });

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

    // Create Portal Account (User)
    const newUser = new User({
      name: `${firstName} ${lastName}`,
      email: email,
      password: phone, // Default password is phone number
      role: 'student'
    });
    await newUser.save();

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
// @desc    Update student record
router.put('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
// @desc    Get all fee records
router.get('/fees', async (req, res) => {
  try {
    const fees = await Fee.find().sort({ createdAt: -1 });
    res.json(fees);
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

module.exports = router;
