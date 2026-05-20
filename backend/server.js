// 1. Tell dotenv to look one folder UP (in the root) for the .env file
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');

// Import your DB connection
const connectDB = require('./config/db'); 

const app = express();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false })); // Allowed for cross-origin image loads if any
app.use(cors());
app.use(express.json());

// Security: Prevent NoSQL Injection
app.use(mongoSanitize());

// Security: Prevent Cross-Site Scripting (XSS)
app.use(xss());

// Logging: See HTTP requests in the terminal
app.use(morgan('dev'));

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
app.use('/api/superadmin', require('./routes/superadmin'));

app.get('/', (req, res) => {
    res.send("College ERP Backend is running...");
});

app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/events', require('./routes/events'));
app.use('/api/results', require('./routes/results'));
app.use('/api/library', require('./routes/library'));
app.use('/api/public', require('./routes/public'));
app.use('/api/parents', require('./routes/parents'));
app.use('/api/notifications', require('./routes/notifications'));

// 404 Logger
app.use((req, res, next) => {
    console.log(`❌ 404 NOT FOUND: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler (must be the very last middleware)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});