const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const Assignment = require('../models/Assignment');
const Timetable = require('../models/Timetable');
const Student = require('../models/Student');

// @route   GET /api/teachers/dashboard/:email
router.get('/dashboard/:email', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.params.email });
    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });

    const totalStudents = await Student.countDocuments({
      $or: [
        { program: { $in: teacher.assignedClasses } },
        { secondarySubjects: { $in: teacher.assignedClasses } }
      ]
    });

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

// @route   POST /api/teachers/assignments
router.post('/assignments', async (req, res) => {
  try {
    const { title, program, dueDate, subject, description, teacherName } = req.body;
    const students = await Student.find({ $or: [{ program: program }, { secondarySubjects: subject }] });
    if (students.length === 0) return res.status(400).json({ msg: 'No students found' });

    const assignmentDocs = students.map(student => ({
      studentEmail: student.email, title, subject, dueDate, teacher: teacherName, status: 'Pending'
    }));

    await Assignment.insertMany(assignmentDocs);
    res.json({ success: true, count: students.length });
  } catch (err) {
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
      const isCorrectBatch = studentProgram === cleanTarget && studentYear === cleanYear;

      // If we are looking for a specific subject (like Islamyat)
      // Check if it's their secondary subject OR if they are part of the program roster
      return isCorrectBatch;
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

module.exports = router;
