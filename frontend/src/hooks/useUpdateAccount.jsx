import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useUpdateAccount = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const { user, dispatch } = useAuthContext();

    const updateName = async (name) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/user/update-name', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ name })
            });

            const json = await response.json();

            if (!response.ok) {
                setIsLoading(false);
                setError(json.error);
                return;
            }

            setSuccess('Name updated successfully');
            setIsLoading(false);
        } catch (err) {
            console.error('Error updating name:', err);
            setIsLoading(false);
            setError('An error occurred. Please try again.');
        }
    };

    const updateEmail = async (email, password) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/user/update-email', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ email, password })
            });

            const json = await response.json();

            if (!response.ok) {
                setIsLoading(false);
                setError(json.error);
                return;
            }

            // Update local storage with new email
            const updatedUser = { ...user, email };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Update auth context
            dispatch({ type: 'LOGIN', payload: updatedUser });
            
            setSuccess('Email updated successfully');
            setIsLoading(false);
        } catch (err) {
            console.error('Error updating email:', err);
            setIsLoading(false);
            setError('An error occurred. Please try again.');
        }
    };
    
    const updatePassword = async (currentPassword, newPassword) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/user/update-password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const json = await response.json();

            if (!response.ok) {
                setIsLoading(false);
                setError(json.error);
                return;
            }

            setSuccess('Password updated successfully');
            setIsLoading(false);
        } catch (err) {
            console.error('Error updating password:', err);
            setIsLoading(false);
            setError('An error occurred. Please try again.');
        }
    };

    return { updateName, updateEmail, updatePassword, isLoading, error, success, setError, setSuccess };
}; 