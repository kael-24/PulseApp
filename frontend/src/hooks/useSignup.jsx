
import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsloading] = useState(null);
    const { dispatch } = useAuthContext();

    const signup = async (name, email, password) => {
        setIsloading(true);
        setError(null);

        const response = await fetch('api/users/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name, email, password })
        })

        const json = await response.json();

        if (!response.ok) {
            setIsloading(false);
            setError(json.error);
        }
        if (response.ok) {
            setIsloading(false);
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({ type: 'LOGIN', payload: json});
        }
    }

    return {signup, error, isLoading}
}