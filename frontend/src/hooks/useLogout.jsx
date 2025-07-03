import { CrueltyFree } from '@mui/icons-material';
import { useAuthContext } from './useAuthContext'
import { useStopwatchContext } from './useStopwatchContext';

/**
 * Hook for handling user logout functionality
 */
export const useLogout = () => {
    const { dispatch } = useAuthContext();
    const { dispatch: sessionDispatch } = useStopwatchContext();
    
    /**
     * Log out the current user
     */
    const logout = () => {
        const currentSession = JSON.parse(localStorage.getItem('currentSession'));
        if (currentSession && currentSession.length > 0) {
            // TODO ** UNCLEAN TIMESTAMP FOR CURRENT SESSION
            sessionDispatch({ type: 'GET_CURRENT_SESSION', payload: true}); 
            console.log("Fucking", currentSession);
            return;
        }
        
        // Remove user from storage
        localStorage.removeItem('user');
        
        // Update auth context
        dispatch({ type: 'LOGOUT' });

        // CLEAR GLOBAL STATE
        sessionDispatch({ type: 'GET_SESSIONS', payload: null });
    };

    return { logout };
}