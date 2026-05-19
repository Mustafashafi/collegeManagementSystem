const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const Assignment = require('../models/Assignment');
const Timetable = require('../models/Timetable');
const Student = require('../models/Student');
const checkPermission = require('../middleware/permission');

// @route   GET /api/teachers/dashboard/:email
router.get('/dashboard/:email', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.params.email });
    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });

    // Build a smarter query for students
    // We want students who are in the programs/years assigned to the teacher
    // OR students who have the teacher's subjects as secondary subjects
    const studentQueries = [];

    // 1. Core Program Matching
    if (teacher.assignedClasses && teacher.assignedClasses.length > 0) {
      teacher.assignedClasses.forEach(classLabel => {
        // Handle labels like "BBA (Business Administration) (1st Year)"
        // Or "B.Eng (Mechanical Engineering)"
        const match = classLabel.match(/(.+)\s\((.+Year)\)$/);
        if (match) {
          const [_, program, year] = match;
          studentQueries.push({ program, year });
        } else {
          // Fallback to program-only matching
          studentQueries.push({ program: classLabel });
        }
      });
    }

    // 2. Secondary Subject Matching
    if (teacher.subjects && teacher.subjects.length > 0) {
      studentQueries.push({ secondarySubjects: { $in: teacher.subjects } });
    }

    let totalStudents = 0;
    if (studentQueries.length > 0) {
      totalStudents = await Student.countDocuments({ $or: studentQueries });
    }

    const fullSchedule = await Timetable.find({ teacher: teacher.name }).sort({ day: 1, time: 1 });
    const currentDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
    const schedule = fullSchedule.filter(s => s.day === currentDay);
    const recentAssignments = await Assignment.find({ teacher: teacher.name }).sort({ dueDate: -1 }).limit(10);

    const stats = {
      totalStudents,
      classesToday: schedule.length,
      assignmentsToGrade: await Assignment.countDocuments({ teacher: teacher.name, status: 'Submitted' })
    };

    res.json({ teacher, schedule, fullSchedule, recentAssignments, stats });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/teachers/assignments-all/:email
// @desc    Get all assignments for a teacher
router.get('/assignments-all/:email', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.params.email });
    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });

    const assignments = await Assignment.find({ teacher: teacher.name }).sort({ dueDate: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

const upload = require('../middleware/upload');

// @route   POST /api/teachers/assignments
// @desc    Create and broadcast assignment to students
router.post('/assignments', checkPermission('Teacher', 'Manage Assignments'), upload.single('assignmentFile'), async (req, res) => {
  console.log(`--- BROADCASTING ASSIGNMENT ---`);
  console.log(`Title: ${req.body.title} | File: ${req.file ? req.file.originalname : 'NONE'}`);
  
  try {
    const { title, program, year, dueDate, subject, description, teacherName } = req.body;
    
    // Find all students in this program and year
    const query = { program };
    if (year) query.year = year;
    const students = await Student.find(query);
    
    if (students.length === 0) {
      return res.status(404).json({ msg: 'No students found in this program' });
    }

    const assignmentFile = req.file ? `/uploads/assignments/${req.file.filename}` : null;

    const assignments = students.map(student => ({
      studentEmail: student.email,
      title,
      subject,
      program,
      year: student.year, // Use student's year if specific record
      dueDate,
      teacher: teacherName,
      description,
      assignmentFile,
      status: 'Pending'
    }));

    await Assignment.insertMany(assignments);

    // Create notifications for all students and parents
    const { createNotification } = require('../utils/notifier');
    try {
      for (const student of students) {
        // Notify Student
        await createNotification({
          recipientEmail: student.email,
          title: 'New Assignment Released',
          message: `"${title}" has been assigned for your subject: ${subject}.`,
          type: 'assignment',
          link: '/student/assignments'
        });

        // Notify Parent
        if (student.parentEmail) {
          await createNotification({
            recipientEmail: student.parentEmail,
            title: 'New Assignment Assigned',
            message: `A new assignment "${title}" has been given to your child for ${subject}.`,
            type: 'assignment',
            link: '/parent/assignments'
          });
        }
      }
    } catch (notifierErr) {
      console.error('Notifier failed:', notifierErr.message);
    }

    res.json({ success: true, count: assignments.length });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/teachers/students/:program
// @desc    Get students for a specific program/subject/year (Deep Cleanup Filter)
router.get('/students/:program', async (req, res) => {
  try {
    const { subject, year } = req.query;
    const targetProgram = req.params.program;
    const targetYear = year || '1st Year';

    console.log(`--- ROSTER REQUEST v4.0 ---`);
    console.log(`Target: [${targetProgram}] | Year: [${targetYear}] | Subject: [${subject}]`);

    // Helper to normalize strings for comparison (Removes dots, spaces, and converts to lowercase)
    const normalize = (str) => str ? str.toLowerCase().replace(/[\.\s-]/g, '') : '';

    const cleanTarget = normalize(targetProgram);
    const cleanYear = normalize(targetYear);

    // Fetch all students in the department's year to filter them in JS (most reliable)
    const allStudents = await Student.find({ status: 'Active' });

    const filtered = allStudents.filter(student => {
      const studentProgram = normalize(student.program);
      const studentYear = normalize(student.year);

      // Match Program & Year
      const studentSecondary = (student.secondarySubjects || []).map(s => normalize(s));
      const isTargetProgram = studentProgram === cleanTarget && studentYear === cleanYear;
      
      // To be in the roster for (Subject X, Program Y), the student MUST be in Program Y.
      return isTargetProgram;
    });

    console.log(`Filtered ${filtered.length} students from total ${allStudents.length}`);

    if (filtered.length === 0) {
      console.log('--- DIAGNOSTIC DATA ---');
      console.log(`Normalized Target: "${cleanTarget}"`);
      if (allStudents.length > 0) {
        console.log(`Sample Student Program: "${normalize(allStudents[0].program)}"`);
      }
    }

    res.json(filtered.sort((a, b) => a.lastName.localeCompare(b.lastName)));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/teachers/assignments/:title/:subject/:email
// @desc    Delete assignment by title, subject and teacher email (Consolidated Delete)
router.delete('/assignments/:title/:subject/:email', checkPermission('Teacher', 'Manage Assignments'), async (req, res) => {
  try {
    const { title, subject, email } = req.params;
    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });
    
    const result = await Assignment.deleteMany({ title, subject, teacher: teacher.name });
    res.json({ success: true, message: `Deleted ${result.deletedCount} assignment records.` });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/teachers/submissions/:title/:subject/:teacher
// @desc    Get all student submissions for an assignment
router.get('/submissions/:title/:subject/:teacher', async (req, res) => {
  try {
    const { title, subject, teacher } = req.params;
    const submissions = await Assignment.find({ title, subject, teacher }).sort({ status: 1 });
    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/teachers/grade/:id
// @desc    Grade an assignment submission
router.put('/grade/:id', async (req, res) => {
  try {
    const { grade, feedback, showGrade } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });

    assignment.status = 'Graded';
    assignment.grade = grade;
    assignment.feedback = feedback;
    assignment.showGrade = showGrade;
    await assignment.save();

    // Create notifications for student and parent
    const { createNotification } = require('../utils/notifier');
    try {
      // Notify Student
      await createNotification({
        recipientEmail: assignment.studentEmail,
        title: 'Assignment Graded',
        message: `Your assignment "${assignment.title}" has been graded. Grade: ${grade}.`,
        type: 'grade',
        link: '/student/assignments'
      });

      // Find student to get parentEmail
      const student = await Student.findOne({ email: assignment.studentEmail });
      if (student && student.parentEmail) {
        await createNotification({
          recipientEmail: student.parentEmail,
          title: 'Assignment Graded',
          message: `Your child's assignment "${assignment.title}" has been graded. Grade: ${grade}.`,
          type: 'grade',
          link: '/parent/assignments'
        });
      }
    } catch (notifierErr) {
      console.error('Notifier failed:', notifierErr.message);
    }

    res.json({ success: true, assignment });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/teachers/assignments/due-date
// @desc    Update due date for an assignment (All students)
router.put('/assignments/due-date', checkPermission('Teacher', 'Manage Assignments'), async (req, res) => {
  try {
    const { title, subject, teacherEmail, newDueDate } = req.body;
    const teacher = await Teacher.findOne({ email: teacherEmail });
    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });

    const result = await Assignment.updateMany(
      { title, subject, teacher: teacher.name },
      { dueDate: new Date(newDueDate) }
    );

    res.json({ success: true, updatedCount: result.modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/teachers/profile/:email
// @desc    Get teacher profile by email
router.get('/profile/:email', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.params.email });
    if (!teacher) return res.status(404).json({ success: false, msg: 'Teacher profile not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

module.exports = router;
