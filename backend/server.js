// 1. Tell dotenv to look one folder UP (in the root) for the .env file
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');

// Import your DB connection
const connectDB = require('./config/db'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debugging: This will tell you if your variables are actually loading
if (!process.env.MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is undefined. Check your .env file path!");
}

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    res.send("College ERP Backend is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});