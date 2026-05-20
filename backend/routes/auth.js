const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Define a strict rate limiter for login/register to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: { success: false, message: 'Too many login attempts from this IP, please try again after 15 minutes' },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// Middleware to handle validation errors cleanly
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

// ─────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────
router.post('/login', authLimiter, [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  body('role').notEmpty().withMessage('Role is required'),
  validateRequest
], asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  // Find user by email in MongoDB
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  // Check if role matches
  if (user.role !== role) {
    return res.status(403).json({ success: false, message: `Access denied. You are not registered as ${role}` });
  }

  // Check if account is active
  if (!user.isActive) {
    return res.status(403).json({ success: false, message: 'Your account has been deactivated. Contact admin.' });
  }

  // Compare password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  // Update last login time
  user.lastLogin = new Date();
  await user.save();

  // Get profile image (fallback to child's image for parents)
  let profileImage = user.profileImage;
  if (user.role === 'parent' && !profileImage) {
    const Student = require('../models/Student');
    const child = await Student.findOne({ parentEmail: user.email.toLowerCase() });
    if (child && child.profileImage) {
      profileImage = child.profileImage;
    }
  }

  // Generate JWT Token
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '8h' } // Token expires in 8 hours
  );

  // Send response
  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: profileImage,
    },
  });
}));

// ─────────────────────────────────────────
// POST /api/auth/register (for testing)
// ─────────────────────────────────────────
router.post('/register', authLimiter, [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').notEmpty().withMessage('Role is required'),
  validateRequest
], asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists with this email' });
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
}));

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

const multer = require('multer');
const path = require('path');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

// Configure the AWS S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

// Configure Multer to use S3 Storage
const profileUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: function (req, file, cb) {
      if (!process.env.AWS_BUCKET_NAME) {
        return cb(new Error('AWS_BUCKET_NAME environment variable is not set.'));
      }
      cb(null, process.env.AWS_BUCKET_NAME);
    },
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueFileName = 'profiles/profile-' + Date.now() + path.extname(file.originalname).toLowerCase();
      cb(null, uniqueFileName);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, and PNG images are allowed!'));
    }
  }
});

// @route   POST /api/auth/profile-image
// @desc    Upload profile image for any logged in user
router.post('/profile-image', profileUpload.single('avatar'), async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email) return res.status(400).json({ success: false, msg: 'Email is required' });
    if (!req.file) return res.status(400).json({ success: false, msg: 'No file uploaded' });

    const imageUrl = req.file.location;

    // 1. Update the User record always
    await User.findOneAndUpdate({ email }, { profileImage: imageUrl });

    // 2. Update role-specific collections
    if (role === 'student') {
      const Student = require('../models/Student');
      await Student.findOneAndUpdate({ email }, { profileImage: imageUrl });
    } else if (role === 'teacher') {
      const Teacher = require('../models/Teacher');
      await Teacher.findOneAndUpdate({ email }, { profileImage: imageUrl });
    }

    res.json({ success: true, profileImage: imageUrl });
  } catch (err) {
    console.error('Profile image upload error:', err);
    res.status(500).json({ success: false, msg: err.message });
  }
});

module.exports = router;