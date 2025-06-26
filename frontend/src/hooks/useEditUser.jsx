import { useState, useRef, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";

/**
 * Hook for handling user profile editing functionality
 */
const useEditUser = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { dispatch } = useAuthContext();
    const intervalRef = useRef(null);

    // Clear error and success messages after a delay
    useEffect(() => {
        if (error || isSuccess) {
            intervalRef.current = setTimeout(() => {
                setError(null);   
                setIsSuccess(false);    
            }, 3000);
            
            return () => clearTimeout(intervalRef.current);
        }
    }, [error, isSuccess]);

    /**
     * Edit user details
     * @param {string} email - User's current email
     * @param {object} updates - Object containing fields to update (name, password)
     */
    const editUserDetails = async (email, updates = {}) => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            const { name, currentPassword, newPassword, retypePassword } = updates;
            
            // Prepare base payload
            const payload = { email };
            
            // Add name if provided
            if (name !== undefined) {
                payload.name = name.trim();
            }
            
            // Add password fields if provided
            if (currentPassword && newPassword && retypePassword) {
                // Only basic check to ensure passwords match before sending to server
                if (newPassword !== retypePassword) {
                    throw Error("New passwords do not match");
                }
                
                payload.currentPassword = currentPassword;
                payload.newPassword = newPassword;
            }
            
            // Make API call
            const response = await fetch('/api/users/userEdit', {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            
            const json = await response.json();
            
            if (!response.ok) {
                throw Error(json.error || "Failed to update user details");
            }
            
            // Update global state
            dispatch({ type: 'UPDATE_USER', payload: json });
            
            // Update localStorage with correct format matching login response
            localStorage.setItem('user', JSON.stringify({
                name: json.name,
                email: json.email,
                token: json.token
            }));
            
            setIsSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { editUserDetails, error, isLoading, isSuccess };
};

export default useEditUser;