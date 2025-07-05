const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

const { getDeepworks, createDeepwork, deleteDeepwork, updateDeepwork } = require('../controllers/deepworkController');

// AUTH MIDDLEWARE - CANT ACCESS FOLLOWING ROUTES WITHOUT AUTHENTICATION
router.use(requireAuth);

// GETTING ALL DEEPWORK SESSIONS
router.get('/', getDeepworks);

// CREATING NEW DEEPWORK SESSION
router.post('/', createDeepwork);

// DELETE DEEPWORK SESSION
router.delete('/:id', deleteDeepwork);

// UPDATING EXISTING DEEPWORK SESSION
router.patch('/:id', updateDeepwork);

module.exports = router;