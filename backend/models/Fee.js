const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  invoiceId: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
  paidDate: { type: Date }
});

module.exports = mongoose.model('Fee', FeeSchema);
