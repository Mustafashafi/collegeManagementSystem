// 1. Tell dotenv to look one folder UP (in the root) for the .env file
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');

// Import your DB connection
const connectDB = require('./config/db'); 

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());

if (!process.env.MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is undefined. Check your .env file path!");
} else {
    console.log("✅ .env file loaded successfully");
    console.log("📧 EMAIL_USER:", process.env.EMAIL_USER ? "Configured" : "MISSING");
    console.log("📧 EMAIL_PASS:", process.env.EMAIL_PASS ? "Configured" : "MISSING");
}

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/email', require('./routes/email'));

app.get('/', (req, res) => {
    res.send("College ERP Backend is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});