const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Get user profile by ID (protected)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    // Only allow users to view their own profile or add admin logic if needed
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ msg: 'Access denied.' });
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update user profile (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ msg: 'Access denied.' });
    }
    const updates = req.body;
    // Prevent password update here for security (handle separately)
    delete updates.password;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
