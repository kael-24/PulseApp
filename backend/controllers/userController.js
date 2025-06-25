const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

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
        res.status(200).json({ name, email, token });
    } catch (error) {
        res.status(401).json({ error: error.message});
    }
}

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({ name: user.name, email, token });
    } catch (error) {
        res.status(401).json({ error: error.message})
    }
}

const userEdit = async (req, res) => {
    const { email, name, currentPassword, newPassword } = req.body;

    try {
        const user = await User.userEdit(email, name, currentPassword, newPassword);
        const token = createToken(user._id);

        const response = {
            name,
            email,
            token,
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}

const userDelete = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.deleteUser(email, password);
        res.status(200).json(user);
    } catch (error) {  
        res.status(400).json({ error: error.message })
    }
}

module.exports = {userSignup, userLogin, userEdit, userDelete}