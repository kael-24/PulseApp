import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import useEditUser from "../hooks/useEditUser";
import useDeleteUser from "../hooks/useDeleteUser";
import DialogBox from "../components/DialogBox";

// icons
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";

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
          
          {name.trim().length < 2 && (
            <p className="text-red-300 text-sm mt-2">Name must be at least 2 characters</p>
          )}
        </div>
      )}
    </div>
  );
};

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
  const isSaveDisabled = !currentPassword || !newPassword || !retypePassword || 
                        Object.keys(passwordErrors).length > 0;

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

const DeleteUserField = ({ onSave, fieldErrors, editMode, setEditMode }) => {
  const [deletePassword, setDeletePassword] = useState("");
  const [openDialogBox, setOpenDialogBox] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Reset form when edit mode changes
  useEffect(() => {
    if (editMode !== 'delete') {
      setDeletePassword("");
      setOpenDialogBox(false);
      setPasswordError("");
    }
  }, [editMode]);

  const handleSave = () => {
    if (!deletePassword) {
      setPasswordError("Password is required to delete account");
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
                setPasswordError(""); // Clear error when user types
              }}
              className={`w-full px-4 py-2 bg-slate-700/80 text-white border ${passwordError ? 'border-red-500' : 'border-blue-600/30'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/70`}
              autoFocus
            />
            {passwordError && (
              <p className="text-red-300 text-sm mt-1">{passwordError}</p>
            )}
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

      <DialogBox
        isOpen={openDialogBox}
        title="Do you really want to delete your account?"
        message={
          "This cannot be undone. If successful, you will be automatically logged out."
        }
        onConfirm={handleSave}
        onCancel={() => {
          setOpenDialogBox(false);
        }}
      />
    </div>
  );
};

const ProfileSettings = () => {
  const { user } = useAuthContext();
  const { editUserDetails, error, isLoading, isSuccess } = useEditUser();
  const { deleteUser, deleteError } = useDeleteUser();
  const [activeEditMode, setActiveEditMode] = useState('');

  // Reset active edit mode when an update is successful
  useEffect(() => {
    if (isSuccess) {
      setActiveEditMode('');
    }
  }, [isSuccess]);

  const handleFieldAction = async (field, editValue) => {
    // Create updates object directly with the new value
    const updates = {};

    // Add the specific field being edited
    if (field === "name") {
      updates.name = editValue;
    } else if (field === "password") {
      const { currentPassword, newPassword, retypePassword } = editValue;
      updates.currentPassword = currentPassword;
      updates.newPassword = newPassword;
      updates.retypePassword = retypePassword;
    } else if (field === "deleteUser") {
      await deleteUser(user.email, editValue);
      return;
    }

    // Make API call directly with the new value
    if (Object.keys(updates).length > 0) {
      await editUserDetails(user.email, updates);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-blue-700/30">
        <div className="flex justify-between items-center mb-6">
          {/* HEADER SECTION */}
          <h2 className="text-2xl font-bold text-blue-300">Profile Settings</h2>
          <Link
            to="/"
            className="flex items-center text-blue-400 hover:text-teal-300 transition-colors"
          >
            <ArrowBackIcon fontSize="small" />
            <span className="ml-1">Back</span>
          </Link>
        </div>

        {/* Form content with loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* EDITABLE FIELDS */}
            <EditNameField
              userName={user?.name || ""}
              onSave={handleFieldAction}
              editMode={activeEditMode}
              setEditMode={setActiveEditMode}
            />
            <EditPasswordField
              onSave={handleFieldAction}
              editMode={activeEditMode}
              setEditMode={setActiveEditMode}
            />
            <DeleteUserField 
              onSave={handleFieldAction}
              fieldErrors={deleteError}
              editMode={activeEditMode}
              setEditMode={setActiveEditMode}
            />
          </>
        )}

        {error && (
          <div className="mt-4 w-full rounded-lg border border-red-400 bg-red-900/30 px-4 py-3 text-sm text-red-300 shadow-sm">
            {error}
          </div>
        )}
        
        {isSuccess && (
          <div className="mt-4 w-full rounded-lg border border-teal-500/30 bg-teal-900/30 px-4 py-3 text-sm text-teal-300 shadow-sm">
            Your changes have been saved successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
