const User = require('../models/UserModel');
const Role = require('../models/roleModel');
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
    let assignedRoleId = roleId;

    if (!assignedRoleId) {
      const defaultRoleName = userCount === 0 ? 'User' : 'Super Admin';
      const defaultRole = await Role.findOne({ name: defaultRoleName });
      if (!defaultRole) {
        return res.status(400).json({ error: `"${defaultRoleName}" role not found in system` });
      }
      assignedRoleId = defaultRole._id;
    }

    const newUser = new User({
      name,
      email,
      password,
      siteId,
      roleId: assignedRoleId,
      status: 0, // inactive
    });

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
  const { name, email, password, siteId = [], roleId, status } = req.body;

  if (!userId) return res.status(400).json({ error: 'User ID is required' });
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  try {
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use by another user' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.name = name;
    user.email = email;
    user.siteId = siteId;

    if (roleId !== undefined) {
      const roleExists = await Role.findById(roleId);
      if (!roleExists) return res.status(400).json({ error: 'Invalid role ID' });
      user.roleId = roleId;
    }

    if (status !== undefined) {
      user.status = status;
    }

    if (password && password.trim() !== '') {
      user.password = password;
      user.markModified('password');
    }

    await user.save();
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

const updateUserRole = async (req, res) => {
  const userId = req.params.id;
  const { roleId } = req.body;

  if (!roleId) {
    return res.status(400).json({ error: 'roleId is required' });
  }

  try {
    // Check if the role exists in the roles collection
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(400).json({ error: 'Invalid roleId. Role does not exist.' });
    }

    // Update user with valid roleId
    const user = await User.findByIdAndUpdate(
      userId,
      { roleId },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Role updated successfully', user });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = { getAllUsers, addUser, deleteUser, editUser,updateUserSites,updateUserRole};
