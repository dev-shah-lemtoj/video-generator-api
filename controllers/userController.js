const User = require('../models/UserModel');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing' });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Save user
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User added successfully' });
};

module.exports = { getAllUsers,addUser };
