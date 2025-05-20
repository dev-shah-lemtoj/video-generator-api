const { SiteConfig, ApiConfig } = require('../models/configModels');
const path = require('path');

exports.getSiteConfig = async (req, res) => {
  const config = await SiteConfig.findOne({}).lean();
  res.json({ siteConfig: config || {} });
};

exports.saveSiteConfig = async (req, res) => {
  const { siteTitle } = req.body;
  const files = req.files || {};

  const siteLogoFile = files.siteLogo?.[0];
  const siteFaviconFile = files.siteFavicon?.[0];

  let config = await SiteConfig.findOne({});
  if (!config) config = new SiteConfig();

  config.siteTitle = siteTitle;

  if (siteLogoFile) {
    const logoPath = `/uploads/${siteLogoFile.filename}`;
    config.siteLogo = logoPath;
  }

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
  const { apiSecretKey, siteId, mediaId } = req.body;

  let config = await ApiConfig.findOne({});
  if (!config) config = new ApiConfig();

  config.apiSecretKey = apiSecretKey;
  config.siteId = siteId;
  config.mediaId = mediaId;

  await config.save();
  res.json({ status: 'success', message: 'API config saved', config });
};
