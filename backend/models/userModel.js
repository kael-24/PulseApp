const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        require: true
    }
})

userSchema.statics.signup = async function(name, email, password) {
    console.log(email, password);
    // VALIDATES EMPTY FIELDS
    if (!email || !password) {
        throw Error('All fields must be filled!');
    }

    // VALIDATES EMAIL
    if (!validator.isEmail(email)){
        throw Error('Invalid email');
    }

    // VALIDATES PASSWORD
    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 0,
        minUppercase: 0,
    })){
        throw Error('Password is weak!');
    }

    // VALIDATES EXISTING EMAIL
    const exists = await this.findOne({ email });
    if (exists) {
        throw Error('Email is already taken!');
    }

    // PASSWORD HASHING
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // DATABASE DOCUMENT CREATION
    const user = this.create({name, email, password: hash});

    return user;
}

userSchema.statics.login = async function(email, password) {
    // VALIDATE EMPTY FIELDS
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    // VERIFY EXISTING USER
    const user = await this.findOne({ email });
    if (!user) {
        throw Error('User does not exists')
    }

    // VERIFY PASSWORD
    match = await bcrypt.compare(password, user.password)
    if (!match){
        throw Error('Wrong Credentials');
    }

    return user;
}

module.exports = mongoose.model('User', userSchema);