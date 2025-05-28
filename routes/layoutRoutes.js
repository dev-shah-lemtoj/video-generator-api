const express = require('express');
const router = express.Router();
const layoutController = require('../controllers/layoutController');

// Define the route for saving layout
router.post('/save-layout', layoutController.saveLayout);

// Define the route for getting layouts
router.get('/layouts', layoutController.getLayouts); // New route to get layouts

router.get('/layouts/:id', layoutController.getLayoutById);
router.put('/layouts/:id', layoutController.updateLayoutById);
router.delete('/layouts/:id', layoutController.deleteLayoutById);
module.exports = router;
