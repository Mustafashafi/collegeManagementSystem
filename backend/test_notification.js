const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { createNotification } = require('./utils/notifier');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Create a test notification for admin
  await createNotification({
    recipientRole: 'admin',
    title: 'Fee Receipt Submitted (TEST)',
    message: 'A fee receipt has been submitted for student Ali Hasan (Tuition Fee). Please review.',
    type: 'fee_payment',
    link: '/admin/fees'
  });

  console.log('Test notification created!');
  
  // Verify it exists
  const Notification = require('./models/Notification');
  const all = await Notification.find({ recipientRole: 'admin' });
  console.log(`Total admin notifications in DB: ${all.length}`);
  all.forEach(n => console.log(`  - ${n.title} | Read: ${n.isRead} | Created: ${n.createdAt}`));

  process.exit(0);
}

test().catch(err => { console.error(err); process.exit(1); });
