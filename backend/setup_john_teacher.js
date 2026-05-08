const mongoose = require('mongoose');
const User = require('./models/User');
const Teacher = require('./models/Teacher');
const Timetable = require('./models/Timetable');
const Student = require('./models/Student');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function setup() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const email = 'teacher@college.com';
  const name = 'John Teacher';
  const subject = 'Cloud Computing';

  // 1. Create/Update Teacher User
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email, password: '123456', role: 'teacher' });
  }

  // 2. Create/Update Teacher Profile
  let teacher = await Teacher.findOne({ email });
  if (!teacher) {
    teacher = await Teacher.create({ 
      name, email, 
      department: 'Computer Science', 
      assignedClasses: ['B.Sc Computer Science', 'Cloud Computing'],
      designation: 'Senior Professor',
      employeeId: 'EMP-1001'
    });
  } else {
    teacher.assignedClasses = ['B.Sc Computer Science', 'Cloud Computing'];
    await teacher.save();
  }

  // 3. Assign Cloud Computing as secondary subject to Mechanical Student (Muhammad Mustafa)
  await Student.updateOne(
    { email: 'mustafashafi143@gmail.com' }, 
    { $addToSet: { secondarySubjects: subject } }
  );

  // 4. Update Timetable for John Teacher
  await Timetable.deleteMany({ teacher: name });
  await Timetable.create([
    {
      program: 'B.Sc Computer Science',
      year: '1st Year',
      day: 'Monday',
      subject: subject,
      time: '10:00 AM',
      room: 'Lab 4',
      teacher: name
    },
    {
      program: 'B.Eng (Mechanical Engineering)',
      year: '1st Year',
      day: 'Tuesday',
      subject: subject, // Secondary subject session
      time: '11:00 AM',
      room: 'Seminar Hall',
      teacher: name
    }
  ]);

  console.log('John Teacher profile and cross-departmental Cloud Computing setup complete!');
  process.exit(0);
}
setup();
