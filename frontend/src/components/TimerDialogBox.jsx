import { useState, useEffect } from "react"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TimerIcon from '@mui/icons-material/Timer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Switch from '@mui/material/Switch';

import useAlarmTimer from "../hooks/useAlarmTimer";
import { useAlarmContext } from "../hooks/contextHook/useAlarmContext";

const TimerDialogBox = ({ onClose }) => {
    const { updateAlarmTimer, success } = useAlarmTimer();
    const { isWorkAlarmEnabled, isRestAlarmEnabled, alarmWorkTime, alarmRestTime}  = useAlarmContext();

    /* removed unused refs and timers */

    const [workHours, setWorkHours] = useState('0');
    const [workMinutes, setWorkMinutes] = useState('0');
    const [workSeconds, setWorkSeconds] = useState('0');
    const [restHours, setRestHours] = useState('0') ;
    const [restMinutes, setRestMinutes] = useState('0');
    const [restSeconds, setRestSeconds] = useState('0');
    
    const [alarmMode, setAlarmMode] = useState('work');
    const [isWorkAlarmOn, setIsWorkAlarmOn] = useState(false);
    const [isRestAlarmOn, setIsRestAlarmOn] = useState(false);


    useEffect(() => {
        setIsWorkAlarmOn(isWorkAlarmEnabled);
        setIsRestAlarmOn(isRestAlarmEnabled);

        setWorkHours(Math.floor(alarmWorkTime / 3600));
        setWorkMinutes(Math.floor((alarmWorkTime % 3600) / 60));
        setWorkSeconds(((alarmWorkTime % 3600) % 60));
        setRestHours(Math.floor(alarmRestTime / 3600));
        setRestMinutes(Math.floor((alarmRestTime % 3600) / 60));
        setRestSeconds(((alarmRestTime % 3600) % 60));
    }, [isWorkAlarmEnabled, isRestAlarmEnabled, alarmWorkTime, alarmRestTime])

    const handleSaveTimer = () => {
        const totalWorkTime = (parseInt(workHours || 0) * 3600) + (parseInt(workMinutes || 0) * 60) + parseInt(workSeconds || 0);
        const totalRestTime = (parseInt(restHours || 0) * 3600) + (parseInt(restMinutes || 0) * 60) + parseInt(restSeconds || 0);
        const updateFields = {}
        if (isWorkAlarmEnabled !== isWorkAlarmOn)
            updateFields.isWorkAlarmEnabled = isWorkAlarmOn;
        if (isRestAlarmEnabled !== isRestAlarmOn)
            updateFields.isRestAlarmEnabled = isRestAlarmOn;
        if (totalWorkTime !== alarmWorkTime)
            updateFields.alarmWorkTime = totalWorkTime;
        if (totalRestTime !== alarmRestTime)
            updateFields.alarmRestTime = totalRestTime;

        if (Object.keys(updateFields).length > 0){
            updateAlarmTimer(updateFields);
            return
        }
    }

    const handleTimeFormat = (type, value) => {
        if (/[^0-9]/.test(value) && value !== '') return;  
        
        if (value.length > 2) return;

        // Allow empty string for any field
        if (value === '') {
            if (alarmMode === 'work') {
                if (type === 'hours')
                    setWorkHours('')
                else if (type === 'minutes')
                    setWorkMinutes('')
                else if (type === 'seconds')
                    setWorkSeconds('')
            } else {
                if (type === 'hours')
                    setRestHours('')
                else if (type === 'minutes')
                    setRestMinutes('')
                else if (type === 'seconds')
                    setRestSeconds('')
            }
            return
        }

        const num = Number(value);
        const limits = type === 'hours' ? String(Math.min(23, num)) : (Math.min(59, num));

        if (alarmMode === 'work') {
            if (type === 'hours')
                setWorkHours(limits)
            else if (type === 'minutes')
                setWorkMinutes(limits)
            else if (type === 'seconds')
                setWorkSeconds(limits)
        } else {
            if (type === 'hours')
                setRestHours(limits)
            else if (type === 'minutes')
                setRestMinutes(limits)
            else if (type === 'seconds')
                setRestSeconds(limits)
        }
    }

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-800/95 backdrop-blur-sm shadow-2xl rounded-2xl p-6 border border-blue-700/30">
                <div className="flex justify-between items-center mb-6 relative">
                    <h3 className="text-xl font-bold text-blue-300 flex items-center absolute left-1/2 transform -translate-x-1/2">
                        <TimerIcon className="mr-2" />
                        Set Timer
                    </h3>
                    
                    <button 
                        className="text-blue-300 hover:text-teal-300 transition-colors"
                        onClick={onClose}
                    >
                        <ArrowBackIcon />
                    </button>
                </div>

                {/* Mode selector */}
                <div className="bg-slate-800/50 backdrop-blur-sm p-1 rounded-xl flex mb-6 border border-blue-700/20">
                    <button
                        onClick={() => setAlarmMode('work')}
                        disabled={alarmMode === 'work'}
                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                        alarmMode === 'work' 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white cursor-default' 
                            : 'text-blue-300 hover:bg-slate-700/50'
                        }`}
                    >
                        Work
                    </button>
                    <button
                        onClick={() => setAlarmMode('rest')}
                        disabled={alarmMode === 'rest'}
                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                        alarmMode === 'rest' 
                            ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white cursor-default' 
                            : 'text-blue-300 hover:bg-slate-700/50'
                        }`}
                    >
                        Rest
                    </button>
                </div>
                
                <div className="mb-6 flex justify-between items-center p-3 bg-slate-700/30 rounded-xl border border-blue-700/20">
                    <span className="text-blue-300 font-medium">
                        {alarmMode === 'work' ? 'Work Timer Alarm' : 'Rest Timer Alarm'}
                    </span>
                    
                    {alarmMode === 'work' ? (
                        <Switch 
                            checked={isWorkAlarmOn}
                            onChange={() => setIsWorkAlarmOn(!isWorkAlarmOn)}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#3b82f6',
                                    '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.1)' },
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#3b82f6',
                                },
                            }}
                        />
                    ) : (
                        <Switch 
                            checked={isRestAlarmOn}
                            onChange={() => setIsRestAlarmOn(!isRestAlarmOn)}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#14b8a6',
                                    '&:hover': { backgroundColor: 'rgba(20, 184, 166, 0.1)' },
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#14b8a6',
                                },
                            }}
                        />
                    )}
                </div>
                
                <div className="flex justify-center gap-4 mb-6">
                    <div className="flex flex-col items-center">
                        <span className="text-blue-300 text-sm mb-1">Hours</span>
                        <div className="bg-slate-700/50 p-3 rounded-lg border border-blue-700/20 flex flex-col items-center">
                            <button 
                                onClick={() =>  alarmMode === 'work' 
                                                ? setWorkHours(prev => String(Math.min(parseInt(prev) + 1, 23)))
                                                : setRestHours(prev => String(Math.min(parseInt(prev) + 1, 23)))
                                        }
                                className="text-blue-300 hover:text-teal-300 transition-colors"
                            >
                                <AddIcon />
                            </button>
                            
                            <input
                                className="text-white text-center w-12 bg-transparent text-xl py-1"
                                type="text"
                                value={alarmMode === 'work' ? workHours : restHours}
                                onChange={(e) => {handleTimeFormat('hours', e.target.value)}}
                                maxLength={2}
                                placeholder="00"
                            />
                            
                            <button 
                                className="text-blue-300 hover:text-teal-300 transition-colors"
                                onClick={() => alarmMode === 'work' 
                                                ? setWorkHours(prev => String(Math.max(parseInt(prev) - 1, 0)))
                                                : setRestHours(prev => String(Math.max(parseInt(prev) - 1, 0)))
                                        }
                            >
                                <RemoveIcon />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-blue-300 text-sm mb-1">Minutes</span>
                        <div className="bg-slate-700/50 p-3 rounded-lg border border-blue-700/20 flex flex-col items-center">
                            <button 
                                onClick={() =>  alarmMode === 'work' 
                                                ? setWorkMinutes(prev => String(Math.min(parseInt(prev) + 1, 59)))
                                                : setRestMinutes(prev => String(Math.min(parseInt(prev) + 1, 59)))
                                        }
                                className="text-blue-300 hover:text-teal-300 transition-colors"
                            >
                                <AddIcon />
                            </button>
                            
                            <input
                                className="text-white text-center w-12 bg-transparent text-xl py-1"
                                type="text"
                                value={alarmMode === 'work' ? workMinutes : restMinutes}
                                onChange={(e) => {handleTimeFormat('minutes', e.target.value)}}
                                maxLength={2}
                                placeholder="00"
                            />
                            
                            <button 
                                className="text-blue-300 hover:text-teal-300 transition-colors"
                                onClick={() =>  alarmMode === 'work' 
                                                ? setWorkMinutes(prev => String(Math.max(parseInt(prev) - 1, 0)))
                                                : setRestMinutes(prev => String(Math.max(parseInt(prev) - 1, 0)))
                                        }
                            >
                                <RemoveIcon />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-blue-300 text-sm mb-1">Seconds</span>
                        <div className="bg-slate-700/50 p-3 rounded-lg border border-blue-700/20 flex flex-col items-center">
                            <button 
                                onClick={() =>  alarmMode === 'work' 
                                                ? setWorkSeconds(prev => String(Math.min(parseInt(prev) + 1, 59)))
                                                : setRestSeconds(prev => String(Math.min(parseInt(prev) + 1, 59)))
                                        }
                                className="text-blue-300 hover:text-teal-300 transition-colors"
                            >
                                <AddIcon />
                            </button>
                            
                            <input
                                className="text-white text-center w-12 bg-transparent text-xl py-1"
                                type="text"
                                value={alarmMode === 'work' ? workSeconds : restSeconds}
                                onChange={(e) => {handleTimeFormat('seconds', e.target.value)}}
                                maxLength={2}
                                placeholder="00"
                            />
                            
                            <button 
                                className="text-blue-300 hover:text-teal-300 transition-colors"
                                onClick={() =>  alarmMode === 'work' 
                                                ? setWorkSeconds(prev => String(Math.max(parseInt(prev) - 1, 0)))
                                                : setRestSeconds(prev => String(Math.max(parseInt(prev) - 1, 0)))
                                        }
                            >
                                <RemoveIcon />
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-md hover:from-blue-500 hover:to-teal-400 transition duration-300"
                    onClick={handleSaveTimer}
                >
                    Save Alarm
                </button>
            </div>

            {success && (
    <div className="fixed bottom-4 right-4 bg-green-600/90 backdrop-blur-sm text-white px-4 py-3 rounded-xl shadow-lg font-semibold">
        Alarm settings saved!
    </div>
)}


        </div>
    )
}

export default TimerDialogBox