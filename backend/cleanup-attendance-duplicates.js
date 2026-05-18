const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const Attendance = require('./models/Attendance');

// Connect to MongoDB using environmental URI
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/collegeManagementSystem';

mongoose.connect(mongoURI)
.then(() => {
  console.log('MongoDB connected for attendance cleanup...');
  runCleanup();
})
.catch(err => {
  console.error('Connection error:', err);
});

async function runCleanup() {
  try {
    const allRecords = await Attendance.find().sort({ _id: -1 }); // Get latest records first
    console.log(`Found ${allRecords.length} total attendance records.`);

    const uniqueMap = new Set();
    const duplicatesToDelete = [];

    for (const record of allRecords) {
      // Normalize date to day-only (00:00:00 UTC)
      const dateObj = new Date(record.date);
      dateObj.setUTCHours(0, 0, 0, 0);
      const normalizedDateStr = dateObj.toISOString();

      const uniqueKey = `${record.studentEmail.toLowerCase().trim()}_${record.subject.toLowerCase().trim()}_${normalizedDateStr}`;

      if (uniqueMap.has(uniqueKey)) {
        // This is a duplicate record, mark it for deletion
        duplicatesToDelete.push(record._id);
      } else {
        // This is the latest unique record, keep it
        uniqueMap.add(uniqueKey);
      }
    }

    if (duplicatesToDelete.length > 0) {
      console.log(`Deleting ${duplicatesToDelete.length} duplicate attendance records...`);
      await Attendance.deleteMany({ _id: { $in: duplicatesToDelete } });
      console.log('Duplicate records successfully cleaned!');
    } else {
      console.log('No duplicate attendance records found.');
    }

    // Also let's normalize all remaining record timestamps to 00:00:00 UTC to prevent future mismatches
    console.log('Normalizing remaining attendance timestamps to start-of-day UTC...');
    const remainingRecords = await Attendance.find();
    let updatedCount = 0;
    for (const record of remainingRecords) {
      const dateObj = new Date(record.date);
      const originalTime = dateObj.getTime();
      dateObj.setUTCHours(0, 0, 0, 0);
      if (originalTime !== dateObj.getTime()) {
        record.date = dateObj;
        await record.save();
        updatedCount++;
      }
    }
    console.log(`Normalized ${updatedCount} records.`);

  } catch (err) {
    console.error('Error running cleanup:', err);
  } finally {
    mongoose.connection.close();
    console.log('Connection closed.');
  }
}
