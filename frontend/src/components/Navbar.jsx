import { Link, useNavigate } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'

import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const handleUserInfo = () => {
        navigate('/account');
    }
    
    return (
        <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <MenuIcon className="text-white-800 cursor-pointer" fontSize="large" />
            <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition">
                Pulse
            </Link>
            <nav>
                <div className="text-sm">
                    <span className="text-gray-300">{user.email}</span>
                    <AccountCircleIcon onClick={handleUserInfo} className="color-white-700 cursor-pointer ml-2 hover:text-blue-300 transition" fontSize="large" />
                </div>
                
            </nav>
            
        </header>
    );
}

export default Navbar