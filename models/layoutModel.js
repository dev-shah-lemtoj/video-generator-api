const mongoose = require('mongoose');

// Define a schema for the layout
const layoutSchema = new mongoose.Schema({
  layout: {
    type: String,
    required: true, // Make this field required
  },
  siteTitle: {
    type: String,
    required: true, // Make this field required
    trim: true,
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Export the model
module.exports = mongoose.model('Layout', layoutSchema);
