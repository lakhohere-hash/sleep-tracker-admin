const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // For now, simple authentication
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // In real app, use bcrypt for password hashing
    if (password !== 'admin123') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token (in real app, use JWT)
    const token = 'real-jwt-token-' + Date.now();
    
    res.json({
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;