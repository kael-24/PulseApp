import { useAuthContext } from './useAuthContext'

/**
 * Hook for handling user logout functionality
 */
export const useLogout = () => {
    const { dispatch } = useAuthContext();
    
    /**
     * Log out the current user
     */
    const logout = () => {
        // Remove user from storage
        localStorage.removeItem('user');
        
        // Update auth context
        dispatch({ type: 'LOGOUT' });
    };

    return { logout };
}