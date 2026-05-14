const mongoose = require('mongoose');
const Student = require('./models/Student');
const Application = require('./models/Application');
require('dotenv').config({ path: '../.env' });

async function debugShaheen() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const student = await Student.findOne({ firstName: 'Shaheen', lastName: 'Shah' });
    const application = await Application.findOne({ firstName: 'Shaheen', lastName: 'Shah' });
    
    console.log('--- SHAHEEN DEBUG ---');
    console.log('STUDENT RECORD:');
    if (student) {
      console.log('  ID:', student.studentId);
      console.log('  Father Name:', student.fatherName);
      console.log('  Parent Email:', student.parentEmail);
    } else {
      console.log('  Student not found');
    }
    
    console.log('APPLICATION RECORD:');
    if (application) {
      console.log('  ID:', application.appId);
      console.log('  Father Name:', application.fatherName);
      console.log('  Parent Email:', application.parentEmail);
      console.log('  Status:', application.status);
    } else {
      console.log('  Application not found');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debugShaheen();
