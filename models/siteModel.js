const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  siteId: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Site', siteSchema);
