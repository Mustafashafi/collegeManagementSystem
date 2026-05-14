const mongoose = require('mongoose');
const Student = require('./models/Student');
const Application = require('./models/Application');
require('dotenv').config({ path: '../.env' });

async function repairParentLinks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('--- Connected to MongoDB ---');

    const students = await Student.find({ parentEmail: { $exists: false } });
    console.log(`Found ${students.length} students without parent links.`);

    let repairedCount = 0;

    for (const student of students) {
      if (student.applicationRef) {
        const app = await Application.findById(student.applicationRef);
        if (app && app.parentEmail) {
          student.parentEmail = app.parentEmail;
          student.fatherName = app.fatherName;
          await student.save();
          console.log(`Repaired: ${student.firstName} ${student.lastName} -> Linked to ${app.parentEmail}`);
          repairedCount++;
        }
      } else {
        // Try matching by email if ref is missing
        const app = await Application.findOne({ email: student.email });
        if (app && app.parentEmail) {
          student.parentEmail = app.parentEmail;
          student.fatherName = app.fatherName;
          student.applicationRef = app._id;
          await student.save();
          console.log(`Repaired (via Email): ${student.firstName} ${student.lastName} -> Linked to ${app.parentEmail}`);
          repairedCount++;
        }
      }
    }

    console.log(`--- REPAIR COMPLETE ---`);
    console.log(`Successfully repaired ${repairedCount} student-parent links.`);
    process.exit(0);
  } catch (err) {
    console.error('Repair failed:', err);
    process.exit(1);
  }
}

repairParentLinks();
