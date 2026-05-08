const mongoose = require('mongoose');
const Student = require('./models/Student');
const Timetable = require('./models/Timetable');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function assign() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const mechanicalEmails = ['mustafashafi143@gmail.com', 'mustafashafi148@gmail.com'];
  const subjects = ['Islamyat', 'Cloud Computing'];

  // 1. Assign secondary subjects to all mechanical students
  for (const email of mechanicalEmails) {
    await Student.updateOne(
      { email }, 
      { $addToSet: { secondarySubjects: { $each: subjects } } }
    );
  }

  // 2. Ensure Timetable has these sessions for Mechanical Department
  const timetableEntries = [
    {
      program: 'B.Eng (Mechanical Engineering)',
      year: '1st Year',
      day: 'Friday',
      subject: 'Islamyat',
      time: '06:00 PM',
      room: 'Room 303',
      teacher: 'Prof. Ahmed Islam'
    }
    // Cloud Computing session for Mechanical was already added in setup_john_teacher.js
  ];

  for (const entry of timetableEntries) {
    const exists = await Timetable.findOne({ 
      program: entry.program, 
      subject: entry.subject, 
      year: entry.year 
    });
    
    if (!exists) {
      await Timetable.create(entry);
    }
  }

  console.log('Secondary subjects (Islamyat, Cloud Computing) assigned to Mechanical students!');
  process.exit(0);
}
assign();
