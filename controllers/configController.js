const fs = require('fs');
const { SiteConfig, ApiConfig } = require('../models/configModels');
const path = require('path');

exports.getSiteConfig = async (req, res) => {
  const config = await SiteConfig.findOne({}).lean();
  res.json({ siteConfig: config || {} });
};

exports.saveSiteConfig = async (req, res) => {
  const { siteTitle, removeSiteLogo, removeSiteFavicon } = req.body;
  const files = req.files || {};

  const siteLogoFile = files.siteLogo?.[0];
  const siteFaviconFile = files.siteFavicon?.[0];

  let config = await SiteConfig.findOne({});
  if (!config) config = new SiteConfig();

  // Set site title
  config.siteTitle = siteTitle;

  // Helper to delete a file from disk
  const deleteFile = (filePath) => {
    if (!filePath) return;
    const fullPath = path.join(__dirname, '..', 'public', filePath);
    fs.unlink(fullPath, (err) => {
      if (err) console.warn(`File delete failed: ${fullPath}`, err.message);
    });
  };

  // Delete existing logo if requested
  if (removeSiteLogo === 'true' && config.siteLogo) {
    deleteFile(config.siteLogo);
    config.siteLogo = undefined;
  }

  // Delete existing favicon if requested
  if (removeSiteFavicon === 'true' && config.siteFavicon) {
    deleteFile(config.siteFavicon);
    config.siteFavicon = undefined;
  }

  // Save new logo if uploaded
  if (siteLogoFile) {
    const logoPath = `/uploads/${siteLogoFile.filename}`;
    config.siteLogo = logoPath;
  }

  // Save new favicon if uploaded
  if (siteFaviconFile) {
    const faviconPath = `/uploads/${siteFaviconFile.filename}`;
    config.siteFavicon = faviconPath;
  }

  await config.save();
  res.json({ status: 'success', message: 'Site config saved', config });
};


exports.getApiConfig = async (req, res) => {
  const config = await ApiConfig.findOne({}).lean();
  res.json({ apiConfig: config || {} });
};

exports.saveApiConfig = async (req, res) => {
  try {
    let { apiSecretKey, siteId } = req.body;

    // Ensure siteId is always an array
    if (!siteId) {
      siteId = [];
    } else if (!Array.isArray(siteId)) {
      siteId = [siteId];
    }

    // Retrieve or create new config
    let config = await ApiConfig.findOne({});
    if (!config) config = new ApiConfig();

    config.apiSecretKey = apiSecretKey;
    config.siteId = siteId;  // Expecting array for siteId field

    await config.save();

    res.json({ status: 'success', message: 'API config saved', config });
  } catch (error) {
    console.error('Error saving API config:', error);
    res.status(500).json({ status: 'error', message: 'Failed to save API config' });
  }
};