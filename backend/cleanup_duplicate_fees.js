const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Fee = require('./models/Fee');

const cleanupDuplicates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const duplicates = await Fee.aggregate([
      {
        $group: {
          _id: { email: '$studentEmail', type: '$feeType' },
          count: { $sum: 1 },
          ids: { $push: '$_id' }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    console.log(`🔍 Found ${duplicates.length} sets of duplicates.`);

    let deletedCount = 0;
    for (const dup of duplicates) {
      // Keep the first one, delete the rest
      const idsToDelete = dup.ids.slice(1);
      const result = await Fee.deleteMany({ _id: { $in: idsToDelete } });
      deletedCount += result.deletedCount;
      console.log(`🗑️ Deleted ${result.deletedCount} duplicates for ${dup._id.email} (${dup._id.type})`);
    }

    console.log(`✅ Total duplicates deleted: ${deletedCount}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error cleaning up duplicates:', err);
    process.exit(1);
  }
};

cleanupDuplicates();
