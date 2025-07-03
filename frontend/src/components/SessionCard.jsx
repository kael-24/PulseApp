import { useState, useEffect } from "react";
import { formatDuration, intervalToDuration, format } from 'date-fns';
import { useNavigate } from 'react-router-dom'
import { useStopwatchContext } from "../hooks/useStopwatchContext";
import { useStopwatch } from "../hooks/useStopwatch";

import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

const SessionCard = ({ session, sessionWorkloads }) => {
    const [totalTime, setTotalTime] = useState(0);
    const [totalWorkTime, setTotalWorkTime] = useState(0);
    const [totalRestTime, setTotalRestTime] = useState(0);
    const [nameOnEdit, setNameOnEdit] = useState(false);
    const [newSessionName, setNewSessionName] = useState('');
    
    const { dispatch } = useStopwatchContext();  
    const { getStopwatch, updateStopwatch, deleteStopwatch } = useStopwatch();

    const navigate = useNavigate();

    // LOGIC FOR ADDING UP TIME TO GET TOTAL TIME
    useEffect(() => {
        setTotalTime(0);
        setTotalWorkTime(0);
        setTotalRestTime(0);
        sessionWorkloads.forEach((individualMode) => {
            setTotalTime(prevTotalTime => prevTotalTime + individualMode.timeMS);
            
            if(individualMode.mode === 'work'){
                setTotalWorkTime(prevTime => prevTime + individualMode.timeMS);
            } else {
                setTotalRestTime(prevTime => prevTime + individualMode.timeMS);
            }
        })
    }, [sessionWorkloads]);

    // REDIRECTS TO SESSION DETAILS PAGE
    const handleSessionDetails = () => {
        dispatch({ type: 'GET_SESSION', payload: session })
        navigate('/session-details');
    }

    // DELETE SESSION
    const deleteSession = async (e) => {
        e.stopPropagation();
        await deleteStopwatch(session._id);
        await getStopwatch();
    }

    // TODO UNFINISHED FUNCTION
    // EDIT SESSION NAME 
    const editSessionName = async (e) => {
        e.stopPropagation();
        await updateStopwatch(session._id, newSessionName);
        setNameOnEdit(false);
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
                        value={newSessionName}
                        onChange={(e) => setNewSessionName(e.target.value)}
                    />
            ) : (
                <h3>{session.sessionName}</h3>
            )}
            
            <p>Lasted for: {formatTime(totalTime)}</p>
            <p>Date: {formatDate(session.createdAt)}</p>
            <p>Total Work Time: {formatTime(totalWorkTime)}</p>
            <p>Total Rest Time: {formatTime(totalRestTime)}</p>
            
            {nameOnEdit ? (
                <div>
                    <button onClick={editSessionName}>
                        <CheckIcon />
                    </button>
                    <button onClick={() => setNameOnEdit(false)}>
                        <CloseIcon />
                    </button>
                </div>
                
            ) : (
                <div>  
                    <button onClick={(e) => {setNameOnEdit(true); e.stopPropagation()}}>
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