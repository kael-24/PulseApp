import { useState } from "react";
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

const EditNameField = ({ userName, onSave, fieldErrors, isSuccess }) => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(userName);

  const handleSave = () => {
    onSave("name", name);
    return;
  };

  const handleCancel = () => {
    setName(userName);
    setEditMode(false);
    return;
  };

  return (
    <div className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Name
      </label>

      {!editMode && (
        <div className="flex items-center justify-between w-full">
          <span className="block text-lg text-gray-800 px-4 py-2 flex-grow">
            {name}
          </span>
          <button
            onClick={() => setEditMode(true)}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200"
            aria-label="Edit field"
          >
            <EditIcon />
          </button>
        </div>
      )}

      {editMode && (
        <div className="flex flex-col w-full">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200 flex items-center"
              aria-label="Save changes"
            >
              <CheckIcon className="mr-1" /> Save
            </button>

            <button
              onClick={handleCancel}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 flex items-center"
              aria-label="Cancel changes"
            >
              <CloseIcon className="mr-1" /> Cancel
            </button>
          </div>
        </div>
      )}

      {editMode && fieldErrors && !isSuccess && (
        <div className="mt-4 w-full rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700 shadow-sm">
          {fieldErrors}
        </div>
      )}

      {editMode && isSuccess && (
        <div className="mt-4 w-full rounded-lg border border-green-400 bg-green-100 px-4 py-3 text-sm text-green-700 shadow-sm">
          Your changes have been saved successfully!
        </div>
      )}
    </div>
  );
};

const EditPasswordField = ({ onSave, fieldErrors, isSuccess }) => {
  const [editMode, setEditMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  const handleSave = () => {
    onSave("password", { currentPassword, newPassword, retypePassword });
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setRetypePassword("");
    setEditMode(false);
  };

  return (
    <div className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Password
      </label>

      {!editMode && (
        <div className="flex items-center justify-between w-full">
          <span className="block text-lg text-gray-800 px-4 py-2 flex-grow">
            ••••••••
          </span>
          <button
            onClick={() => setEditMode(true)}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200"
            aria-label="Edit field"
          >
            <EditIcon />
          </button>
        </div>
      )}

      {editMode && (
        <div className="flex flex-col w-full">
          <div className="w-full mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="w-full mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="w-full mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200 flex items-center"
              aria-label="Save changes"
            >
              <CheckIcon className="mr-1" /> Save
            </button>

            <button
              onClick={handleCancel}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 flex items-center"
              aria-label="Cancel changes"
            >
              <CloseIcon className="mr-1" /> Cancel
            </button>
          </div>
        </div>
      )}
      
      {editMode && fieldErrors && !isSuccess && (
        <div className="mt-4 w-full rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700 shadow-sm">
          {fieldErrors}
        </div>
      )}
      
      {editMode && isSuccess && (
        <div className="mt-4 w-full rounded-lg border border-green-400 bg-green-100 px-4 py-3 text-sm text-green-700 shadow-sm">
          Your changes have been saved successfully!
        </div>
      )}
    </div>
  );
};

const DeleteUserField = ({ onSave, fieldErrors }) => {
  const [editMode, setEditMode] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [openDialogBox, setOpenDialogBox] = useState(false);

  const handleSave = () => {
    onSave("deleteUser", deletePassword);
    setOpenDialogBox(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    setDeletePassword("");
  };

  return (
    <div className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
      
      {!editMode && (
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => setEditMode(true)}
            className="w-full p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 flex items-center justify-center gap-2"
            aria-label="Delete account"
          >
            <DeleteIcon /> Permanently delete your account
          </button>
        </div>
      )}
      
      {editMode && (
        <div className="flex flex-col w-full">
          <div className="w-full mb-4">
            <p className="text-sm text-gray-600 mb-4">
              To confirm deletion, please enter your password.
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setOpenDialogBox(true)}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 flex items-center"
              aria-label="Confirm delete"
            >
              <DeleteIcon className="mr-1" /> Delete Account
            </button>
            
            <button
              onClick={handleCancel}
              className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition duration-200 flex items-center"
              aria-label="Cancel deletion"
            >
              <CloseIcon className="mr-1" /> Cancel
            </button>
          </div>
        </div>
      )}

      {(editMode && fieldErrors) && (
        <div className="mt-4 w-full rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700 shadow-sm">
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

const EditUser = () => {
  const { user } = useAuthContext();
  const {
    editUserDetails,
    nameError,
    passwordError,
    isLoading,
    nameSuccess,
    passwordSuccess,
  } = useEditUser();
  const { deleteUser, deleteError } = useDeleteUser();

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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        {/* HEADER SECTION */}
        <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
        <Link
          to="/"
          className="flex items-center text-blue-600 hover:text-blue-800"
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
            fieldErrors={nameError}
            isSuccess={nameSuccess}
          />
          <EditPasswordField
            onSave={handleFieldAction}
            fieldErrors={passwordError}
            isSuccess={passwordSuccess}
          />
          <DeleteUserField 
            onSave={handleFieldAction}
            fieldErrors={deleteError}
          />
        </>
      )}
    </div>
  );
};

export default EditUser;
