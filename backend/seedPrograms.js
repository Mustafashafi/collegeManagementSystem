const mongoose = require('mongoose');
const Program = require('./models/Program');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const seedPrograms = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB...');

    const programs = [
      {
        name: 'B.Eng (Mechanical Engineering)',
        year: '1st Year',
        subjects: [
          { name: 'Mechanical Basics', teacher: 'Dr. Sarah Mechanical', teacherEmail: 'sarah.mech@college.edu' },
          { name: 'Advanced Mechanical', teacher: 'Dr. Sarah Mechanical', teacherEmail: 'sarah.mech@college.edu' },
          { name: 'Cloud Computing', teacher: 'John Teacher', teacherEmail: 'john.teacher@college.edu' },
          { name: 'Islamyat', teacher: 'Prof. Ahmed Islam', teacherEmail: 'ahmed.islam@college.edu' }
        ]
      },
      {
        name: 'BBA (Business Administration)',
        year: '1st Year',
        subjects: [
          { name: 'Business Basics', teacher: 'Dr. Mike Miller', teacherEmail: 'mike.miller@college.edu' },
          { name: 'Advanced Business', teacher: 'Dr. Mike Miller', teacherEmail: 'mike.miller@college.edu' },
          { name: 'Islamyat', teacher: 'Prof. Ahmed Islam', teacherEmail: 'ahmed.islam@college.edu' }
        ]
      },
      {
        name: 'B.Sc Computer Science',
        year: '1st Year',
        subjects: [
          { name: 'Islamyat', teacher: 'Prof. Ahmed Islam', teacherEmail: 'ahmed.islam@college.edu' },
          { name: 'Cloud Computing', teacher: 'John Teacher', teacherEmail: 'john.teacher@college.edu' }
        ]
      }
    ];

    await Program.deleteMany({}); // Clear existing
    await Program.insertMany(programs);
    
    console.log('Programs seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedPrograms();
