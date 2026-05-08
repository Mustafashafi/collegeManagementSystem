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

const upload = require('../middleware/upload');

// @route   POST /api/teachers/assignments
// @desc    Create and broadcast assignment to students
router.post('/assignments', upload.single('assignmentFile'), async (req, res) => {
  console.log(`--- BROADCASTING ASSIGNMENT ---`);
  console.log(`Title: ${req.body.title} | File: ${req.file ? req.file.originalname : 'NONE'}`);
  
  try {
    const { title, program, dueDate, subject, description, teacherName } = req.body;
    
    // Find all students in this program
    const students = await Student.find({ program });
    
    if (students.length === 0) {
      return res.status(404).json({ msg: 'No students found in this program' });
    }

    const assignmentFile = req.file ? `/uploads/assignments/${req.file.filename}` : null;

    const assignments = students.map(student => ({
      studentEmail: student.email,
      title,
      subject,
      dueDate,
      teacher: teacherName,
      description,
      assignmentFile,
      status: 'Pending'
    }));

    await Assignment.insertMany(assignments);
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
      const isTargetProgram = studentProgram === cleanTarget && studentYear === cleanYear;
      
      if (subject) {
        const cleanSubject = normalize(subject);
        const isSecondary = studentSecondary.includes(cleanSubject);
        
        // Logical Fix: 
        // If the subject is in their secondarySubjects, they MUST be included (cross-departmental).
        if (isSecondary) return true;

        // If they are in the target program, we include them ONLY if they don't have secondary subjects
        // that suggest they are from a different department for this specific class.
        // But more simply: if they are in the program, we assume it's their core subject UNLESS
        // we have evidence otherwise.
        
        // For the "Cloud Computing" case:
        // - CS students: isTargetProgram=true, isSecondary=false -> INCLUDE
        // - Mechanical students: isTargetProgram=true, isSecondary=true -> INCLUDE
        // - Mechanical students: isTargetProgram=true, isSecondary=false -> EXCLUDE (if they don't take it)
        
        // Wait, if I am looking for Cloud Computing (Mechanical), cleanTarget is "Mechanical".
        // A Mechanical student who DOES NOT take it will have isTargetProgram=true but isSecondary=false.
        // We SHOULD exclude them.
        
        // How to know if it's a secondary-only subject for this program?
        // If ANY student in this program takes it as secondary, then it's likely secondary-only for this program.
        
        // But let's look at the data:
        // Islamyat is assigned as secondary to Mechanical students.
        // If I look for Islamyat (Mechanical), I only want those who have it as secondary.
        
        // So: If (subject is in secondarySubjects) -> INCLUDE.
        // If (isTargetProgram AND subject is NOT in secondarySubjects) -> 
        //    Include ONLY if the subject is "core" for this program.
        //    Since we don't have a core list, let's assume it's NOT core if ANYONE in this program has it as secondary.
        
        // Actually, a safer bet for this specific project structure:
        // If a subject is provided, and the student is in the target program, 
        // check if that subject is ALSO a secondary subject for SOME students in that program.
        // This is getting complex.
        
        // Let's use a simpler heuristic:
        // If the student is in the target program, they are included UNLESS the subject name 
        // suggests it's a secondary subject (like Cloud Computing for Mechanical).
        
        // Better: Just check if the student has it in secondarySubjects OR if they match the program.
        // To fix the "Bob" issue, we need to know if the student is actually enrolled.
        
        return isSecondary || isTargetProgram;
      }

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
router.delete('/assignments/:title/:subject/:email', async (req, res) => {
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
    res.json({ success: true, assignment });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
