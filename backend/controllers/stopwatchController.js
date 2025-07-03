const Stopwatch = require('../models/stopwatchModel')

const getSessions = async (req, res) => {
    const userId = req.user._id; 
    
    try {
        const sessions = await Stopwatch.getSessionsModel(userId);
        res.status(200).json({ sessions })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const updateSession = async (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;

    try {
        const session = await Stopwatch.updateSessionModel(id, newName);
        res.status(200).json(session);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const createSession = async (req, res) => {
    const { sessionName, session } =  req.body;

    try {
        const userId = req.user._id;
        const newSession = await Stopwatch.createSessionModel(userId, sessionName, session);

        res.status(200).json({ newSession })
    } catch ( err ) {
        res.status(400).json({ error: err.message })
    }
}

const deleteSession = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSession = await Stopwatch.deleteSessionModel(id);
        res.status(200).json({ deletedSession });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
    
}

module.exports = { getSessions, updateSession, createSession, deleteSession }