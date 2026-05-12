const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Teacher = require('./models/Teacher');
const User = require('./models/User');

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB...');

    const orphanedEmails = ['usama@gmail.com', 'shams@college.com', 'saeed@college.com'];

    for (const email of orphanedEmails) {
      const t = await Teacher.findOneAndDelete({ email });
      console.log(`Teacher ${email}:`, t ? 'DELETED' : 'Not found');

      const u = await User.findOneAndDelete({ email });
      console.log(`User ${email}:`, u ? 'DELETED' : 'Not found');
    }

    console.log('\n✅ Orphaned teachers cleaned up!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

cleanup();
