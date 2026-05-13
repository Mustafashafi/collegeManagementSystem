const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// ─────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. Validate input
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and role are required',
      });
    }

    // 2. Find user by email in MongoDB
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 3. Check if role matches
    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Access denied. You are not registered as ${role}`,
      });
    }

    // 4. Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact admin.',
      });
    }

    // 5. Compare password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 6. Update last login time
    user.lastLogin = new Date();
    await user.save();

    // 7. Generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' } // Token expires in 8 hours
    );

    // 8. Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/register (for testing)
// ─────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create new user
    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const Role = require('../models/Role');

// @route   GET /api/auth/permissions
// @desc    Get permissions for a specific role
router.get('/permissions', async (req, res) => {
  try {
    const { role } = req.query;
    if (!role) return res.status(400).json({ success: false, msg: 'Role is required' });

    // Find role by title (case insensitive or exact match depending on how you store it)
    // In seed_roles.js we used exact titles like "Teacher", "Student"
    // The request might be lowercase 'admin', 'teacher', etc.
    
    let roleDoc = await Role.findOne({ title: new RegExp('^' + role + '$', 'i') });
    
    if (!roleDoc) {
      // If not found, maybe it's 'admin' which often has full access
      if (role.toLowerCase() === 'admin') {
        return res.json({
          success: true,
          permissions: [
            { name: "Full System Access", enabled: true }
          ]
        });
      }
      return res.status(404).json({ success: false, msg: 'Role permissions not found' });
    }

    res.json({
      success: true,
      permissions: roleDoc.permissions
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

module.exports = router;