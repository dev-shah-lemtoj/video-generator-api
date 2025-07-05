const Site = require('../models/siteModel');
const User = require('../models/UserModel');

// GET all sites
const getAllSites = async (req, res) => {
  try {
    const sites = await Site.find().populate('user', 'name');
    res.json(sites);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sites' });
  }
};

// ADD a site
const addSite = async (req, res) => {
  const { name, siteId, user } = req.body;
  if (!name || !siteId || !user) {
    return res.status(400).json({ error: 'name, siteId, and user are required' });
  }

  try {
    const userExists = await User.findById(user);
    if (!userExists) return res.status(404).json({ error: 'User not found' });

    const newSite = new Site({ name, siteId, user });
    await newSite.save();

    res.status(201).json({ message: 'Site added successfully', site: newSite });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add site' });
  }
};

// UPDATE site
const updateSite = async (req, res) => {
  const { name, siteId, user } = req.body;

  try {
    const updated = await Site.findByIdAndUpdate(
      req.params.id,
      { name, siteId, user },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Site not found' });

    res.json({ message: 'Site updated successfully', site: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update site' });
  }
};

// DELETE site
const deleteSite = async (req, res) => {
  try {
    const deleted = await Site.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Site not found' });

    res.json({ message: 'Site deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete site' });
  }
};

module.exports = { getAllSites, addSite, updateSite, deleteSite };
