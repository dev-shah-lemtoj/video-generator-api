const Layout = require('../models/layoutModel'); // Adjust the path as necessary

// Controller to save layout
exports.saveLayout = async (req, res) => {
  const { layout } = req.body;

  try {
    const newLayout = new Layout({ layout });
    await newLayout.save();
    res.status(200).json({ message: 'Layout saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving layout', error });
  }
};

// Controller to get all layouts
exports.getLayouts = async (req, res) => {
  try {
    const layouts = await Layout.find(); // Retrieve all layouts from the database
    res.status(200).json(layouts); // Send the layouts as a response
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving layouts', error });
  }
};
