const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const createToken = (_id) => {
    // CREATES TOKEN USING ID AND SECRET
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'}); 
}

const userSignup = async (req, res) => {
    const {name, email, password} = req.body;
    console.log(email, password)

    try {
        const user = await User.signup(name, email, password);
        const token = createToken(user._id);
        res.status(200).json({ email, token });
    } catch (error) {
        res.status(401).json({ error: error.message});
    }
}

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({ email, token });
    } catch (error) {
        res.status(401).json({ error: error.message})
    }
}

// Get current user details
const getUser = async (req, res) => {
    const user_id = req.user._id;

    try {
        const user = await User.findById(user_id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

// Update user name
const updateName = async (req, res) => {
    const user_id = req.user._id;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            user_id, 
            { name },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

// Update user email
const updateEmail = async (req, res) => {
    const user_id = req.user._id;
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find user
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Check if email already exists
        const emailExists = await User.findOne({ email, _id: { $ne: user_id } });
        if (emailExists) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Update email
        user.email = email;
        await user.save();

        // Return updated user
        const updatedUser = await User.findById(user_id).select('-password');
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

// Update user password
const updatePassword = async (req, res) => {
    const user_id = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
    }

    try {
        // Find user
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Incorrect current password' });
        }

        // Validate new password
        if (!newPassword.length >= 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hash;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    userSignup, 
    userLogin,
    getUser,
    updateName,
    updateEmail,
    updatePassword
}