import { useState } from "react"
import { useAuthContext } from "./useAuthContext";

/**
 * Hook for handling user account deletion functionality
 */
const useDeleteUser = () => {
    const [deleteError, setDeleteError] = useState(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const { dispatch } = useAuthContext();

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

            const response = await fetch('/api/users/userDelete', {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
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