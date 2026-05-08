const mongoose = require('mongoose');
const Attendance = require('./models/Attendance');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function clearAttendance() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  console.log('--- CLEARING ALL ATTENDANCE RECORDS ---');
  const result = await Attendance.deleteMany({});
  console.log(`Successfully deleted ${result.deletedCount} attendance records.`);

  console.log('--- SYSTEM RESET COMPLETE ---');
  process.exit(0);
}
clearAttendance();
