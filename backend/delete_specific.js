const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const Fee = require('./models/Fee');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const ids = [
    'INV-1778666261732-S-2026-001-738', 
    'INV-1778666261732-S-2026-002-707', 
    'INV-1778666261732-S-2026-019-605'
  ];
  const result = await Fee.deleteMany({ invoiceId: { $in: ids } });
  console.log('Deleted:', result.deletedCount);
  process.exit(0);
});
