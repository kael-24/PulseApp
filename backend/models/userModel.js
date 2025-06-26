const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    }, 
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

/**
 * User signup method
 * Creates a new user with validation
 */
userSchema.statics.signup = async function(name, email, password) {
    // VALIDATES EMPTY FIELDS
    if (!name || !email || !password) {
        throw Error('All fields are required');
    }

    // VALIDATES EMAIL
    if (!validator.isEmail(email)){
        throw Error('Invalid email format');
    }

    // VALIDATES PASSWORD
    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 0,
        minUppercase: 0,
    })){
        throw Error('Password must be at least 8 characters and include at least one number');
    }

    // VALIDATES EXISTING EMAIL
    const exists = await this.findOne({ email });
    if (exists) {
        throw Error('Email is already in use');
    }

    // PASSWORD HASHING
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // DATABASE DOCUMENT CREATION
    const user = this.create({name, email, password: hash});

    return user;
}

/**
 * User login method
 * Validates credentials and returns user
 */
userSchema.statics.login = async function(email, password) {
    // VALIDATE EMPTY FIELDS
    if (!email || !password) {
        throw Error('Email and password are required');
    }

    // VERIFY EXISTING USER
    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Incorrect email or password');
    }

    // VERIFY PASSWORD
    const match = await bcrypt.compare(password, user.password);
    if (!match){
        throw Error('Incorrect email or password');
    }

    return user;
}

/**
 * User edit method
 * Updates user information with validation
 */
userSchema.statics.userEdit = async function(email, name, currentPassword, newPassword) {
    // Find the user
    const user = await this.findOne({ email });
    
    if (!user) {
        throw Error('User not found');
    }

    const updateFields = {};
    
    // Handle name update
    if (name !== undefined) {
        updateFields.name = name;
    }
    
    // Handle password update
    if (newPassword) {
        // Need current password to change password
        if (!currentPassword) {
            throw Error('Current password is required to change password');
        }
        
        // Verify current password
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            throw Error('Invalid current password');
        }
        
        // Validate new password strength
        if (!validator.isStrongPassword(newPassword, {
            minLength: 8,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 0,
            minUppercase: 0,
        })){
            throw Error('New password must be at least 8 characters and include at least one number');
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);
        updateFields.password = hash;
    }

    // Ensure there's something to update
    if (Object.keys(updateFields).length === 0) {
        throw Error('No changes to update');
    }

    // Update the user
    const updatedUser = await this.findByIdAndUpdate(
        user._id, 
        updateFields, 
        { new: true }
    );
    
    return updatedUser;
}

/**
 * User delete method
 * Permanently removes a user account
 */
userSchema.statics.deleteUser = async function(email, password) {
    // Find the user
    const user = await this.findOne({ email });

    if(!user) {
        throw Error("User not found");
    }

    if (!password) {
        throw Error("Password is required to delete account");
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    
    if(!match) {
        throw Error("Invalid password");
    }

    // Delete the user
    await user.deleteOne();
    return user;
}

module.exports = mongoose.model('User', userSchema);