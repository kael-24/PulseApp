import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "./contextHook/useAuthContext";
import { useAlarmContext } from "./contextHook/useAlarmContext";

const useAlarmTimer = () => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const intervalRef = useRef(null);

    const { user } = useAuthContext();
    const { objectId, dispatch } = useAlarmContext();

    useEffect(() => {
        if (success === true) {
            intervalRef.current = setTimeout(() => {
                setSuccess(false);
            }, 3000);
            return () => clearTimeout(intervalRef.current);
        }
    }, [success])

    const getAlarmTimer = async () => {
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/alarmTimer/`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        
        const json = await response.json();
        
        if (!response.ok) {
            setError(json.error);
            return;
        }

        dispatch({type: 'SET_ALARM', payload: json})
    }

    const updateAlarmTimer = async (updateFields) => {
        setError(null);
        setSuccess(false);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/alarmTimer/${objectId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(updateFields)
        });

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            return;
        } 

        dispatch({type: 'SET_ALARM', payload: json})
        setSuccess(true)
        return json;
    }

    return {getAlarmTimer, updateAlarmTimer, error, success}
}

export default useAlarmTimer