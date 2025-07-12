const Alarm = require('../models/schemas/alarmSchema');

const getAlarmTimerController = async (req, res) => {
    const userId = req.user._id;

    try {
        const alarmTimer = await Alarm.getAlarmTimerModel(userId);
        res.status(200).json(alarmTimer)
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

const updateAlarmTimerController = async (req, res) => {
    const userId = req.user._id;
    const objectId = req.params.id;
    const { isWorkAlarmEnabled, isRestAlarmEnabled, alarmWorkTime, alarmRestTime } = req.body;

    try {
        if (typeof isWorkAlarmEnabled !== 'undefined' && ![true, false].includes(isWorkAlarmEnabled))
            throw Error('Invalid work alarm input');

        if (typeof isRestAlarmEnabled !== 'undefined' && ![true, false].includes(isRestAlarmEnabled))
            throw Error('Invalid rest alarm input');

        if (typeof alarmWorkTime !== 'undefined' && (typeof alarmWorkTime !== 'number' || isNaN(alarmWorkTime) || alarmWorkTime < 0 || alarmWorkTime > 86400)) 
            throw Error('Invalid Number Input');

        if (typeof alarmRestTime !== 'undefined' && (typeof alarmRestTime !== 'number' || isNaN(alarmRestTime) || alarmRestTime < 0 || alarmRestTime > 86400)) 
            throw Error('Invalid Number Input');

        if (typeof isWorkAlarmEnabled === 'undefined' && typeof isRestAlarmEnabled === 'undefined' && typeof alarmWorkTime === 'undefined' && typeof alarmRestTime === 'undefined')
            throw Error('You are did not updated anything');

        const updatedAlarmTimer = await Alarm.updateAlarmTimerModel(userId, objectId, isWorkAlarmEnabled, isRestAlarmEnabled, alarmWorkTime, alarmRestTime);
        res.status(200).json(updatedAlarmTimer);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}


module.exports = {  getAlarmTimerController, 
                    updateAlarmTimerController }