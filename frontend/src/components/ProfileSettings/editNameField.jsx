import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const EditNameField = ({ userName, onSave, editMode, setEditMode }) => {
    const [name, setName] = useState(userName);
    
        const handleSave = () => {
        onSave("name", name);
        };
    
        const handleCancel = () => {
        setName(userName);
        setEditMode('');
        };
    
        return (
        <div className="mb-6 p-4 rounded-lg border border-blue-700/30 bg-slate-800/50 backdrop-blur-sm shadow-sm">
            <label className="block text-sm font-medium text-blue-300 mb-2">
            Name
            </label>
    
            {editMode !== 'name' && (
            <div className="flex items-center justify-between w-full">
                <span className="block text-lg text-blue-300 px-4 py-2 flex-grow">
                {name}
                </span>
                <button
                onClick={() => setEditMode('name')}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition duration-200"
                aria-label="Edit field"
                >
                <EditIcon />
                </button>
            </div>
            )}
    
            {editMode === 'name' && (
            <div className="flex flex-col w-full">
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700/80 text-white border border-blue-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/70 mb-4"
                autoFocus
                />

                {name.trim().length < 2 && (
                <p className="text-red-300 text-sm mt-2">Name must be at least 2 characters</p>
                )}
    
                <div className="flex justify-end gap-2">
                <button
                    onClick={handleSave}
                    disabled={!name.trim() || name.trim().length < 2 || name.trim() === userName}
                    className={`flex-1 flex justify-center p-2 ${!name.trim() || name.trim().length < 2 || name.trim() === userName
                    ? 'bg-blue-600/50 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400'} text-white rounded-lg transition duration-200`}
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

export default EditNameField;