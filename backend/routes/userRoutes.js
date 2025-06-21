const express = require('express');
const router = express.Router();

const { userSignup, userLogin, userEdit } = require('../controllers/userController');


// SPECIFIC ROUTE FOR LOGIN
router.post('/login', userLogin);

// SPECIFIC ROUTE FOR SIGNUP
router.post('/signup', userSignup);

// SPECIFIC ROUTE FOR USEREDIT
router.patch('/userEdit', userEdit)

module.exports = router;