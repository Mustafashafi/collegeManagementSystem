const mongoose = require('mongoose');
const Student = require('./models/Student');
const Assignment = require('./models/Assignment');
const Fee = require('./models/Fee');
require('dotenv').config({ path: '../.env' });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const email = 'masood@gmail.com';
  const newStudent = await Student.findOne({ email });

  if (!newStudent) {
    console.log('Student not found!');
    process.exit(1);
  }

  // 9. Auto-assign existing assignments for this class
  const classAssignments = await Assignment.aggregate([
    { $match: { program: newStudent.program, year: newStudent.year } },
    {
      $group: {
        _id: { title: "$title", subject: "$subject", teacher: "$teacher" },
        details: { $first: "$$ROOT" }
      }
    }
  ]);

  if (classAssignments.length > 0) {
    const studentAssignments = classAssignments.map(item => ({
      studentEmail: newStudent.email,
      title: item._id.title,
      subject: item._id.subject,
      teacher: item._id.teacher,
      program: newStudent.program,
      year: newStudent.year,
      dueDate: item.details.dueDate,
      description: item.details.description,
      assignmentFile: item.details.assignmentFile,
      status: 'Pending'
    }));
    await Assignment.insertMany(studentAssignments);
    console.log(`  ✅ Auto-assigned ${studentAssignments.length} past assignments.`);
  } else {
    console.log('No assignments found for program:', newStudent.program);
  }

  // 10. Auto-assign existing fees for this class
  const classFees = await Fee.aggregate([
    { $match: { program: newStudent.program } },
    {
      $group: {
        _id: { feeType: "$feeType", amount: "$amount", dueDate: "$dueDate" },
        details: { $first: "$$ROOT" }
      }
    }
  ]);

  if (classFees.length > 0) {
    const studentFees = classFees.map(item => ({
      studentEmail: newStudent.email,
      studentName: `${newStudent.firstName} ${newStudent.lastName}`,
      program: newStudent.program,
      feeType: item._id.feeType,
      amount: item._id.amount,
      dueDate: item._id.dueDate,
      description: item.details.description,
      invoiceId: `INV-${Date.now()}-${newStudent.studentId}-${Math.floor(Math.random() * 1000)}`,
      status: 'Pending',
      amountPaid: 0
    }));
    await Fee.insertMany(studentFees);
    console.log(`  ✅ Auto-assigned ${studentFees.length} past fee invoices.`);
  } else {
    console.log('No fees found for program:', newStudent.program);
  }

  process.exit(0);
});
