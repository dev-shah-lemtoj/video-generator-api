const User = require('../models/UserModel');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude password field
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
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

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ Always respond with JSON
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};



module.exports = { getAllUsers, addUser, deleteUser };
