const mongoose = require('mongoose');
const Timetable = require('./models/Timetable');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const teacherName = 'Prof. Ahmed Islam';

  // Clear old shared entry
  await Timetable.deleteMany({ teacher: teacherName });

  // Create Department-Specific entries
  await Timetable.create([
    {
      program: 'B.Sc Computer Science',
      year: '1st Year',
      day: 'Friday',
      subject: 'Islamyat',
      time: '04:00 PM',
      room: 'Room 101',
      teacher: teacherName
    },
    {
      program: 'BBA (Business Administration)',
      year: '1st Year',
      day: 'Friday',
      subject: 'Islamyat',
      time: '05:00 PM',
      room: 'Room 102',
      teacher: teacherName
    }
  ]);

  console.log('Strict Departmental Timetable created for Islamyat');
  process.exit(0);
}
seed();
