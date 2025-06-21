import { useState } from "react";

import { useAuthContext } from "./useAuthContext";

/**
 * Hook for handling user login functionality
 */
export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    /**
     * Log in a user with email and password
     * @param {string} email - User's email
     * @param {string} password - User's password
     */
    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error || 'Login failed');
            }

            // Save to localStorage and update context
            localStorage.setItem('user', JSON.stringify({
                name: json.name, 
                email: json.email, 
                token: json.token
            }));
            
            dispatch({ type: 'LOGIN', payload: json });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { login, error, isLoading };
}
