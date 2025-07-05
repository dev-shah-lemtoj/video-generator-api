const Site = require('../models/siteModel');

// GET all sites
exports.getAllSites = async (req, res) => {
  try {
    const sites = await Site.find();
    res.json(sites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sites' });
  }
};

// CREATE new site
exports.createSite = async (req, res) => {
  const { name, siteId } = req.body;
  if (!name || !siteId) {
    return res.status(400).json({ error: 'Name and Site ID are required' });
  }

  try {
    const site = new Site({ name, siteId });
    await site.save();
    res.status(201).json(site);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create site' });
  }
};

// UPDATE site by ID
exports.updateSite = async (req, res) => {
  const { name, siteId } = req.body;
  if (!name || !siteId) {
    return res.status(400).json({ error: 'Name and Site ID are required' });
  }

  try {
    const updated = await Site.findByIdAndUpdate(
      req.params.id,
      { name, siteId },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Site not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update site' });
  }
};

// DELETE site by ID
exports.deleteSite = async (req, res) => {
  try {
    const deletedSite = await Site.findByIdAndDelete(req.params.id);
    if (!deletedSite) {
      return res.status(404).json({ error: 'Site not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete site' });
  }
};
