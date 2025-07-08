import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useDeepworkContext } from "../hooks/useDeepworkContext";

export const useDeepwork = () => {
    const { user } = useAuthContext();
    const { dispatch } = useDeepworkContext();
    const [error, setError] = useState(null);

    const getDeepwork = async () => {
        setError(null);

        const response = await fetch('/api/deepwork', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
        });

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            return;
        }

        dispatch({ type: 'GET_SESSIONS', payload: json.deepworks || json.sessions || json });
    };

    const updateDeepwork = async (objectId, newName) => {
        setError(null);
        const response = await fetch('/api/deepwork/' + objectId, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify({ newDeepworkName: newName })
        });

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            return;
        }

        getDeepwork();
    };

    const createDeepworkSession = async (deepworkName, deepwork) => {
        setError(null);

        const response = await fetch('/api/deepwork', {
            method: 'POST',
            body: JSON.stringify({ deepworkName, deepwork }),
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
    };

    const deleteDeepwork = async (objectId) => {
        const response = await fetch('/api/deepwork/' + objectId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        });

        const json = await response.json();
        if (!response.ok) {
            setError(json.error + ': Cant delete deepwork');
            return;
        }

        return 'Session Deleted';
    };

    return { getDeepwork, updateDeepwork, createDeepworkSession, deleteDeepwork, error };
}; 