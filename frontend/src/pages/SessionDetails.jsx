import { useDeepworkContext } from "../hooks/contextHook/useDeepworkContext"
import { formatDuration, intervalToDuration, format } from 'date-fns';
import { Link } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WorkIcon from '@mui/icons-material/Work';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { useEffect, useState } from "react";


const SessionDetails = () => {
    const { deepworkSession } = useDeepworkContext();

    const [totalTime, setTotalTime] = useState(0);
    const [totalWorkTime, setTotalWorkTime] = useState(0);
    const [totalRestTime, setTotalRestTime] = useState(0);
    const [numberOfWork, setNumberOfWork] = useState(0);
    
    useEffect(() => {
        if (deepworkSession?.deepwork?.length > 0) {
            const deepworkWorkTime = deepworkSession.deepwork.reduce((sum, log) => {
                return log.mode === 'work' ? sum + log.timeMS : sum;
            }, 0);
            
            const deepworkRestTime = deepworkSession.deepwork.reduce((sum, log) => {
                return log.mode === 'rest' ? sum + log.timeMS : sum;
            }, 0);

            setNumberOfWork(deepworkSession.deepwork.reduce((sum, log) => {
                    return log.mode === 'work' ? sum + 1 : sum 
                }, 0)
            )
            setTotalWorkTime(deepworkWorkTime);
            setTotalRestTime(deepworkRestTime);
            setTotalTime(deepworkWorkTime + deepworkRestTime)
        }; 
    }, [deepworkSession]);

    const formatTime = (ms) => {
        const duration = intervalToDuration({ start: 0, end: ms });
        return formatDuration(duration) || "less than a second";
    }

    const formatDate = (sessionDateStart) => {
        return format(new Date(sessionDateStart), 'PPPP');
    }

    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-slate-900 py-8 px-4">
            <div className="max-w-md mx-auto">
                <div className="bg-slate-800/90 backdrop-blur-sm shadow-2xl rounded-2xl p-6 border border-blue-700/30 mb-6">
                    <div className="flex justify-end mb-2">
                        <Link to="/session-history" className="text-blue-400 hover:text-teal-300 transition-colors flex items-center">
                            <ArrowBackIcon fontSize="small" />
                            <span className="ml-1">Back</span>
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-center text-blue-300 mb-6">
                        {deepworkSession.deepworkName || "Session Details"}
                    </h1>
                    
                    <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
                        <div className="text-blue-300 font-medium mb-3 text-left">
                            Session Summary
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <AccessTimeIcon className="mr-2 text-teal-400" />
                                    <span className="text-slate-300">Total Duration</span>
                                </div>
                                <span className="font-semibold text-white">{formatTime(totalTime)}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <CalendarTodayIcon className="mr-2 text-blue-400" />
                                    <span className="text-slate-300">Session Date</span>
                                </div>
                                <span className="font-semibold text-white">{formatDate(deepworkSession.createdAt)}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <QueryStatsIcon className="mr-2 text-teal-400" />
                                    <span className="text-slate-300">Work Sessions</span>
                                </div>
                                <span className="font-semibold text-white">{numberOfWork}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <WorkIcon className="mr-2 text-amber-400" />
                                    <span className="text-slate-300">Work Time</span>
                                </div>
                                <span className="font-semibold text-white">{formatTime(totalWorkTime)}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <SelfImprovementIcon className="mr-2 text-purple-400" />
                                    <span className="text-slate-300">Rest Time</span>
                                </div>
                                <span className="font-semibold text-white">{formatTime(totalRestTime)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-blue-300 mb-3">Session Timeline</h2>
                    <div className="space-y-3">
                        {deepworkSession && deepworkSession.deepwork && deepworkSession.deepwork.map((logDetails, index) => (
                            <div 
                                className={`p-3 rounded-lg ${logDetails.mode === 'work' ? 'bg-amber-900/30 border border-amber-700/30' : 'bg-purple-900/30 border border-purple-700/30'}`} 
                                key={index}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {logDetails.mode === 'work' ? (
                                            <WorkIcon className="mr-2 text-amber-400" fontSize="small" />
                                        ) : (
                                            <SelfImprovementIcon className="mr-2 text-purple-400" fontSize="small" />
                                        )}
                                        <span className={`font-medium ${logDetails.mode === 'work' ? 'text-amber-300' : 'text-purple-300'}`}>
                                            {logDetails.mode.charAt(0).toUpperCase() + logDetails.mode.slice(1)} Session {index + 1}
                                        </span>
                                    </div>
                                    <span className="text-white">{formatTime(logDetails.timeMS)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SessionDetails