const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

const { userSignup, userLogin} = require('../controllers/userAuthController');
const { userEdit, userDelete } = require('../controllers/userEditController')


// SPECIFIC ROUTE FOR LOGIN
router.post('/login', userLogin);

// SPECIFIC ROUTE FOR SIGNUP
router.post('/signup', userSignup);

// SPECIFIC ROUTE FOR USER EDIT
router.patch('/userEdit', requireAuth, userEdit)

// SPECIFIC ROUTE FOR USER DELETE
router.delete('/userDelete', requireAuth, userDelete)

module.exports = router;