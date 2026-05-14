const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Role = require('./models/Role');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const role = await Role.findOne({ title: /^student$/i });
  if (!role) {
    console.log('Student role not found');
    process.exit(1);
  }

  role.permissions.forEach(p => {
    if (p.name === 'View Timetable' || p.name === 'Submit Assignments') {
      p.enabled = true;
    }
  });

  await role.save();
  console.log('✅ Student permissions updated:');
  console.log(JSON.stringify(role.permissions, null, 2));
  process.exit(0);
})();
