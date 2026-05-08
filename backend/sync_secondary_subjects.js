const mongoose = require('mongoose');
const Student = require('./models/Student');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function syncSecondary() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // 1. Get all students
  const students = await Student.find({});
  
  // 2. Group them by [program + year]
  const groups = {};
  students.forEach(s => {
    const key = `${s.program}|${s.year}`;
    if (!groups[key]) groups[key] = { students: [], secondarySubjects: new Set() };
    
    groups[key].students.push(s);
    if (s.secondarySubjects && s.secondarySubjects.length > 0) {
      s.secondarySubjects.forEach(sub => groups[key].secondarySubjects.add(sub));
    }
  });

  // 3. Apply the union of secondary subjects to every student in the group
  console.log('--- SYNCING SECONDARY SUBJECTS ---');
  for (const [key, data] of Object.entries(groups)) {
    const subjectArray = Array.from(data.secondarySubjects);
    if (subjectArray.length > 0) {
      console.log(`Syncing ${key}: [${subjectArray.join(', ')}]`);
      
      for (const student of data.students) {
        await Student.updateOne(
          { _id: student._id },
          { $set: { secondarySubjects: subjectArray } }
        );
      }
    }
  }

  console.log('--- SYNC COMPLETE ---');
  process.exit(0);
}
syncSecondary();
