const mongoose = require('mongoose');
const Student = require('./models/Student');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Assign Islamyat to Bilal (CS Student)
  await Student.updateOne(
    { email: 'mustafashafi149@gmail.com' }, 
    { $addToSet: { secondarySubjects: 'Islamyat' } }
  );

  // Assign Islamyat to Shoaib (BBA Student)
  await Student.updateOne(
    { email: 'mustafashafi151@gmail.com' }, 
    { $addToSet: { secondarySubjects: 'Islamyat' } }
  );

  console.log('Secondary subjects assigned successfully');
  process.exit(0);
}
run();
