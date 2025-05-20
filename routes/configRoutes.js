const express = require('express');
const router = express.Router();
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); // adjust storage as needed
const upload = require('../middleware/upload');
const configController = require('../controllers/configController');

// Get combined site + api config
router.get('/site-config', configController.getSiteConfig);

// Save site config with optional file uploads (siteLogo, siteFavicon)
router.post(
  '/site-config',
  upload.fields([{ name: 'siteLogo' }, { name: 'siteFavicon' }]),
  configController.saveSiteConfig
);

// Get only api config
router.get('/api-config', configController.getApiConfig);

// Save api config (no files)
router.post('/api-config', configController.saveApiConfig);

module.exports = router;
