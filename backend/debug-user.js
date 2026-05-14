const mongoose = require('mongoose');
const Student = require('./models/Student');
const User = require('./models/User');
require('dotenv').config({ path: '../.env' });

async function debugUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const email = 'mustafashafi143@gmail.com';
    
    const student = await Student.findOne({ email });
    const user = await User.findOne({ email });
    
    console.log('--- DEBUG INFO ---');
    console.log('Email:', email);
    console.log('Student Record Found:', !!student);
    if (student) console.log('Student Phone:', student.phone);
    
    console.log('User Record Found:', !!user);
    if (user) {
      console.log('User Role:', user.role);
      console.log('User Password (Plain):', user.password);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debugUser();
