const Deepwork = require('../models/deepworkModel');
const {nameValidator} = require('./inputValidator');

/**
 * GET ALL DEEPWORKS (STUDY SESSIONS)
 */
const getDeepworks = async (req, res) => {
    const userId = req.user._id;
    
    try {
        const deepworks = await Deepwork.getDeepworksModel(userId);
        res.status(200).json({ deepworks })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

/**
 * CREATE A DEEPWORK (STUDY SESSION)
 */
const createDeepwork = async (req, res) => {
    let { deepworkName, deepwork } =  req.body;

    try {
        if (typeof deepworkName !== 'string' || !deepworkName.trim()) {
            deepworkName = 'Untitled';
        }

        if (!Array.isArray(deepwork) || deepwork.length === 0) {
            throw Error('Cannot save an empty deepwork session')
        }

        const userId = req.user._id;
        const newDeepwork = await Deepwork.createDeepworkModel(userId, deepworkName, deepwork);

        res.status(200).json({ newDeepwork })
    } catch ( err ) {
        res.status(400).json({ error: err.message })
    }
}

/**
 * DELETE A DEEPWORK (STUDY SESSION)
 */
const deleteDeepwork = async (req, res) => {
    const objectId = req.params.id;
    const userId = req.user._id;

    try {
        const deletedDeepwork = await Deepwork.deleteDeepworkModel(userId, objectId);
        res.status(200).json({ deletedDeepwork });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

/**
 * UPDATE DEEPWORK (ONLY UPDATES THE STUDY SESSION NAME)
 */
const updateDeepwork = async (req, res) => {
    const objectId  = req.params.id;
    const userId = req.user._id;
    let { newDeepworkName } = req.body;

    try {
        nameValidator({ name: newDeepworkName, isRequired: true })

        const updatedDeepwork = await Deepwork.updateDeepworkModel(userId, objectId, newDeepworkName);
        res.status(200).json(updatedDeepwork);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {  getDeepworks, 
                    createDeepwork, 
                    deleteDeepwork, 
                    updateDeepwork, 
                }