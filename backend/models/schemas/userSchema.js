const mongoose = require('mongoose');
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

module.exports = userSchema;
