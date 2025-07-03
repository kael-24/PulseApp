const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

const { createSession, getSessions, updateSession, deleteSession } = require('../controllers/stopwatchController');

// AUTH MIDDLEWARE - CANT ACCESS FOLLOWING ROUTES WITHOUT AUTHENTICATION
router.use(requireAuth);

// GETTING ALL SESSIONS
router.get('/', getSessions);

// CREATING NEW SESSION
router.post('/', createSession);

// DELETE SESSION
router.delete('/:id', deleteSession);

// UPDATING EXISTING SESSION
router.patch('/:id', updateSession);

module.exports = router;