const mongoose = require('mongoose');

module.exports = function deepworkStatics (schema) {
    /**
     * GET ALL DEEPWORK SESSIONS
     * @param {mongooseID} userId 
     * @returns DEEPWORK SESSIONS ARRAY or EMPTY ARRAY
     */
    schema.statics.getDeepworksModel = async function(userId) { 
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw Error('userId is not valid');
        }

        const deepworks = await this.find({ userId }).sort({ createdAt: -1 });

        if (deepworks.length === 0) {
            return [];
        }

        return deepworks;
    }

    /**
     * GET SINGLE SPECIFIC DEEPWORK SESSION (UNUSED)
     * @param {mongooseID} objectId 
     * @returns SPECIFIC DEEPWORK SESSION
     */
    schema.statics.getDeepworkModel = async function(objectId) {
        if (!mongoose.Types.ObjectId.isValid(objectId)){
            throw Error('Object ID is not valid');
        }

        const deepwork = await this.findById(objectId);

        if (!deepwork) {
            throw Error('Cannot find the session');
        }

        return deepwork;
    }

    /**
     * CREATES NEW DEEPWORK SESSION
     * @param {mongooseID} userId 
     * @param {String} deepworkName 
     * @param {Array} deepwork 
     * @returns NEWLY CREATED DEEPWORK SESSION
     */
    schema.statics.createDeepworkModel = async function(userId, deepworkName, deepwork) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw Error('Invalid User ID');
        }

        try {
            return await this.create({userId, deepworkName, deepwork});
        } catch (err) {
            throw new Error("Error saving deepwork" + err.message);
        }
    }

    /**
     * DELETE A DEEPWORK SESSION
     * @param {mongooseID} objectId 
     * @returns DELETED DEEPWORK SESSION
     */
    schema.statics.deleteDeepworkModel = async function(userId, objectId) {
        if (!mongoose.Types.ObjectId.isValid(userId)){
            throw Error('User ID is invalid')
        }

        if (!mongoose.Types.ObjectId.isValid(objectId)){
            throw Error('Invalid Object ID');
        }

        const deletedDeepwork = await this.findOneAndDelete({ 
            _id: objectId,
            userId: userId 
        });
        
        if (!deletedDeepwork) {
            throw Error('Cant find deepwork session!');
        }

        return deletedDeepwork;
    }

    /**
     * 
     * @param {mongoose._id} userId 
     */
    schema.statics.deleteAllDeepworksModel = async function(userId) {
        if(!mongoose.Types.ObjectId.isValid(userId)){
            throw Error('Invalid User ID');
        }

        await this.deleteMany({ userId });
    }


    /**
     * UPDATES SESSION NAME 
     * @param {mongooseID} objectId 
     * @param {String} newName 
     * @returns UPDATED DEEPWORK SESSION
     */
    schema.statics.updateDeepworkModel = async function(userId, objectId, newDeepworkName) {
        if (!mongoose.Types.ObjectId.isValid(userId)){
            throw Error('User ID is invalid')
        }

        if(!mongoose.Types.ObjectId.isValid(objectId)) {
            throw Error("Object ID is invalid");
        }
        
        const updatedDeepwork = await this.findOneAndUpdate(
            { _id: objectId, userId: userId },
            { deepworkName: newDeepworkName},
            { new: true }
        );

        if (!updatedDeepwork) {
            throw Error("Cant find the deepwork");
        }

        return updatedDeepwork;
    }

    schema.statics.downloadDeepworksModel = async function(userId) {
        if (!mongoose.Types.ObjectId.isValid(userId))
            throw Error('Invalid User ID');

        const deepwork = await this.findOne({ userId }).lean();
        if (!deepwork)
            throw Error('No existing deepwork');

        const deepworkSession =  deepwork.deepwork.map(log => ({
            "Deepwork Name": deepwork.deepworkName,
            "Creation Date": deepwork.createdAt,
            "Log Mode": log.mode,
            "Log Duration": log.formattedTime,
        }))

        return deepworkSession;
    }

}
