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

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const userCount = await User.countDocuments();
        // const roleId = userCount === 0 ? 1 : 2;
        const roleId = req.body.roleId || (userCount === 0 ? 1 : 2);

        const newUser = new User({ name, email, password, roleId });
        await newUser.save();

        res.status(201).json({ message: 'User added successfully', roleId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllUsers,addUser };
