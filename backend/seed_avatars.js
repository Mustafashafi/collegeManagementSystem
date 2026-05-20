require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAvatars = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Find all admins, superadmins, and crm users
    const users = await User.find({ role: { $in: ['admin', 'super-admin', 'crm'] } });
    console.log(`Found ${users.length} users in admin roles.`);

    for (const user of users) {
      // Use pravatar for realistic human faces based on email
      user.profileImage = `https://i.pravatar.cc/300?u=${user.email}`;
      await user.save();
      console.log(`Assigned avatar to ${user.name} (${user.role})`);
    }

    console.log('Successfully updated all admin profiles!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedAvatars();
