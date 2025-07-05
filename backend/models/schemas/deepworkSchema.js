const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deepworkLogSchema = new Schema({
    mode: {
        type: String,
        required: true
    },
    timeMS: {
        type: Number,
        required: true
    },
    formattedTime: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true                  
    }
}, { _id: false })

const deepworkSchema = new Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deepworkName: {
        type: String,
        required: true
    },
    deepwork: [deepworkLogSchema]
}, { timestamps: true });

module.exports = deepworkSchema;