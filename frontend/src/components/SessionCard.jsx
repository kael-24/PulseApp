import { useState, useEffect } from "react";
import { formatDuration, intervalToDuration, format } from 'date-fns';
import { useNavigate } from 'react-router-dom'
import { useDeepworkContext } from "../hooks/useDeepworkContext";
import { useDeepwork } from "../hooks/useDeepwork";

import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WorkIcon from '@mui/icons-material/Work';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';

const SessionCard = ({ deepworkSession, deepworkLogs }) => {
    const [totalTime, setTotalTime] = useState(0);
    const [totalWorkTime, setTotalWorkTime] = useState(0);
    const [totalRestTime, setTotalRestTime] = useState(0);
    const [nameOnEdit, setNameOnEdit] = useState(false);
    const [newDeepworkName, setNewDeepworkName] = useState('');
    
    const { dispatch } = useDeepworkContext();  
    const { getDeepwork, updateDeepwork, deleteDeepwork } = useDeepwork();

    const navigate = useNavigate();

    // LOGIC FOR ADDING UP TIME TO GET TOTAL TIME
    useEffect(() => {
        setTotalTime(0);
        setTotalWorkTime(0);
        setTotalRestTime(0);
        deepworkLogs.forEach((individualMode) => {
            setTotalTime(prevTotalTime => prevTotalTime + individualMode.timeMS);
            
            if(individualMode.mode === 'work'){
                setTotalWorkTime(prevTime => prevTime + individualMode.timeMS);
            } else {
                setTotalRestTime(prevTime => prevTime + individualMode.timeMS);
            }
        })
    }, [deepworkLogs]);

    // REDIRECTS TO SESSION DETAILS PAGE
    const handleSessionDetails = () => {
        dispatch({ type: 'GET_SESSION', payload: deepworkSession })
        navigate('/session-details');
    }

    // DELETE SESSION
    const deleteSession = async (e) => {
        e.stopPropagation();
        await deleteDeepwork(deepworkSession._id);
        await getDeepwork();
    }

    // EDIT SESSION NAME 
    const editSessionName = async (e) => {
        if (!newDeepworkName?.trim()) {
            setNewDeepworkName('Untitled');
        }
        e.stopPropagation();
        await updateDeepwork(deepworkSession._id, newDeepworkName);
        setNameOnEdit(false);
    }

    // HANDLE CLOSE ICON
    const handleCloseIcon = () => {
        setNameOnEdit(false); 
        setNewDeepworkName("");
    }

    // HANDLE EDIT ICON
    const handleEditIcon = (e) => {
        e.stopPropagation(); 
        setNameOnEdit(true); 
        setNewDeepworkName("");
    }

    const formatTime = (ms) => {
        const duration = intervalToDuration({ start: 0, end: ms });
        return formatDuration(duration) || "less than a second";
    }

    const formatDate = (sessionDateStart) => {
        return format(new Date(sessionDateStart), 'PPPP');
    }

    return(
        <div 
            className="bg-slate-800/90 backdrop-blur-sm shadow-md rounded-xl p-5 border border-blue-700/30 mb-4 hover:bg-slate-700/80 transition duration-300 cursor-pointer"
            onClick={() => {if (!nameOnEdit) handleSessionDetails()}}
        >
            <div className="flex justify-between items-center mb-3">
                {nameOnEdit ? (
                    <input
                        type='text'
                        className="w-full px-3 py-1 bg-slate-700/80 text-white border border-blue-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/70 transition"
                        value={newDeepworkName}
                        onChange={(e) => setNewDeepworkName(e.target.value)}
                        placeholder={deepworkSession.deepworkName}
                    />
                ) : (
                    <h3 className="text-xl font-semibold text-blue-300">{newDeepworkName?.trim() || deepworkSession.deepworkName}</h3>
                )}
                
                <div className="flex space-x-1">
                    {nameOnEdit ? (
                        <>
                            <button 
                                onClick={editSessionName}
                                className="p-1 text-teal-400 hover:text-teal-300 transition"
                            >
                                <CheckIcon fontSize="small" />
                            </button>
                            <button 
                                onClick={handleCloseIcon}
                                className="p-1 text-red-400 hover:text-red-300 transition"
                            >
                                <CloseIcon fontSize="small" />
                            </button>
                        </>
                    ) : (
                        <>  
                            <button 
                                onClick={handleEditIcon}
                                className="p-1 text-blue-400 hover:text-blue-300 transition"
                            >
                                <EditIcon fontSize="small" />
                            </button>
                            <button 
                                onClick={deleteSession}
                                className="p-1 text-red-400 hover:text-red-300 transition"
                            >
                                <DeleteIcon fontSize="small" />
                            </button>
                        </>
                    )}
                </div>
            </div>
            
            <div className="space-y-2 text-slate-300 text-sm">
                <div className="flex items-center">
                    <AccessTimeIcon className="mr-2 text-teal-400" fontSize="small" />
                    <span>Duration: <span className="font-medium text-white">{formatTime(totalTime)}</span></span>
                </div>
                
                <div className="flex items-center">
                    <CalendarTodayIcon className="mr-2 text-blue-400" fontSize="small" />
                    <span>Date: <span className="font-medium text-white">{formatDate(deepworkSession.createdAt)}</span></span>
                </div>
                
                <div className="flex items-center">
                    <WorkIcon className="mr-2 text-amber-400" fontSize="small" />
                    <span>Work time: <span className="font-medium text-white">{formatTime(totalWorkTime)}</span></span>
                </div>
                
                <div className="flex items-center">
                    <SelfImprovementIcon className="mr-2 text-purple-400" fontSize="small" />
                    <span>Rest time: <span className="font-medium text-white">{formatTime(totalRestTime)}</span></span>
                </div>
            </div>
        </div>
    );
}

export default SessionCard