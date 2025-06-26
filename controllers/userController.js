const User = require('../models/UserModel');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const addUser = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Request body is missing' });
  }

  const { name, email, password, roleId, siteId = [] } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const userCount = await User.countDocuments();
    const assignedRoleId = roleId || (userCount === 0 ? 1 : 2);

    const newUser = new User({ name, email, password, roleId: assignedRoleId, siteId });
    await newUser.save();

    res.status(201).json({ message: 'User added successfully', roleId: assignedRoleId });
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

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

const editUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, password, siteId = [] } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use by another user' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name;
    user.email = email;
    user.siteId = siteId;

    if (password && password.trim() !== '') {
      user.password = password;
      user.markModified('password'); // ✅ Ensures pre-save hook hashes the password
    }

    await user.save(); // ✅ Triggers pre('save') hook

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Edit User Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


const updateUserSites = async (req, res) => {
  const userId = req.params.id;
  const { sites } = req.body;

  if (!Array.isArray(sites)) {
    return res.status(400).json({ error: 'sites must be an array of { name, id }' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { siteId: sites }, // Assuming you're storing this in a `siteId` field
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'Sites updated successfully', user });
  } catch (error) {
    console.error('Error updating sites:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = { getAllUsers, addUser, deleteUser, editUser,updateUserSites };
