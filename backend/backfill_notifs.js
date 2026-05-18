const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const Fee = require('./models/Fee');
    const Assignment = require('./models/Assignment');
    const Student = require('./models/Student');
    const Notification = require('./models/Notification');
    const { createNotification } = require('./utils/notifier');

    // Backfill Fees (Pending/Under Review only)
    const fees = await Fee.find({ status: { $in: ['Pending', 'Partial', 'Under Review'] } });
    let feeNotifs = 0;
    for (const fee of fees) {
      const student = await Student.findOne({ email: fee.studentEmail });
      if (!student) continue;

      const exists = await Notification.findOne({
        recipientEmail: student.email,
        type: 'fee_payment',
        title: 'New Fee Invoice Assigned'
      });
      
      if (!exists) {
        await createNotification({
          recipientEmail: student.email,
          title: 'New Fee Invoice Assigned',
          message: `A fee invoice for "${fee.feeType}" of $${fee.amount} is due on ${new Date(fee.dueDate).toLocaleDateString()}.`,
          type: 'fee_payment',
          link: '/student/fees'
        });
        
        if (student.parentEmail) {
           await createNotification({
            recipientEmail: student.parentEmail,
            title: 'New Fee Invoice Assigned',
            message: `A fee invoice for "${fee.feeType}" of $${fee.amount} has been assigned to your child. Due: ${new Date(fee.dueDate).toLocaleDateString()}.`,
            type: 'fee_payment',
            link: '/parent/fees'
          });
        }
        feeNotifs++;
      }
    }
    console.log(`Created ${feeNotifs} retroactive fee notifications.`);

    // Backfill Assignments
    const assignments = await Assignment.find({ status: { $in: ['Pending', 'Submitted', 'Graded'] } });
    let assignNotifs = 0;
    for (const assignment of assignments) {
      const student = await Student.findOne({ email: assignment.studentEmail });
      if (!student) continue;

      const exists = await Notification.findOne({
        recipientEmail: student.email,
        type: 'assignment',
        title: 'New Assignment Released'
      });

      if (!exists) {
        await createNotification({
          recipientEmail: student.email,
          title: 'New Assignment Released',
          message: `"${assignment.title}" has been assigned for your subject: ${assignment.subject}.`,
          type: 'assignment',
          link: '/student/assignments'
        });

        if (student.parentEmail) {
          await createNotification({
            recipientEmail: student.parentEmail,
            title: 'New Assignment Assigned',
            message: `A new assignment "${assignment.title}" has been given to your child for ${assignment.subject}.`,
            type: 'assignment',
            link: '/parent/assignments'
          });
        }
        assignNotifs++;
      }
    }
    console.log(`Created ${assignNotifs} retroactive assignment notifications.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
connectDB();
