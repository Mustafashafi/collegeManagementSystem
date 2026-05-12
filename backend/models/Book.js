const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  totalCopies: { type: Number, required: true, default: 1 },
  availableCopies: { type: Number, required: true, default: 1 },
  location: { type: String }, // e.g. "Shelf A-12"
  status: { type: String, enum: ['Available', 'Out of Stock'], default: 'Available' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', BookSchema);
