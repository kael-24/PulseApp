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
 * User edit controller
 * Updates user profile information
 */
const userEdit = async (req, res) => {
    const { email, name, currentPassword, newPassword } = req.body;

    try {
        // Perform update via model
        const user = await User.userEdit(email, name, currentPassword, newPassword);
        
        // Create new token
        const token = createToken(user._id);

        // Return updated user data
        res.status(200).json({ 
            name: user.name, 
            email: email,
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
    const {email, password} = req.body;

    try {
        await User.deleteUser(email, password);
        res.status(200).json({ message: "Account successfully deleted" });
    } catch (error) {  
        res.status(400).json({ error: error.message })
    }
}

module.exports = {userEdit, userDelete};