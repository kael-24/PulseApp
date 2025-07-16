const User = require('../models/userModel');
const Deepwork = require('../models/deepworkModel.js');
const Alarm = require('../models/schemas/alarmSchema');

const ExcelJS = require('exceljs');

const downloadData = async (req, res) => {
    try {
        const userId = req.user._id;

        const userData = await User.downloadUserModel(userId);
        const deepworksData = await Deepwork.downloadDeepworksModel(userId);
        const alarmData = await Alarm.downloadAlarmModel(userId);

        // create workbok
        const workbook = new ExcelJS.Workbook();

        // create usersheet
        const userSheet = workbook.addWorksheet('User Data');
        userSheet.columns = Object.keys(userData).map(key => ({ header: key, key }));
        userSheet.addRow(userData);

        if (deepworksData.length > 0) {
            const deepworksSheet = workbook.addWorksheet('Deepworks Data');
            deepworksSheet.columns = Object.keys(deepworksData[0] || { Empty: '' }).map(key => ({ header: key, key }));
            deepworksSheet.addRows(deepworksData);
        }

        const alarmSheet = workbook.addWorksheet('Alarm Data');
        alarmSheet.columns = Object.keys(alarmData).map(key => ({ header: key, key }));
        alarmSheet.addRow(alarmData);

        const buffer = await workbook.xlsx.writeBuffer();

        res.status(200)
            .set({
                'Content-Disposition': 'attachment; filename="user_data.xlsx"',
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })
            .send(buffer);
    } catch (err) {
        console.error('Excel Export Error:', err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = { downloadData }