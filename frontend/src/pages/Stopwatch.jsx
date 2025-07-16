import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlayArrow,
  Pause,
  ArrowBack,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Refresh,
  History
} from '@mui/icons-material';
import { useDeepwork } from '../hooks/useDeepwork';
import DialogBox from '../components/DialogBox';
import { useAlarmContext } from '../hooks/contextHook/useAlarmContext';


const Stopwatch = () => {
  const { createDeepworkSession } = useDeepwork();  
  const [openDialogBox, setOpenDialogBox] = useState(false); 
  const { isWorkAlarmEnabled, isRestAlarmEnabled, alarmWorkTime, alarmRestTime} = useAlarmContext();

  const [time, setTime] = useState(0);
  const [workTime, setWorkTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' or 'rest'
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(true);

  const [workTimeAlarm, setWorkTimeAlarm] = useState(0);
  const [restTimeAlarm, setRestTimeAlarm] = useState(0);

  const intervalRef = useRef(null);
  const modeIntervalRef = useRef(null);
  const alarmIntervalRef = useRef(null);
  const audio = useRef(null);

  // Initialize audio object after component mounts
  useEffect(() => {
    audio.current = new Audio('/alarm_sound.mp3');
    
    return () => {
      if (audio.current) {
        audio.current.pause();
        audio.current.src = '';
      }
    };
  }, []);

  useEffect(() => {    
    setWorkTimeAlarm(alarmWorkTime);
    setRestTimeAlarm(alarmRestTime);
  }, [alarmWorkTime, alarmRestTime, isWorkAlarmEnabled, isRestAlarmEnabled])

  /**
   * STOPWATCH TIMER LOGIC
   **/ 
  useEffect(() => {
    if (isRunning) {
      // STOPWATCH TIMER FOR TOTAL TIMER
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 100);
      }, 100);
      
      // STOPWATCH TIMER FOR MODE (WORK AND REST)
      modeIntervalRef.current = setInterval(() => {
        if (mode === 'work') {
          setWorkTime(prevTime => prevTime + 100);
        } else {
          setRestTime(prevTime => prevTime + 100);
        }
      }, 100);

      // STOPWATCH FOR TIMER
      alarmIntervalRef.current = setInterval(() => {
        if (mode === 'work' && isWorkAlarmEnabled) {
          setWorkTimeAlarm(prev => {
            if (prev <= 0) {
              clearInterval(alarmIntervalRef.current);
              return 0;
            }
            return prev - 1;
          })
        } else if (mode === 'rest' && isRestAlarmEnabled) {
          setRestTimeAlarm(prev => {
            if (prev <= 0) {
              clearInterval(alarmIntervalRef.current);
              return 0;
            }
            return prev - 1;
          })
        }
      }, 1000);

      // IF ITS NOT RUNNING ONLY STOP THE TIMER, NOT RESET 
    } else {
      clearInterval(intervalRef.current);
      clearInterval(modeIntervalRef.current);
      clearInterval(alarmIntervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(modeIntervalRef.current);
      clearInterval(alarmIntervalRef.current);
    };
  }, [isRunning, mode, isWorkAlarmEnabled, isRestAlarmEnabled]);


  /**
   * STORING DATA IN LOCAL STORAGE EVERY TOGGLE IN WORK/REST
   *  */ 
  useEffect(() => {
    if (!logs || logs.length < 1) {
      // Safely retrieve any existing session from localStorage. If nothing is found, default to an empty array.
      const storedSession = JSON.parse(localStorage.getItem('currentSession')) || [];
      
      // Only attempt to revive timestamps and update state when we actually have data.
      if (storedSession.length > 0) {
        const revivedTimeStamp = storedSession.map(log => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
        // console.log(logs.log[0].timeMS);
        setLogs(revivedTimeStamp);
        setTime(revivedTimeStamp.reduce((sum, log) => sum + log.timeMS, 0))
      }
      return;
    }
    localStorage.setItem('currentSession', JSON.stringify(logs));
  }, [mode]);


  useEffect(() => {
    if (!audio.current) return;

    if (alarmWorkTime <= 0 || alarmRestTime <= 0) return;

    if (isRunning && ((workTimeAlarm <= 0 && mode === 'work' && isWorkAlarmEnabled) || 
        (restTimeAlarm <= 0 && mode === 'rest' && isRestAlarmEnabled))) {
        audio.current.loop = true;
        audio.current.play().catch(error => console.error("Audio play failed:", error));
    } else {
      audio.current.pause();
      audio.current.currentTime = 0;
    }

    return () => {
      if (audio.current) {
        audio.current.pause();
        audio.current.currentTime = 0;
      }
    }
  }, [workTimeAlarm, restTimeAlarm, mode, isWorkAlarmEnabled, isRestAlarmEnabled])


  const resetAlarm = () => {
    if (!audio.current) return;
    
    audio.current.pause();
    audio.current.currentTime = 0;
    setWorkTimeAlarm(alarmWorkTime);
    setRestTimeAlarm(alarmRestTime);
  }

  /**
   * SETS START AND STOP BUTTON
   */
  const handleStartStop = () => {
    setIsRunning(prevIsRunning => !prevIsRunning);
  };

  /**
   * HANDLES END SESSION BUTTON LOGIC
   * @param {string} type 
   * @param {string} value 
   */
  const handleEndSession = (type, value) => {
    setIsRunning(false);
    setWorkTime(0);
    setRestTime(0);
    setTime(0);
    setLogs([]);
    setMode('work');
    setOpenDialogBox(false);
    resetAlarm();
    
    if (type === 'saveDeepwork') {
      createDeepworkSession(value?.trim() || 'Untitled', logs);
    }
    localStorage.setItem('currentSession', JSON.stringify([])); 
  };

  const handleReturn = () => {
    setIsRunning(false);
    // const totalLogsTime = logs.reduce((sum, log) => sum + log.timeMS, 0);

    if (mode === 'work'){
      if (workTime >= 5000 || workTime < 5000 && logs.length === 0) {
        setTime(prevTime => prevTime - workTime)
        setWorkTime(0);
      } else if (workTime < 5000) {  
        setTime(prevTime => prevTime - workTime)
        const prevRestime = logs[logs.length - 1].timeMS
        setMode('rest');
        setRestTime(prevRestime);
        setWorkTime(0);
        setLogs(prevLogs => {
          const updated = [...prevLogs]
          updated.pop();
          if (updated.length < 1) {
            localStorage.setItem('currentSession', JSON.stringify([]));
          }
          return updated;
        })
      }
    } else if (mode === 'rest') {
      if (restTime >= 5000) {
        setTime(prevTime => prevTime - restTime)
        setRestTime(0);
      } else if (restTime < 5000) {
        const prevWorkTime = logs[logs.length -1].timeMS
        setTime(prevTime => prevTime - restTime);
        setMode('work');
        setWorkTime(prevWorkTime);
        setRestTime(0);
        setLogs(prevLogs => {
          const updated = [...prevLogs]
          updated.pop();
          if (updated.length < 1) {
            localStorage.setItem('currentSession', JSON.stringify([]));
          }
          return updated;
        })
      }
    }
  };

  /**
   * SAVES THE CURRENT DEEPWORK LOGS BEFORE SWITCHING MODE
   * @param {string} newMode 
   * @returns 
   */
  const toggleMode = (newMode) => {
    if (newMode === mode) return; // Prevent toggling to the same mode

    setIsRunning(false); // Pause timers during mode switch
    setWorkTimeAlarm(alarmWorkTime);
    setRestTimeAlarm(alarmRestTime);
    
    // Log the time from the previous mode
    if (mode === 'work' && workTime > 0) {
      const formattedTime = formatTime(workTime);
      setLogs(prevLogs => [...prevLogs, { mode: 'work', timeMS: workTime, formattedTime: formattedTime, timestamp: new Date() }]);
      // Reset work time for next session
      setWorkTime(0);
    } else if (mode === 'rest' && restTime > 0) {
      const formattedTime = formatTime(restTime);
      setLogs(prevLogs => [...prevLogs, { mode: 'rest', timeMS: restTime, formattedTime: formattedTime, timestamp: new Date() }]);
      // Reset rest time for next session
      setRestTime(0);
    }
    
    // Switch mode and resume if it was running
    setMode(newMode);
    setIsRunning(true);
  };


  /**
   * FORMAT TIME TO SHOW AS hh:mm:ss.ms
   * @param {number} timeInMs 
   * @returns 
   */
  const formatTime = (timeInMs = time) => {
    const hours = Math.floor(timeInMs / 3600000);
    const minutes = Math.floor((timeInMs % 3600000) / 60000);      
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const milliseconds = Math.floor((timeInMs % 1000) / 100);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(1, '0')}`;
  };

  /**
   * GET MAIN ACTIVE STOPWATCH TIME BASED ON CURRENT MODE
   * @returns 
   */
  const getActiveTime = () => {
    return mode === 'work' ? formatTime(workTime) : formatTime(restTime);
  };

  const getAlarmTime = () => {
    let hours, minutes, seconds;
    if (mode === 'work') {
      hours = Math.floor(workTimeAlarm / 3600);
      minutes = Math.floor((workTimeAlarm % 3600) / 60);      
      seconds = Math.floor(workTimeAlarm % 60);
    } else {
      hours = Math.floor(restTimeAlarm / 3600);
      minutes = Math.floor((restTimeAlarm % 3600) / 60);      
      seconds = Math.floor(restTimeAlarm % 60);
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }


  return (
    <>
      <div className="flex flex-col items-center justify-center p-8 max-w-md mx-auto">
        <div className="w-full bg-gradient-to-br from-gray-900 via-blue-950 to-slate-900 rounded-xl shadow-2xl overflow-hidden border border-blue-700/30">
          <div className="p-8 text-center">
            {/* Small Total Time */}
            <div className="font-mono text-blue-300/70 text-sm mb-2 font-medium">
              Total: {formatTime()}
            </div>

            {/* Active mode timer */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-4 mb-6 border border-blue-600/20">
              <h2 className="text-blue-300/70 text-sm font-medium mb-1">
                {mode.toUpperCase()} TIME
              </h2>
              <div className="font-mono text-blue-300 text-3xl font-medium tracking-wide">
                {getActiveTime()}
              </div>
              
              {/* Alarm display */}
              {((mode === 'work' && isWorkAlarmEnabled) || (mode === 'rest' && isRestAlarmEnabled)) && (
                <div className="mt-2 p-2 bg-slate-700/50 rounded-lg flex justify-between items-center">
                  <span className="text-blue-300/70 text-xs">Alarm:</span>
                  <span className="font-mono text-blue-300 text-xl">{getAlarmTime()}</span>
                  <button 
                    onClick={resetAlarm}
                    className="bg-slate-600/70 hover:bg-slate-500/70 text-blue-300 p-1 rounded-md transition-all"
                    aria-label="Reset alarm"
                  >
                    <Refresh className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex justify-center gap-4 mb-6">
              <button 
                className="bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 p-3 rounded-full backdrop-blur-md transition-all"
                aria-label="Session History"
              >
                <Link to='session-history'>
                  <History className="w-6 h-6" />
                </Link>
              </button>
              
              <button 
                onClick={handleStartStop}
                className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white p-4 rounded-full backdrop-blur-md transition-all"
                aria-label={isRunning ? "Pause" : "Start"}
              >
                {isRunning ? 
                  <Pause className="w-10 h-10" /> : 
                  <PlayArrow className="w-10 h-10" />
                }
              </button>
              
              <button 
                onClick={handleReturn}
                className="bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 p-3 rounded-full backdrop-blur-md transition-all"
                aria-label="Back"
              >
                <ArrowBack className="w-6 h-6" />
              </button>
            </div>

            {/* Mode selector */}
            <div className="bg-slate-800/50 backdrop-blur-sm p-1 rounded-xl flex mb-4 border border-blue-700/20">
              <button
                onClick={() => toggleMode('work')}
                disabled={mode === 'work'}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  mode === 'work' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white cursor-default' 
                    : 'text-blue-300 hover:bg-slate-700/50'
                }`}
              >
                Work
              </button>
              <button
                onClick={() => toggleMode('rest')}
                disabled={mode === 'rest' || (logs.length === 0 && workTime <= 0)}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  mode === 'rest' 
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white cursor-default' 
                    : 'text-blue-300 hover:bg-slate-700/50'
                }`}
              >
                Rest
              </button>
            </div>

            {/* End Session Button */}
            <button 
              onClick={() => {setOpenDialogBox(true); setIsRunning(false)}}
              className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 font-medium py-2 rounded-lg transition-all mb-4"
            >
              End Session
            </button>

            {/* Log toggle button */}
            <button 
              onClick={() => setShowLogs(!showLogs)} 
              className="w-full flex items-center justify-center gap-1 bg-slate-800/30 hover:bg-slate-700/50 text-blue-300/80 py-2 rounded-lg transition-all mb-2"
            >
              <span>{showLogs ? 'Hide' : 'Show Logs'}</span>
              {showLogs ? <KeyboardArrowUp className="text-teal-400" /> : <KeyboardArrowDown className="text-teal-400" />}
            </button>

            {/* Logs */}
            {showLogs && (
              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 text-left max-h-60 overflow-y-auto border border-blue-700/20">
                <h3 className="text-blue-300/70 text-sm font-medium mb-2">SESSION LOGS</h3>
                {logs.length > 0 ? (
                  <div className="space-y-2">
                    {logs.map((log, index) => (
                      <div 
                        key={index} 
                        className={`flex justify-between items-center p-2 rounded-lg ${
                          log.mode === 'work' ? 'bg-blue-900/30 border border-blue-700/30' : 'bg-teal-900/30 border border-teal-700/30'
                        }`}
                      >
                        <div>
                          <span className="text-blue-300 font-medium">
                            {log.mode === 'work' ? 'Work' : 'Rest'} 
                          </span>
                          <span className="text-blue-400/60 text-xs ml-2">
                            {log.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <div className="font-mono text-blue-300">{log.formattedTime}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-blue-400/60 text-center py-4">
                    No sessions logged yet
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {openDialogBox && (
        <DialogBox 
          isOpen={openDialogBox}
          title={'Are you sure you want to end the current session?'}
          message={'Your current data will be saved, but the session will restart. Please enter your session name.'}
          onCancel={() => setOpenDialogBox(false)}
          onDontSave={() => handleEndSession('dontSaveDeepwork')}
          onConfirm={(inputValue) => handleEndSession('saveDeepwork', inputValue)}
          type='handleDeepworkSession'
        />
      )}
    </>
  );
};

export default Stopwatch;
