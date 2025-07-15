import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import TimerDialogBox from './TimerDialogBox';
import DialogBox from "./DialogBox";
import useDownloadData from '../hooks/useDownloadData';

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
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
    const navigate = useNavigate(); 

    const [menuOpen, setMenuOpen] = useState(false);
    const [openTimerDialogBox, setOpenTimerDialogBox] = useState(false);
    const [openDownloadDialogBox, setOpenDownloadDialogBox] = useState(false)

    const handleEditUser = () => {
        navigate('/edit-profile');
        setMenuOpen(false);
    };
    
    const handleLogout = () => {
        logout();
        setMenuOpen(false);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    

    const downloadData = () => { // TODO
        getUserDownloadData();
    }

    return (
        <>
        <header className="bg-gradient-to-r from-gray-900 via-blue-950 to-slate-900 text-white p-4 flex justify-between items-center relative shadow-md">
            <MenuIcon className="text-blue-300 cursor-pointer hover:text-teal-300 transition-colors" fontSize="large" />
            <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-teal-300 transition-colors">
                Pulse
            </Link>

            <div className="flex items-center gap-4">
                <NotificationsIcon 
                    onClick={() => setOpenTimerDialogBox(!openTimerDialogBox)} 
                    className="text-blue-300 cursor-pointer hover:text-teal-300 transition-colors"
                    fontSize="large"
                />
                
                <div className="relative">
                    <AccountCircleIcon 
                        onClick={toggleMenu} 
                        className="text-blue-300 cursor-pointer hover:text-teal-300 transition-colors" 
                        fontSize="large" 
                    />
                    
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-10 border border-blue-700/30">
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
                                onClick={() => setOpenDownloadDialogBox(true)} // TODO
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
        </>
    );
}

export default Navbar