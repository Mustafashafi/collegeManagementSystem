const mongoose = require('mongoose');

const SuperAdminSettingsSchema = new mongoose.Schema({
  platformName: { type: String, default: 'EduSystem Global ERP' },
  supportEmail: { type: String, default: 'support@eduglobal.com' },
  mfaMandatory: { type: Boolean, default: true },
  globalApiAccess: { type: Boolean, default: false },
  maintenanceMode: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('SuperAdminSettings', SuperAdminSettingsSchema);
