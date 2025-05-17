const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const { getAllUsers, addUser } = require('../controllers/userController');
// GET /api/users - fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', addUser);


module.exports = router;