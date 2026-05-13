const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  studentName: { type: String },
  invoiceId: { type: String, required: true, unique: true },
  feeType: { type: String, required: true },
  description: { type: String },
  amount: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Paid', 'Pending', 'Partial'], default: 'Pending' },
  program: { type: String },
  paidDate: { type: Date },
  paymentHistory: [
    {
      amount: Number,
      date: { type: Date, default: Date.now },
      mode: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Fee', FeeSchema);
