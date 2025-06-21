import { useState } from "react"
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext'
import useEditUser from "../hooks/useEditUser";

// icons
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EditableField = ({label, type, value, editMode, onEdit, onCancel, onSave }) => {
    const [localValue, setLocalValue] = useState(value);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');

    const handleCancel = () => {
        setLocalValue(value);
        onCancel();
    };

    const saveChanges = () => {
        if (label === "Password"){
            onSave({currentPassword, newPassword, retypePassword});
            return;
        }
        onSave(localValue);
    }

    return(
        <div className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <div className="flex items-center space-x-3">
                <div className="flex-grow">
                    {editMode ? (
                        label === "Password" ? (
                            <>
                                <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                                />
                                <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                                />
                                <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={retypePassword}
                                    onChange={(e) => setRetypePassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <input
                                        type={type}
                                        value={localValue}
                                        onChange={(e) => setLocalValue(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </>
                        )
                    ) : (
                        <span className="block text-lg text-gray-800 px-4 py-2">
                            {type === "password" ? "••••••••" : value}
                        </span>
                    )}
                </div>

                <div className="flex-shrink-0">
                    {editMode ? (
                        <div className="flex space-x-2">
                            <button
                                onClick={saveChanges}
                                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-200"
                                aria-label="Save changes"
                            >
                                <CheckIcon />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200"
                                aria-label="Cancel changes"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onEdit}  // Trigger edit mode
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200"
                            aria-label="Edit field"
                        >
                            <EditIcon />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}  

const EditUser = () => {
    const { user } = useAuthContext();
    const { editUserDetails, error, isLoading } = useEditUser();

    const [activeField, setActiveField] = useState(null);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        currentPassword: "",
        newPassword: "",
        retypePassword: ""
    });

    const handleFieldAction = async (field, editValue) => {
        // Create updates object directly with the new value
        const updates = {};
        
        // Add the specific field being edited
        if (field === "name") {
            updates.name = editValue;
            console.log("Submitting name update:", { newName: editValue, currentUser: user });
        } else if (field === "password") {
            const { currentPassword, newPassword, retypePassword } = editValue;
            updates.currentPassword = currentPassword;
            updates.newPassword = newPassword;
            updates.retypePassword = retypePassword;
        }
        
        // Make API call directly with the new value
        if (Object.keys(updates).length > 0) {
            await editUserDetails(user.email, updates)
            setFormData(prev => ({ ...prev, [field]: editValue }));
            setActiveField(null);
        }
    };

    return(
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
                <Link to='/' className="flex items-center text-blue-600 hover:text-blue-800">
                    <ArrowBackIcon fontSize="small"/>
                    <span className="ml-1">Back</span>
                </Link>
            </div>


            <EditableField 
                label='Name'
                type='text'
                value={formData.name}
                editMode={activeField === "name"}
                onCancel={() => setActiveField(null)}
                onEdit={() => setActiveField("name")}
                onSave={(value) => {handleFieldAction("name", value)}}
            />

            <EditableField 
                label='Password'
                type='password'
                value={formData.currentPassword}
                editMode={activeField === "password"}
                onCancel={() => setActiveField(null)}
                onEdit={() => setActiveField("password")}
                onSave={(value) => {handleFieldAction("password", value)}}
            />

            {isLoading && <div className="mt-4 text-center text-blue-500">Updating...</div>}
            {error && (<div className="mt-4 text-center text-red-500">{error}</div>)}
        </div>
        
    )
}

export default EditUser;