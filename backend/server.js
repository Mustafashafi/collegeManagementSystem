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

if (!process.env.MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is undefined. Check your .env file path!");
} else {
    console.log("✅ .env file loaded successfully");
    console.log("📧 EMAIL_USER:", process.env.EMAIL_USER ? "Configured" : "MISSING");
    console.log("📧 EMAIL_PASS:", process.env.EMAIL_PASS ? "Configured" : "MISSING");
}

// Connect to Database
connectDB();

console.log("🚀 SERVER VERSION: 4.0 ACTIVE");

// Serve Uploaded Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/email', require('./routes/email'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/students', require('./routes/students'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => {
    res.send("College ERP Backend is running...");
});

app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/events', require('./routes/events'));
app.use('/api/results', require('./routes/results'));

// 404 Logger
app.use((req, res, next) => {
    console.log(`❌ 404 NOT FOUND: ${req.method} ${req.originalUrl}`);
    res.status(404).send(`Route ${req.originalUrl} not found`);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});