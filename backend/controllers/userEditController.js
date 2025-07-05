const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const {nameValidator, passwordValidator} = require('./inputValidator');

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
 * EDIT USER PROFILE (NAME, PASSWORD)
 */
const userEdit = async (req, res) => {
    const userId = req.user._id
    const {name, currentPassword, newPassword } = req.body;

    try {

        // VALIDATE INPUTS
        if (name) {
            nameValidator({ name, checkIfEnough: true});
        } 
        
        if(!currentPassword && newPassword) {
            throw Error('Current password is required');
        } else if (currentPassword && !newPassword) {
            throw Error('New password is required');
        } else if (currentPassword && newPassword) {
            passwordValidator({ password: currentPassword, checkIfEnough: true, checkIfStrong: true });
            passwordValidator({ password: newPassword, checkIfEnough: true, checkIfStrong: true });
        }

        // PERFORM UPDATE VIA MODEL
        const user = await User.userEdit(userId, name, currentPassword, newPassword);
        
        // CREATE NEW TOKEN
        const token = createToken(user._id);

        // RETURN UPDATED USER DATA
        res.status(200).json({ 
            name: user.name, 
            email: user.email,
            token 
        });
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}

/**
 * User deletion controller
 * Permanently removes a user account
 */
const userDelete = async (req, res) => {
    const userId = req.user._id;
    const {password} = req.body;

    try {
        passwordValidator({ password, isRequired: true });

        await User.deleteUser(userId, password);
        res.status(200).json({ message: "Account successfully deleted" });
    } catch (error) {  
        res.status(400).json({ error: error.message });
    }
}

module.exports = {userEdit, userDelete};