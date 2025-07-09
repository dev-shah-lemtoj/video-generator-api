const Layout = require('../models/layoutModel'); // Adjust the path as necessary

// Controller to save layout
exports.saveLayout = async (req, res) => {
  const { layout, siteTitle, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }

  try {
    const newLayout = new Layout({ layout, siteTitle, userId });
    await newLayout.save();
    res.status(200).json({
      message: 'Layout saved successfully!',
      _id: newLayout._id, // ✅ Return ID here
      layout: newLayout.layout,
      siteTitle: newLayout.siteTitle,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving layout', error });
  }
};

// Controller to get all layouts
exports.getLayouts = async (req, res) => {
  try {
    const { userId } = req.query;

    const filter = userId ? { userId } : {}; // if userId exists, filter by it

    const layouts = await Layout.find(filter).sort({ createdAt:1 });
    res.status(200).json(layouts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving layouts', error });
  }
};

// Controller to get layout by ID
exports.getLayoutById = async (req, res) => {
  const { id } = req.params;

  try {
    const layout = await Layout.findById(id);

    if (!layout) {
      return res.status(404).json({ message: 'Layout not found' });
    }

    res.status(200).json(layout);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving layout', error });
  }
};

// Controller to update layout by ID
exports.updateLayoutById = async (req, res) => {
  const { id } = req.params;
  const { layout, siteTitle } = req.body;

  try {
    const updatedLayout = await Layout.findByIdAndUpdate(
      id,
      { layout, siteTitle },
      { new: true, runValidators: true }
    );

    if (!updatedLayout) {
      return res.status(404).json({ message: 'Layout not found' });
    }

    res.status(200).json({ message: 'Layout updated successfully', updatedLayout });
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

exports.getLayoutCountByUser = async (req, res) => {
  try {
    const count = await Layout.countDocuments({ userId: req.params.userId });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Error fetching layout count" });
  }
};
