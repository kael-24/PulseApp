import { useState } from "react"
import { useAuthContext } from "../contextHook/useAuthContext";

/**
 * Hook for handling user account deletion functionality
 */
const useDeleteUser = () => {
    const [deleteError, setDeleteError] = useState(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const { user, dispatch } = useAuthContext();

    /**
     * Deletes a user account
     * @param {string} email - User's email
     * @param {string} password - User's password for confirmation
     */
    const deleteUser = async (email, password) => {
        setIsDeleteLoading(true);
        setDeleteError(null);

        try {
            if (!password) {
                throw new Error("Password is required to delete your account");
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/userDelete`, {
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify({ password })
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error || "Failed to delete account");
            }

            // Clear local storage and global state
            localStorage.removeItem('user');
            dispatch({ type: 'LOGOUT' });
            
            return true;
        } catch (err) {
            setDeleteError(err.message);
            return false;
        } finally {
            setIsDeleteLoading(false);
        }
    };

    return { deleteUser, deleteError, isDeleteLoading };
};

export default useDeleteUser