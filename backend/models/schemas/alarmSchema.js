const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const alarmSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isWorkAlarmEnabled: {
        type: Boolean,
        required: true
    },
    isRestAlarmEnabled: {
        type: Boolean,
        required: true
    },
    alarmWorkTime: {
        type: Number,
        required: true,
        min: 0,
        max: 86400
    },
    alarmRestTime: {
        type: Number,
        required: true,
        min: 0,
        max: 86400
    }
})

alarmSchema.statics.getAlarmTimerModel = async function (userId) {
    if (!mongoose.Types.ObjectId.isValid(userId))
        throw Error('Invalid User ID');

    const alarm = await this.findOne({ userId });
    if (!alarm) 
        throw Error('Cant find the alarm timer');

    return {objectId: alarm._id, 
            isWorkAlarmEnabled: alarm.isWorkAlarmEnabled, 
            isRestAlarmEnabled: alarm.isRestAlarmEnabled,
            alarmWorkTime: alarm.alarmWorkTime,
            alarmRestTime: alarm.alarmRestTime
            }
}

alarmSchema.statics.createAlarmTimerModel = async function (userId) {
    if (!mongoose.Types.ObjectId.isValid(userId))
        throw Error('Invalid User ID');

    const user = await this.findOne({ userId });
    if (user) 
        throw Error('Alarm already existing for this user');

    const newAlarmTimer = await this.create({
                                            userId, 
                                            isWorkAlarmEnabled: false, 
                                            isRestAlarmEnabled: false, 
                                            alarmWorkTime: 0,
                                            alarmRestTime: 0
                                            });

    if (!newAlarmTimer) 
        throw Error('Error creating alarm timer');

    return newAlarmTimer
}

alarmSchema.statics.updateAlarmTimerModel = async function (userId, 
                                                            objectId,  
                                                            isWorkAlarmEnabled, 
                                                            isRestAlarmEnabled, 
                                                            alarmWorkTime, 
                                                            alarmRestTime) {
    if (!mongoose.Types.ObjectId.isValid(userId))
        throw Error('Invalid User ID');

    if (!mongoose.Types.ObjectId.isValid(objectId))
        throw Error('Invalid Object ID');

    const updateFields = {}
    if (typeof isWorkAlarmEnabled === 'boolean')
        updateFields.isWorkAlarmEnabled = isWorkAlarmEnabled;
    if (typeof isRestAlarmEnabled === 'boolean')
        updateFields.isRestAlarmEnabled = isRestAlarmEnabled;
    if (typeof alarmWorkTime === 'number') 
        updateFields.alarmWorkTime = alarmWorkTime;
    if (typeof alarmRestTime === 'number')
        updateFields.alarmRestTime = alarmRestTime;

    const updatedAlarmModel = await this.findOneAndUpdate({_id: objectId, userId}, { $set: updateFields }, { new: true});

    if (!updatedAlarmModel)
        throw Error('Error updating alarm timer');

    return {
            objectId: updatedAlarmModel._id, 
            isWorkAlarmEnabled: updatedAlarmModel.isWorkAlarmEnabled, 
            isRestAlarmEnabled: updatedAlarmModel.isRestAlarmEnabled,
            alarmWorkTime: updatedAlarmModel.alarmWorkTime,
            alarmRestTime: updatedAlarmModel.alarmRestTime
    };
}

alarmSchema.statics.deleteAlarmModel = async function (userId) {
    if (!mongoose.Types.ObjectId.isValid(userId))
        throw Error('User ID is not valid');

    const deletedAlarm = await this.deleteOne({userId});

    if (!deletedAlarm.deletedCount === 0)
        throw Error('Error deleting alarm');

    return deletedAlarm
}

module.exports = mongoose.model('Alarm', alarmSchema)