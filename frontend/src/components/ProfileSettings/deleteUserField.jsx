import { useState, useEffect } from 'react'; 
import DialogBox from '../DialogBox';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

const DeleteUserField = ({ onSave, fieldErrors, editMode, setEditMode }) => {
    const [deletePassword, setDeletePassword] = useState("");
    const [openDialogBox, setOpenDialogBox] = useState(false);
    
    // Reset form when edit mode changes
    useEffect(() => {
        if (editMode !== 'delete') {
            setDeletePassword("");
            setOpenDialogBox(false);
        }
    }, [editMode]);

    const handleSave = () => {
        if (!deletePassword) {
            return;
        }
        onSave("deleteUser", deletePassword);
            setOpenDialogBox(false);
    };

    const handleCancel = () => {
        setDeletePassword("");
        setEditMode('');
    };

    return (
        <>
        <div className="mb-6 p-4 rounded-lg border border-blue-700/30 bg-slate-800/50 backdrop-blur-sm shadow-sm">
            
            {editMode !== 'delete' && (
            <div className="flex items-center justify-between w-full">
                <button
                    onClick={() => setEditMode('delete')}
                    className="w-full p-3 bg-slate-700/80 hover:bg-red-900/50 text-red-300 rounded-lg transition duration-200 flex items-center justify-center gap-2 border border-red-500/30"
                    aria-label="Delete account"
                    >
                    <DeleteIcon /> Permanently delete your account
                </button>
            </div>
            )}
            
            {editMode === 'delete' && (
            <div className="flex flex-col w-full">
                <div className="w-full mb-4">
                <p className="text-sm text-blue-300/70 mb-4">
                    To confirm deletion, please enter your password.
                </p>
                <label className="block text-sm font-medium text-blue-300 mb-2">
                    Confirm Password
                </label>
                <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => {
                    setDeletePassword(e.target.value);
                    }}
                    className={`w-full px-4 py-2 bg-slate-700/80 text-white border border-blue-600/30'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/70`}
                    autoFocus
                />
                </div>
                
                <div className="flex justify-end gap-2">
                <button
                    onClick={() => setOpenDialogBox(true)}
                    disabled={!deletePassword}
                    className={`flex-1 p-2 justify-center ${!deletePassword ? 'bg-red-900/30 cursor-not-allowed' : 'bg-red-900/50 hover:bg-red-800'} text-red-300 rounded-lg transition duration-200 flex items-center border border-red-500/30`}
                    aria-label="Confirm delete"
                >
                    <DeleteIcon className="mr-1" /> Delete Account
                </button>
                
                <button
                    onClick={handleCancel}
                    className="p-2 bg-slate-700/80 hover:bg-slate-600/80 text-white rounded-lg transition duration-200 flex items-center"
                    aria-label="Cancel deletion"
                >
                    <CloseIcon className="mr-1" /> Cancel
                </button>
                </div>
            </div>
            )}

            {(editMode === 'delete' && fieldErrors) && (
                <div className="mt-4 w-full rounded-lg border border-red-400 bg-red-900/30 px-4 py-3 text-sm text-red-300 shadow-sm">
                    {fieldErrors}
                </div>
            )}
        </div>
        <DialogBox
            isOpen={openDialogBox}
            title="Do you really want to delete your account?"
            message={"This cannot be undone. If successful, you will be automatically logged out."}
            onCancel={() => {
                setOpenDialogBox(false);
            }}
            onConfirm={handleSave}
            type='input'
        />
        </>
    );
};

export default DeleteUserField;