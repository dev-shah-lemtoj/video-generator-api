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
    userId: {
    type: mongoose.Schema.Types.ObjectId, // or just String if you're passing it that way
    required: true,
    ref: 'User' // optional: links to User model
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Export the model
module.exports = mongoose.model('Layout', layoutSchema);
