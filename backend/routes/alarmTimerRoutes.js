const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

const { getAlarmTimerController, 
        createAlarmTimerController, 
        updateAlarmTimerController } = require('../controllers/alarmTimerController');

router.use(requireAuth);

// GET SINGLE ALARM TIMER
router.get('/', getAlarmTimerController);

// UPDATE ALARM TIMER
router.patch('/:id', updateAlarmTimerController);

module.exports = router;
