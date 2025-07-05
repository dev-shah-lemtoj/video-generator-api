const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');

router.get('/', siteController.getAllSites);
router.post('/', siteController.createSite);
router.put('/:id', siteController.updateSite);  // <--- UPDATE added
router.delete('/:id', siteController.deleteSite);

module.exports = router;
