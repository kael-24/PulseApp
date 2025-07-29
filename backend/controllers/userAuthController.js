const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const {nameValidator, emailValidator, passwordValidator} = require('./inputValidator');

/**
 * Creates a JWT token for user authentication
 * @param {string} _id - User ID to encode in the token
 * @returns {string} - JWT token
 */
const createToken = (_id) => {
    // CREATES TOKEN USING ID AND SECRET
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'}); 
}

/**
 * User signup controllera
 * Creates a new user account
 */
const userSignup = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        nameValidator({ name, isRequired: true, checkIfEnough: true });
        emailValidator({ email, isRequired: true });
        passwordValidator({ password, isRequired: true, checkIfEnough: true, checkIfStrong:true });

        const normalizedEmail = email.toLowerCase();

        // CREATE NEW USER TO THE USER COLLECTION
        const user = await User.signupModel(name, normalizedEmail, password);

        const token = createToken(user._id);
        res.status(200).json({ name, email: normalizedEmail, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * User login controller
 * Authenticates user credentials
 */
const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        emailValidator({ email, isRequired: true });
        passwordValidator({ password, isRequired: true });

        const normalizedEmail = email.toLowerCase();

        const user = await User.loginModel(normalizedEmail, password);
        const token = createToken(user._id);
        res.status(200).json({ name: user.name, email: normalizedEmail, token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

module.exports = {userSignup, userLogin};