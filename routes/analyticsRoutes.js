const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.post('/', analyticsController.createAnalytics);
router.get('/', analyticsController.getAllAnalytics);
router.get('/summary/views-by-country', analyticsController.getViewsByCountry);
router.put('/:id', analyticsController.updateAnalytics);
router.delete('/:id', analyticsController.deleteAnalytics);

module.exports = router;
