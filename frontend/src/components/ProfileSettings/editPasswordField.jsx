import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const EditPasswordField = ({ onSave, editMode, setEditMode }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [passwordErrors, setPasswordErrors] = useState({});

    // Reset form when edit mode changes
    useEffect(() => {
        if (editMode !== 'password') {
            setCurrentPassword("");
            setNewPassword("");
            setRetypePassword("");
            setPasswordErrors({});
        }
    }, [editMode]);

    // Validate password as user types
    useEffect(() => {
        const errors = {};
        
        if (newPassword) {
            if (newPassword.length < 8) {
                errors.newPassword = "Password must be at least 8 characters";
            }
            if (!/\d/.test(newPassword)) {
                errors.newPassword = "Password must contain at least one number";
            }
            if (!/[a-zA-Z]/.test(newPassword)) {
                errors.newPassword = "Password must contain at least one letter";
            }
        }
        
        if (retypePassword && newPassword !== retypePassword) {
            errors.retypePassword = "Passwords don't match";
        }
        
        setPasswordErrors(errors);
    }, [newPassword, retypePassword]);

    const handleSave = () => {
        if (Object.keys(passwordErrors).length > 0) {
            return;
        }
        onSave("password", { currentPassword, newPassword, retypePassword });
    };

    const handleCancel = () => {
        setCurrentPassword("");
        setNewPassword("");
        setRetypePassword("");
        setEditMode('');
    };

    // Check if save button should be disabled
    const isSaveDisabled = !currentPassword || !newPassword || !retypePassword || Object.keys(passwordErrors).length > 0;

    return (
    <div className="mb-6 p-4 rounded-lg border border-blue-700/30 bg-slate-800/50 backdrop-blur-sm shadow-sm">
        <label className="block text-sm font-medium text-blue-300 mb-2">
            Password
        </label>

        {editMode !== 'password' && (
        <div className="flex items-center justify-between w-full">
            <span className="block text-lg text-blue-300 px-4 py-2 flex-grow">
                ••••••••
            </span>
            <button
                onClick={() => setEditMode('password')}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition duration-200"
                aria-label="Edit field"
            >
            <EditIcon />
            </button>
        </div>
        )}

        {editMode === 'password' && (
        <div className="flex flex-col w-full">
            <div className="w-full mb-4">
            <label className="block text-sm font-medium text-blue-300 mb-2">
                Current Password
            </label>
            <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700/80 text-white border border-blue-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                autoFocus
            />
            </div>
            
            <div className="w-full mb-4">
            <label className="block text-sm font-medium text-blue-300 mb-2">
                New Password
            </label>
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full px-4 py-2 bg-slate-700/80 text-white border ${passwordErrors.newPassword ? 'border-red-500' : 'border-blue-600/30'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/70`}
            />
            {passwordErrors.newPassword && (
                <p className="text-red-300 text-sm mt-1">{passwordErrors.newPassword}</p>
            )}
            </div>
            
            <div className="w-full mb-4">
            <label className="block text-sm font-medium text-blue-300 mb-2">
                Confirm New Password
            </label>
            <input
                type="password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                className={`w-full px-4 py-2 bg-slate-700/80 text-white border ${passwordErrors.retypePassword ? 'border-red-500' : 'border-blue-600/30'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/70`}
            />
            {passwordErrors.retypePassword && (
                <p className="text-red-300 text-sm mt-1">{passwordErrors.retypePassword}</p>
            )}
            </div>

            <div className="flex justify-end gap-2">
            <button
                onClick={handleSave}
                disabled={isSaveDisabled}
                className={`flex-1 flex justify-center p-2 ${isSaveDisabled ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400'} text-white rounded-lg transition duration-200`}
                aria-label="Save changes"
            >
                <CheckIcon className="mr-1" /> Save
            </button>

            <button
                onClick={handleCancel}
                className="flex justify-center p-2 bg-slate-700/80 hover:bg-slate-600/80 text-white rounded-lg transition duration-200"
                aria-label="Cancel changes"
            >
                <CloseIcon className="mr-1" /> Cancel
            </button>
            </div>
        </div>
        )}
    </div>
    );
};

export default EditPasswordField;