const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Fee = require('./models/Fee');
const Student = require('./models/Student');

const syncFees = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const fees = await Fee.find({ program: { $exists: false } });
    console.log(`🔍 Found ${fees.length} fee records without program field.`);

    let count = 0;
    for (const fee of fees) {
      const student = await Student.findOne({ email: fee.studentEmail });
      if (student) {
        fee.program = student.program;
        await fee.save();
        count++;
      }
    }

    console.log(`✅ Updated ${count} fee records with program information.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error syncing fees:', err);
    process.exit(1);
  }
};

syncFees();
