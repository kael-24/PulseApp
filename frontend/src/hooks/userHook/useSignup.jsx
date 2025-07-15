import { useState } from 'react'
import { useAuthContext } from '../contextHook/useAuthContext'

/**
 * Hook for handling user signup functionality
 */
export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    /**
     * Sign up a new user
     * @param {string} name - User's name
     * @param {string} email - User's email
     * @param {string} password - User's password
     */
    const signup = async (name, email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('api/users/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, email, password })
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error || 'Signup failed');
            }

            // Save to localStorage and update context
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({ type: 'LOGIN', payload: json });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { signup, error, isLoading };
}