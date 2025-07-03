import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useStopwatchContext } from '../hooks/useStopwatchContext'

export const useStopwatch = () => {
    const { user } = useAuthContext();
    const { dispatch } = useStopwatchContext();
    const [error, setError] = useState(null);

    /**
     * Get every sessions // TODO havent full revised
     * @returns 
     */
    const getStopwatch = async () => {
        setError(null);

        const response = await fetch('/api/stopwatch', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
        });
        
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            return
        }

        dispatch({ type: 'GET_SESSIONS', payload: json.sessions })
    }

    /**
     * UPDATE STOPWATCH // TODO = **UNFINISHED
     * @param {*} objectId 
     * @returns 
     */
    const updateStopwatch = async (objectId, newName) => {
        setError(null);
        
        const response = await fetch('/api/stopwatch/' + objectId, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify({ newName })
        });

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            return;
        }

        getStopwatch();
        return;
    }

    /**
     * Create session // TODO = havent fully revised
     * @param {*} sessionName = name of session
     * @param {*} session  = individual session
     * @returns 
     */
    const createStopwatchSession = async (sessionName, session) => {
        setError(null);

        const response = await fetch('/api/stopwatch', {
            method: 'POST',
            body: JSON.stringify({ sessionName, session }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            return;
        }
    }

    /**
     * Delete session // TODO = havent fully revised yet // 
     * @param {*} objectId 
     * @returns String session deleted
     */
    const deleteStopwatch = async (objectId) => {
        const response = await fetch('/api/stopwatch/' + objectId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        });

        const json = await response.json();
        
        if (!response.ok) {
            setError(json.error + ': Cant delete workout');
            return;
        }

        return 'Session Deleted';
    }

    return {getStopwatch, updateStopwatch, createStopwatchSession, deleteStopwatch, error};
}

