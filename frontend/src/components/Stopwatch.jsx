import { useState, useEffect, useRef } from 'react';
import { 
  PlayArrow,
  Pause,
  Refresh,
  ArrowBack,
  KeyboardArrowUp,
  KeyboardArrowDown
} from '@mui/icons-material';

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [workTime, setWorkTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' or 'rest'
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(true);
  const intervalRef = useRef(null);
  const modeIntervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      // Main timer
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
      
      // Mode-specific timer
      modeIntervalRef.current = setInterval(() => {
        if (mode === 'work') {
          setWorkTime(prevTime => prevTime + 10);
        } else {
          setRestTime(prevTime => prevTime + 10);
        }
      }, 10);
    } else {
      clearInterval(intervalRef.current);
      clearInterval(modeIntervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(modeIntervalRef.current);
    };
  }, [isRunning, mode]);

  const handleStartStop = () => {
    setIsRunning(prevIsRunning => !prevIsRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setWorkTime(0);
    setRestTime(0);
    setLogs([]);
  };

  const handleEndSession = () => {
    setIsRunning(false);
  };

  const handleBack = () => {
    // This function would typically navigate back or handle a return action
    // For now it just stops the timer
    setIsRunning(false);
  };

  const toggleMode = (newMode) => {
    if (newMode === mode) return; // Prevent toggling to the same mode

    setIsRunning(false); // Pause timers during mode switch
    
    // Log the time from the previous mode
    if (mode === 'work' && workTime > 0) {
      const formattedTime = formatTime(workTime);
      setLogs(prevLogs => [...prevLogs, { type: 'work', time: formattedTime, timestamp: new Date() }]);
      // Reset work time for next session
      setWorkTime(0);
    } else if (mode === 'rest' && restTime > 0) {
      const formattedTime = formatTime(restTime);
      setLogs(prevLogs => [...prevLogs, { type: 'rest', time: formattedTime, timestamp: new Date() }]);
      // Reset rest time for next session
      setRestTime(0);
    }
    
    // Switch mode and resume if it was running
    setMode(newMode);
    setIsRunning(true);
  };

  // Format time to display as hh:mm:ss.ms
  const formatTime = (timeInMs = time) => {
    const hours = Math.floor(timeInMs / 3600000);
    const minutes = Math.floor((timeInMs % 3600000) / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const milliseconds = Math.floor((timeInMs % 1000) / 10);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  // Get the active time based on current mode
  const getActiveTime = () => {
    return mode === 'work' ? formatTime(workTime) : formatTime(restTime);
  };

  return (
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
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-6 mb-6">
            <button 
              onClick={handleReset}
              className="bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 p-3 rounded-full backdrop-blur-md transition-all"
              aria-label="Reset"
            >
              <Refresh className="w-8 h-8" />
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
              onClick={handleBack}
              className="bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 p-3 rounded-full backdrop-blur-md transition-all"
              aria-label="Back"
            >
              <ArrowBack className="w-8 h-8" />
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
              disabled={mode === 'rest'}
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
            onClick={handleEndSession}
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
                        log.type === 'work' ? 'bg-blue-900/30 border border-blue-700/30' : 'bg-teal-900/30 border border-teal-700/30'
                      }`}
                    >
                      <div>
                        <span className="text-blue-300 font-medium">
                          {log.type === 'work' ? 'Work' : 'Rest'} 
                        </span>
                        <span className="text-blue-400/60 text-xs ml-2">
                          {log.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <div className="font-mono text-blue-300">{log.time}</div>
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
  );
};

export default Stopwatch;
