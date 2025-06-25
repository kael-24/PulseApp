const express = require('express');
const router = express.Router();

const { userSignup, userLogin, userEdit, userDelete } = require('../controllers/userController');


// SPECIFIC ROUTE FOR LOGIN
router.post('/login', userLogin);

// SPECIFIC ROUTE FOR SIGNUP
router.post('/signup', userSignup);

// SPECIFIC ROUTE FOR USER EDIT
router.patch('/userEdit', userEdit)

// SPECIFIC ROUTE FOR USER DELETE
router.delete('/userDelete', userDelete)

module.exports = router;