const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const Role = require('./models/Role');

const roles = [
  {
    title: "Student",
    icon: "fas fa-user-graduate",
    permissions: [
      { name: "View Timetable", enabled: true },
      { name: "Submit Assignments", enabled: true },
      { name: "View Results", enabled: true },
      { name: "Access Library", enabled: true },
    ]
  },
  {
    title: "Parent",
    icon: "fas fa-user-friends",
    permissions: [
      { name: "View Student Progress", enabled: true },
      { name: "View Attendance", enabled: true },
      { name: "Pay Fees Online", enabled: true },
      { name: "Communicate with Teachers", enabled: true },
    ]
  },
  {
    title: "Department Head",
    icon: "fas fa-user-shield",
    permissions: [
      { name: "Manage Faculty", enabled: true },
      { name: "Approve Results", enabled: true },
      { name: "Resource Allocation", enabled: true },
      { name: "Audit Attendance", enabled: true },
    ]
  }
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  for (const role of roles) {
    await Role.findOneAndUpdate({ title: role.title }, role, { upsidert: true, new: true, upsert: true });
  }
  console.log('Roles seeded successfully');
  process.exit(0);
});
