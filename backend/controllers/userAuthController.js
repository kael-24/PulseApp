const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

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
 * User signup controller
 * Creates a new user account
 */
const userSignup = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const user = await User.signup(name, email, password);
        const token = createToken(user._id);
        res.status(200).json({ name, email, token });
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
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({ name: user.name, email, token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

module.exports = {userSignup, userLogin};