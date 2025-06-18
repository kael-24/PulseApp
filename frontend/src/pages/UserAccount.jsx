import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useUpdateAccount } from '../hooks/useUpdateAccount';

const UserAccount = () => {
    const { user } = useAuthContext();
    const { updateName, updateEmail, updatePassword, isLoading, error, success } = useUpdateAccount();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    useEffect(() => {
        // Fetch user details when component mounts
        const fetchUserDetails = async () => {
            if (!user) return;
            
            try {
                const response = await fetch('/api/user/me', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const json = await response.json();
                
                if (response.ok) {
                    setName(json.name);
                    setEmail(json.email);
                }
            } catch (err) {
                console.error("Error fetching user details:", err);
            }
        };
        
        fetchUserDetails();
    }, [user]);
    
    const handleUpdateName = async (e) => {
        e.preventDefault();
        await updateName(name);
    };
    
    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        await updateEmail(email, currentPassword);
        setCurrentPassword('');
    };
    
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        await updatePassword(currentPassword, newPassword);
        setCurrentPassword('');
        setNewPassword('');
    };

    return(
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h3>
            
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
            
            <form onSubmit={handleUpdateName} className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Update Name</h4>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={isLoading}
                >
                    {isLoading ? "Updating..." : "Update Name"}
                </button>
            </form>
            
            <form onSubmit={handleUpdateEmail} className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Update Email</h4>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Current Password</label>
                    <input 
                        type="password" 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={isLoading}
                >
                    {isLoading ? "Updating..." : "Update Email"}
                </button>
            </form>
            
            <form onSubmit={handleUpdatePassword}>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Update Password</h4>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Current Password</label>
                    <input 
                        type="password" 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                    <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={isLoading}
                >
                    {isLoading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    )
}

export default UserAccount; 