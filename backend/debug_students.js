const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Student = require('./models/Student');

async function debugStudents() {
  await mongoose.connect(process.env.MONGODB_URI);
  const students = await Student.find({ email: { $in: ['mustafashafi143@gmail.com', 'mustafashafi148@gmail.com'] } });
  console.log(JSON.stringify(students, null, 2));
  process.exit(0);
}
debugStudents();
