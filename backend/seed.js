require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedUsers = async () => {
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected Successfully');

    console.log('🔄 Syncing users (no deletion)...');

    const users = [
      {
        name: 'Super Admin',
        email: 'super@college.com',
        password: '123456',
        role: 'superadmin',
        isActive: true
      },
      {
        name: 'System Admin',
        email: 'admin@college.com',
        password: '123456',
        role: 'admin',
        isActive: true
      },
      {
        name: 'John Teacher',
        email: 'teacher@college.com',
        password: '123456',
        role: 'teacher',
        isActive: true
      },
      {
        name: 'Alex Student',
        email: 'student@college.com',
        password: '123456',
        role: 'student',
        isActive: true
      },
      {
        name: 'Sarah Librarian',
        email: 'librarian@college.com',
        password: '123456',
        role: 'librarian',
        isActive: true
      },
      {
        name: 'Mike CRM',
        email: 'crm@college.com',
        password: '123456',
        role: 'crm',
        isActive: true
      },
      {
        name: 'Robert Parent',
        email: 'parent@college.com',
        password: '123456',
        role: 'parent',
        isActive: true
      }
    ];

    for (let userData of users) {

      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        console.log(`🔄 Updating: ${userData.email}`);

        existingUser.name = userData.name;
        existingUser.role = userData.role;
        existingUser.isActive = userData.isActive;

        // ✅ DO NOT update password automatically every time
        await existingUser.save();

      } else {
        console.log(`➕ Creating: ${userData.email}`);
        await User.create(userData);
      }
    }

    console.log('✅ DATABASE SYNC COMPLETE');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedUsers();