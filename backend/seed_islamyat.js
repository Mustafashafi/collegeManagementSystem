const mongoose = require('mongoose');
const User = require('./models/User');
const Teacher = require('./models/Teacher');
const Timetable = require('./models/Timetable');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const email = 'islamyat@college.com';
  const name = 'Prof. Ahmed Islam';

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email, password: '123456', role: 'teacher' });
  }

  let teacher = await Teacher.findOne({ email });
  if (!teacher) {
    teacher = await Teacher.create({ 
      name, email, 
      department: 'General Studies', 
      assignedClasses: ['Islamyat'],
      designation: 'Department Head',
      employeeId: 'EMP-9999'
    });
  }

  await Timetable.deleteMany({ teacher: name });
  await Timetable.create({
    program: 'All Programs', // Placeholder
    day: 'Friday',
    subject: 'Islamyat',
    time: '04:00 PM',
    room: 'Hall A',
    teacher: name
  });

  console.log('Islamyat teacher and schedule created');
  process.exit(0);
}
seed();
