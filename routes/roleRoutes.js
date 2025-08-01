const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

router.get('/:id', roleController.getRoleById);
router.get('/', roleController.getAllRoles);
router.post('/', roleController.createRole);
router.put('/:id/permissions', roleController.updatePermissions);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

module.exports = router;
