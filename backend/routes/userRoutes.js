const express = require('express');
const router = express.Router();

const { 
    userSignup, 
    userLogin,
    getUser,
    updateName,
    updateEmail,
    updatePassword
} = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');

// Public routes
router.post('/login', userLogin);
router.post('/signup', userSignup);

// Protected routes - require authentication
router.use(requireAuth);
router.get('/me', getUser);
router.patch('/update-name', updateName);
router.patch('/update-email', updateEmail);
router.patch('/update-password', updatePassword);

module.exports = router;