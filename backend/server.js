require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// DOUBLE CHECK THIS PATH:
// If your file is in a folder called 'config', use './config/db'
// If your file is just sitting next to server.js, use './db'
const connectDB = require('./config/db'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    res.send("Backend is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});