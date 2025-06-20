const Layout = require('../models/layoutModel'); // Adjust the path as necessary

// Controller to save layout
exports.saveLayout = async (req, res) => {
  const { layout, siteTitle } = req.body;

  try {
    const newLayout = new Layout({ layout, siteTitle });
    await newLayout.save();
    res.status(200).json({ message: 'Layout saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving layout', error });
  }
};

// Controller to get all layouts
exports.getLayouts = async (req, res) => {
  try {
    const layouts = await Layout.find();
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
