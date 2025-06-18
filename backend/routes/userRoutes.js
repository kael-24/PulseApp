const express = require('express');
const router = express.Router();

const { userSignup, userLogin } = require('../controllers/userController');


// SPECIFIC ROUTE FOR LOGIN
router.post('/login', userLogin);

// SPECIFIC ROUTE FOR SIGNUP
router.post('/signup', userSignup);

module.exports = router;