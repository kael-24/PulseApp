import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

/**
 * Hook for handling user profile editing functionality
 */
const useEditUser = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { user, dispatch } = useAuthContext();


    /**
     * Validates password changes
     * @param {string} currentPassword - User's current password
     * @param {string} newPassword - User's new password
     * @param {string} retypePassword - Re-entered new password for confirmation
     * @returns {object} - Validation result
     */
    const validatePasswordChange = (currentPassword, newPassword, retypePassword) => {
        if (newPassword && !currentPassword) {
            throw new Error("Enter your current password first");
        }
        
        if (currentPassword && (!newPassword || !retypePassword)) {
            throw new Error("Please enter and confirm your new password");
        }
        
        if (newPassword && retypePassword && newPassword !== retypePassword) {
            throw new Error("New passwords do not match");
        }

        return {
            currentPassword,
            newPassword: newPassword && retypePassword && newPassword === retypePassword ? newPassword : null
        };
    };

    /**
     * Edit user details
     * @param {string} email - User's current email
     * @param {object} updates - Object containing fields to update (name, newEmail, passwordData)
     */
    const editUserDetails = async (email, updates = {}) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            const { name, currentPassword, newPassword, retypePassword } = updates;
            
            console.log(currentPassword, newPassword, retypePassword)
            // Prepare base payload
            const payload = { email };
            
            // Add name if provided
            if (name && name !== user.name) {
                payload.name = name; 
            } 
            if (name && name === user.name) {
                throw Error('Name should be different from current name');
            }
            
            // PASSWORD HANDLER
            const { currentPassword: validatedCurrentPassword, newPassword: validatedNewPassword } = validatePasswordChange(currentPassword, newPassword, retypePassword);

            if (validatedCurrentPassword && validatedNewPassword) {
                payload.currentPassword = validatedCurrentPassword;
                payload.newPassword = validatedNewPassword;
            }

            // Validate that at least one field is being updated
            if (Object.keys(payload).length <= 1) {
                throw Error("You haven't updated anything");
            }
            
            // Make API call
            const response = await fetch('/api/users/userEdit', {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            
            const json = await response.json();
            
            if (!response.ok) {
                throw new Error(json.error || "Failed to update user details");
            }
            
            // Update global state and localStorage
            dispatch({ type: 'UPDATE_USER', payload: json });
            localStorage.setItem('user', JSON.stringify({ 
                name: json.name, 
                email: email, 
                token: json.token
            }));
            
            setSuccess(true);
        } catch (err) {
            setError(err.message);
            setSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return { editUserDetails, error, isLoading, success };
};

export default useEditUser;