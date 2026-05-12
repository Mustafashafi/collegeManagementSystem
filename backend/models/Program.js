const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. B.Sc Computer Science
  year: { type: String, required: true }, // e.g. 1st Year
  subjects: [{
    name: { type: String, required: true },
    teacher: { type: String }, // optional default teacher name
    teacherEmail: { type: String } // unique identifier for portal linkage
  }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Program', ProgramSchema);
