import { useAuthContext } from '../contextHook/useAuthContext'
import { useDeepworkContext } from '../contextHook/useDeepworkContext';

/**
 * Hook for handling user logout functionality
 */
export const useLogout = () => {
    const { dispatch } = useAuthContext();
    const { dispatch: deepworkDispatch } = useDeepworkContext();
    
    /**
     * Log out the current user
     */
    const logout = () => {

        // Remove user from storage
        localStorage.removeItem('user');
        localStorage.removeItem('currentSession');
        
        // Update auth context
        dispatch({ type: 'LOGOUT' });

        

        // CLEAR GLOBAL STATE
        deepworkDispatch({ type: 'GET_SESSIONS', payload: null });
    };

    return { logout };
}