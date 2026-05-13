const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  icon: { type: String, default: 'fas fa-user' },
  permissions: [
    {
      name: { type: String, required: true },
      enabled: { type: Boolean, default: false }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);
