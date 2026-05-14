const mongoose = require('mongoose');
const Student = require('./models/Student');
const User = require('./models/User');
require('dotenv').config({ path: '../.env' });

async function bulkUpdatePhoneNumbers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('--- Connected to MongoDB ---');

    const students = await Student.find({});
    console.log(`Found ${students.length} students to process.`);

    let updatedCount = 0;

    for (const student of students) {
      // Find the corresponding portal account
      const user = await User.findOne({ email: student.email });

      if (user && student.phone) {
        // We synchronize the password to the CURRENT student phone number
        // This ensures that if the student phone is "0336...", the password becomes "0336..." (hashed)
        user.password = student.phone;

        // .save() triggers the pre('save') hook in User.js which hashes the password
        await user.save();

        console.log(`Synced Portal Password for: ${student.email} -> ${student.phone}`);
        updatedCount++;
      }
    }

    console.log(`--- BULK SYNC COMPLETE ---`);
    console.log(`Successfully updated ${updatedCount} portal passwords.`);
    process.exit(0);
  } catch (err) {
    console.error('Bulk sync failed:', err);
    process.exit(1);
  }
}

bulkUpdatePhoneNumbers();
