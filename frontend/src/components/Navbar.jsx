import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import TimerDialogBox from './TimerDialogBox';
import DialogBox from "./DialogBox";
import useDownloadData from '../hooks/useDownloadData';
import { useDeepwork } from '../hooks/useDeepwork';

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import NotificationsIcon from '@mui/icons-material/Notifications'
import DownloadIcon from '@mui/icons-material/Download';

import { useAuthContext } from '../hooks/contextHook/useAuthContext'
import { useLogout } from '../hooks/userHook/useLogout'

const Navbar = () => {
    const { user } = useAuthContext();
    const { logout } = useLogout();
    const { getUserDownloadData } = useDownloadData();
    const { createDeepworkSession } = useDeepwork();
    const navigate = useNavigate(); 

    const [menuOpen, setMenuOpen] = useState(false);
    const [openTimerDialogBox, setOpenTimerDialogBox] = useState(false);
    const [openDownloadDialogBox, setOpenDownloadDialogBox] = useState(false)
    const [openLogoutDialogBox, setOpenLogoutDialogBox] = useState(false);

    const handleEditUser = () => {
        navigate('/edit-profile');
        setMenuOpen(false);
    };
    
    const handleLogout = () => {
        if (JSON.parse(localStorage.getItem('currentSession'))?.length > 0) {
            setOpenLogoutDialogBox(true);
            return;
        }
        logout();
        setMenuOpen(false);
    };

    const handleEndSession = (type, value) => {
        if (type == 'dontSave') {
            localStorage.setItem('currentSession', JSON.stringify([]));
        } else if (type == 'save') {
            // Safely retrieve any existing session from localStorage. If nothing is found, default to an empty array.
            const storedSession = JSON.parse(localStorage.getItem('currentSession')) || [];

            // Only attempt to revive timestamps and update state when we actually have data.
            if (storedSession.length > 0) {
                const revivedTimeStamp = storedSession.map(log => ({
                    ...log,
                    timestamp: new Date(log.timestamp),
                }));
                createDeepworkSession(value?.trim() || 'Untitled', revivedTimeStamp);
            }
            localStorage.setItem('currentSession', JSON.stringify([])); 
        }
        logout();        
    }

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    

    const downloadData = () => { // TODO
        getUserDownloadData();
    }

    return (
        <>
        <header className="bg-gradient-to-r from-gray-900 via-blue-950 to-slate-900 text-white p-4 flex justify-center items-center relative shadow-md">
            <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-teal-300 transition-colors">
                Pulse
            </Link>

            {/* Account (left) */}
            <div className="absolute left-4 flex items-center">
                <div className="relative">
                    <AccountCircleIcon 
                        onClick={toggleMenu} 
                        className="text-blue-300 cursor-pointer hover:text-teal-300 transition-colors" 
                        fontSize="large" 
                    />

                    {menuOpen && (
                        <div className="absolute left-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-10 border border-blue-700/30">
                            <div className="px-4 py-2 text-sm border-b border-blue-700/30">
                                <div className="font-medium text-blue-300">{user?.name}</div>
                                <div className="text-blue-400/70 truncate">{user?.email}</div>
                            </div>
                            
                            <button 
                                onClick={handleEditUser}
                                className="w-full text-left px-4 py-2 text-sm text-blue-300 hover:bg-slate-700 flex items-center transition-colors"
                            >
                                <SettingsIcon fontSize="small" className="mr-2 text-teal-400" />
                                Profile Settings
                            </button>

                            <button 
                                onClick={() => setOpenDownloadDialogBox(true)}
                                className="w-full text-left px-4 py-2 text-sm text-blue-300 hover:bg-slate-700 flex items-center transition-colors"
                            >
                                <DownloadIcon fontSize="small" className="mr-2 text-teal-400" />
                                Download Data
                            </button>
                            
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-blue-300 hover:bg-slate-700 flex items-center transition-colors"
                            >
                                <LogoutIcon fontSize="small" className="mr-2 text-teal-400" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Notification (right) */}
            <NotificationsIcon 
                onClick={() => setOpenTimerDialogBox(!openTimerDialogBox)} 
                className="text-blue-300 cursor-pointer hover:text-teal-300 transition-colors absolute right-4" 
                fontSize="large"
            />
        </header>
        <div>
            {openTimerDialogBox && (
                <TimerDialogBox onClose={() => setOpenTimerDialogBox(false)} /> 
            )}
        </div>
        <DialogBox 
            isOpen={openDownloadDialogBox}
            title="Are you sure you want to download your data?"
            message="You are about to download your User, Deepworks and Alarm Data"
            onCancel={() => setOpenDownloadDialogBox(false)}
            onConfirm={downloadData}
            type="confirm"
        />

        <DialogBox 
            isOpen={openLogoutDialogBox}
            title={'You have an unsaved session'}
            message={'Your current data will be lost if you logged out. Do you want to save it now?'}
            onCancel={() => setOpenLogoutDialogBox(false)}
            onDontSave={() => handleEndSession('dontSave')}
            onConfirm={(inputValue) => handleEndSession('save', inputValue)}
            type='handleDeepworkSession'
        />
        </>
    );
}

export default Navbar