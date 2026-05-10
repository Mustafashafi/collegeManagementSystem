const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Task = require('./models/Task');

const clear = async () => {
  await connectDB();
  const res = await Task.deleteMany({});
  console.log(`Deleted ${res.deletedCount} tasks.`);
  mongoose.connection.close();
};
clear();
