const mongoose = require('mongoose');
const Site = require('../models/siteModel');
const Layout = require('../models/layoutModel');
const User = require('../models/UserModel');
// Controller to save layout
exports.saveLayout = async (req, res) => {
  const { layout, siteTitle, userId, siteId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }

  if (!siteId) {
    return res.status(400).json({ message: 'Missing siteId' });
  }

  try {
    const newLayout = new Layout({
      layout,
      siteTitle,
      userId,
      siteId // ensure it's an ObjectId
    });

    await newLayout.save();

    res.status(200).json({
      message: 'Layout saved successfully!',
      _id: newLayout._id,
      layout: newLayout.layout,
      siteTitle: newLayout.siteTitle,
      siteId: newLayout.siteId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving layout', error });
  }
};

// Controller to get all layouts (optionally filtered by userId or siteId)
exports.getLayouts = async (req, res) => {
  try {
    const { userId, siteId } = req.query;

    const filter = {};
    if (userId) filter.userId = userId;
    if (siteId) filter.siteId = siteId;

    const layouts = await Layout.find(filter)
      .populate('siteId') // include site details
      .sort({ createdAt: 1 });

    res.status(200).json(layouts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving layouts', error });
  }
};

exports.getLayoutById = async (req, res) => {
  const { id } = req.params;

  try {
    const layout = await Layout.findById(id);
    if (!layout) return res.status(404).json({ message: 'Layout not found' });

    // 👇 manually fetch Site info using the string siteId
    const site = await Site.findOne({ siteId: layout.siteId });
    if (!site) return res.status(404).json({ message: 'Site not found' });

    // 👇 manually fetch User info using the string userId
    const user = await User.findOne({ _id: layout.userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // attach full site & user info to response
    res.status(200).json({
      ...layout.toObject(), // convert Mongoose doc to plain object
      site, // include site details
      user  // include user details
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving layout', error });
  }
};

// Controller to update layout by ID
exports.updateLayoutById = async (req, res) => {
  const { id } = req.params;
  const { layout, siteTitle } = req.body;

  const updateData = { layout, siteTitle }; // ✅ No siteId here

  try {
    const updatedLayout = await Layout.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('siteId');

    if (!updatedLayout) {
      return res.status(404).json({ message: 'Layout not found' });
    }

    res.status(200).json({
      message: 'Layout updated successfully',
      updatedLayout
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating layout', error });
  }
};

// Controller to delete layout by ID
exports.deleteLayoutById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLayout = await Layout.findByIdAndDelete(id);

    if (!deletedLayout) {
      return res.status(404).json({ message: 'Layout not found' });
    }

    res.status(200).json({ message: 'Layout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting layout', error });
  }
};

// Controller to count layouts by user
exports.getLayoutCountByUser = async (req, res) => {
  try {
    const count = await Layout.countDocuments({ userId: req.params.userId });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Error fetching layout count" });
  }
};
