const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
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

const stopwatchSchema = new Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sessionName: {
        type: String,
        require: true
    },
    session: [sessionSchema]
}, { timestamps: true });






// GET ALL USER SESSIONS
stopwatchSchema.statics.getSessionsModel = async function(userId) { 
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw Error('Object not a valid ID');
    }

    const sessions = await this.find({ userId }).sort({ createdAt: -1 });
    if (sessions.length === 0) {
        throw Error('Session does not exists');
    }

    return sessions;
}

// GET A SINGLE SESSION
stopwatchSchema.statics.getSingleSessionModel = async function(objectId) {
    if (!mongoose.Types.ObjectId.isValid(objectId)){
        throw Error('Object ID is not valid');
    }

    const session = await this.findById(objectId);

    if (!session) {
        throw Error('Cant find the session');
    }

    return session;
}

// CREATE A NEW SESSION
stopwatchSchema.statics.createSessionModel = async function(userId, givenName, session) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw Error('Invalid User ID');
    }

    const name = givenName || "Untitled";

    try {
        return await this.create({userId, sessionName: name, session});
    } catch (err) {
        throw new Error("Error saving session" + err.message);
    }
}

// DELETE A SESSION
stopwatchSchema.statics.deleteSessionModel = async function(objectId) {
    if (!mongoose.Types.ObjectId.isValid(objectId)){
        throw Error('Invalid User ID');
    }

    const deletedSession = await this.findOneAndDelete({ _id: objectId });
    
    if (!deletedSession) {
        throw Error('Cant find session!');
    }

    return deletedSession;
}


/**
 * UPDATES SESSION NAME // TODO **UNFINISHED
 * @param {*} objectId 
 * @param {*} newName 
 * @returns updated single session
 */
stopwatchSchema.statics.updateSessionModel = async function(objectId, newName) {
    if(!mongoose.Types.ObjectId.isValid(objectId)) {
        throw Error("Object ID is invalid");
    }

    if (typeof newName !== 'string' || !newName.trim()) {
        throw Error("Error setting the session name");
    }

    const cleanName = newName.trim()
    
    const updatedSession = await this.findByIdAndUpdate(objectId, { sessionName: cleanName}, { new: true });

    if (!updatedSession) {
        throw Error("Cant find the session");
    }

    return updatedSession;
}


module.exports = mongoose.model("Stopwatch", stopwatchSchema);