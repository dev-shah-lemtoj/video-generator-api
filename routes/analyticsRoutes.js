const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.post('/', analyticsController.createAnalytics);
router.get('/', analyticsController.getAllAnalytics);
router.get('/summary/views-by-country', analyticsController.getViewsByCountry);
router.get('/summary/count-by-embedId', analyticsController.getCountByEmbedId);
router.get('/summary/count-by-videoId', analyticsController.getCountByVideoId);
router.put('/:id', analyticsController.updateAnalytics);
router.delete('/:id', analyticsController.deleteAnalytics);

module.exports = router;

// GET /analytics/summary/count-by-embedId
// GET /analytics/summary/count-by-embedId?search=music
// GET /analytics/summary/count-by-embedId?startDate=2025-01-01&endDate=2025-02-01
