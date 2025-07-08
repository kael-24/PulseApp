import { useState, useEffect } from "react";
import { formatDuration, intervalToDuration, format } from 'date-fns';
import { useNavigate } from 'react-router-dom'
import { useDeepworkContext } from "../hooks/useDeepworkContext";
import { useDeepwork } from "../hooks/useDeepwork";

import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

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
        return format(new Date(sessionDateStart), 'MMMM d, yyyy');
    }

    return(
        <div 
            className="p-4 border border-black"
            onClick={() => {if (!nameOnEdit) handleSessionDetails()}}
        >
            {nameOnEdit ? (
                    <input
                        type='text'
                        className=""
                        value={newDeepworkName}
                        onChange={(e) => setNewDeepworkName(e.target.value)}
                    />
            ) : (
                <h3>{newDeepworkName?.trim() || deepworkSession.deepworkName}</h3>
            )}
            
            <p>Lasted for: {formatTime(totalTime)}</p>
            <p>Date: {formatDate(deepworkSession.createdAt)}</p>
            <p>Total Work Time: {formatTime(totalWorkTime)}</p>
            <p>Total Rest Time: {formatTime(totalRestTime)}</p>
            
            {nameOnEdit ? (
                <div>
                    <button onClick={editSessionName}>
                        <CheckIcon />
                    </button>
                    <button onClick={handleCloseIcon}>
                        <CloseIcon />
                    </button>
                </div>
                
            ) : (
                <div>  
                    <button onClick={handleEditIcon}>
                        <EditIcon />    
                    </button>
                    <button onClick={deleteSession}>
                        <DeleteIcon />
                    </button>
                </div>
            )}

        </div>
    );
}

export default SessionCard