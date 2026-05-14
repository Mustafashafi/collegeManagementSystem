const mongoose = require('mongoose');
const Student = require('./models/Student');
require('dotenv').config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const students = await Student.find({ parentEmail: 'fahad@gmail.com' });
  if (students.length === 0) {
    console.log('No student linked to fahad@gmail.com');
  } else {
    students.forEach(s => {
      console.log('Student:', s.firstName, s.lastName);
      console.log('Phone (= Password):', s.phone);
      console.log('Student Email:', s.email);
    });
  }
  process.exit(0);
});
