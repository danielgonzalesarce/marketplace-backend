const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate, authorizeRoles } = require('../middleware/auth.middleware');

router.get('/', categoryController.getAllCategories);
router.post('/', authenticate, authorizeRoles('ADMIN'), categoryController.createCategory);

module.exports = router;
