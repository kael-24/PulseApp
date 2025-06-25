import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

/**
 * Hook for handling user profile editing functionality
 */
const useEditUser = () => {
    const [nameError, setNameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [nameSuccess, setNameSuccess] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const { user, dispatch } = useAuthContext();

    const makeError = (message, code) => {
        const err = new Error(message);
        err.code = code;
        return err;
    };


    /**
     * Validates password changes
     * @param {string} currentPassword - User's current password
     * @param {string} newPassword - User's new password
     * @param {string} retypePassword - Re-entered new password for confirmation
     * @returns {object} - Validation result
     */
    const validatePasswordChange = (currentPassword, newPassword, retypePassword) => {
        if (newPassword && !currentPassword) 
            throw makeError("Enter your current password first", "PASSWORD_ERROR");
        if (currentPassword && (!newPassword || !retypePassword)) 
            throw makeError("Please confirm your new password", "PASSWORD_ERROR");
        if (newPassword && retypePassword && newPassword !== retypePassword) 
            throw makeError("New passwords do not match", "PASSWORD_ERROR");

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
        setNameSuccess(false);
        setPasswordSuccess(false);
        
        try {
            const { name, currentPassword, newPassword, retypePassword } = updates;
            
            console.log(currentPassword, newPassword, retypePassword)
            // Prepare base payload
            const payload = { email };
            
            // Add name if provided
            if (name && name !== user.name) {
                payload.name = name; 
            } else if (name && name === user.name) {
                throw makeError('Name should be different from current name', "NAME_ERROR");
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
                throw Error(json.error || "Failed to update user details");
            }
            
            // Update global state and localStorage
            dispatch({ type: 'UPDATE_USER', payload: json });
            localStorage.setItem('user', JSON.stringify({ 
                name: json.name, 
                email: email, 
                token: json.token
            }));
            
            if (updates.name){
                setNameSuccess(true);
            } else if (updates.newPassword) {
                setPasswordSuccess(true);
            }

        } catch (err) {
            if (err.code === 'NAME_ERROR'){
                setNameError(err.message)
            } else if (err.code === 'PASSWORD_ERROR') {
                setPasswordError(err.message)
            } else {
                setNameError(err.message)
                setPasswordError(err.message)
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { editUserDetails, nameError, passwordError, isLoading, nameSuccess, passwordSuccess };
};

export default useEditUser;