const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema({
  siteTitle: String,
  siteLogo: String,
  siteFavicon: String,
}, { collection: 'siteConfigs' });

const apiConfigSchema = new mongoose.Schema({
  apiSecretKey: String,
  siteId: String,
  mediaId: String,
}, { collection: 'apiConfigs' });

const SiteConfig = mongoose.model('SiteConfig', siteConfigSchema);
const ApiConfig = mongoose.model('ApiConfig', apiConfigSchema);

module.exports = { SiteConfig, ApiConfig };
