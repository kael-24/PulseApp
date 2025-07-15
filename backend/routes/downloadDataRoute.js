const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

const { downloadData } = require('../controllers/downloadDataController.js');

// AUTH MIDDLEWARE - CANT ACCESS FOLLOWING ROUTES WITHOUT AUTHENTICATION
router.use(requireAuth);

router.get('/', downloadData);

module.exports = router;