const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Result = require('./models/Result');

const clear = async () => {
  await connectDB();
  const res = await Result.deleteMany({});
  console.log(`Deleted ${res.deletedCount} results.`);
  mongoose.connection.close();
};
clear();
