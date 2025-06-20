const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const { getAllUsers, addUser, deleteUser } = require('../controllers/userController');
// GET /api/users - fetch all users
router.get('/', getAllUsers);

router.post('/', addUser);
router.delete('/:id', deleteUser); 

module.exports = router;