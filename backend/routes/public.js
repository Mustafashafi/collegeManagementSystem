const express = require('express');
const router = express.Router();
const Program = require('../models/Program');

// @route   GET /api/public/programs
// @desc    Get all active programs for admission form
router.get('/programs', async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true }).sort({ name: 1 });
    res.json(programs);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

module.exports = router;
