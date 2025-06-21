import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'

import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'

const Navbar = () => {
    const { user } = useAuthContext();
    const { logout } = useLogout();
    const navigate = useNavigate(); 
    const [menuOpen, setMenuOpen] = useState(false);

    const handleEditUser = () => {
        navigate('/edit-user');
        setMenuOpen(false);
    }
    
    const handleLogout = () => {
        logout();
        setMenuOpen(false);
    };
    
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    
    return (
        <header className="bg-gray-900 text-white p-4 flex justify-between items-center relative">
            <MenuIcon className="text-white-800 cursor-pointer" fontSize="large" />
            <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition">
                Pulse
            </Link>
            
            <div className="relative">
                <AccountCircleIcon 
                    onClick={toggleMenu} 
                    className="text-white cursor-pointer hover:text-blue-300 transition" 
                    fontSize="large" 
                />
                
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                            <div className="font-medium">{user.name}</div>
                            <div className="text-gray-500 truncate">{user.email}</div>
                        </div>
                        
                        <button 
                            onClick={handleEditUser}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                            <SettingsIcon fontSize="small" className="mr-2" />
                            Profile Settings
                        </button>
                        
                        <button 
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                            <LogoutIcon fontSize="small" className="mr-2" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar