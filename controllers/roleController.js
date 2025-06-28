const Role = require('../models/roleModel.js');

// GET /api/roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// POST /api/roles
exports.createRole = async (req, res) => {
  const { name } = req.body;
  try {
    const existing = await Role.findOne({ name });
    if (existing) return res.status(400).json({ error: 'Role already exists' });

    const role = new Role({ name });
    await role.save();
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// PUT /api/roles/:id
exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updated = await Role.findByIdAndUpdate(id, { name }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Role not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// DELETE /api/roles/:id
exports.deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Role.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Role not found' });

    res.json({ message: 'Role deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};
