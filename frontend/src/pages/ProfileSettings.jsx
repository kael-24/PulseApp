import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import useEditUser from "../hooks/useEditUser";
import useDeleteUser from "../hooks/useDeleteUser";
import EditNameField from "../components/ProfileSettings/editNameField";
import EditPasswordField from "../components/ProfileSettings/editPasswordField";
import DeleteUserField from "../components/ProfileSettings/deleteUserField";

// icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ProfileSettings = () => {
  const { user } = useAuthContext();
  const { editUserDetails, error, isLoading, isSuccess } = useEditUser();
  const { deleteUser, deleteError } = useDeleteUser();
  const [activeEditMode, setActiveEditMode] = useState("");

  // Reset active edit mode when an update is successful
  useEffect(() => {
    if (isSuccess) {
      setActiveEditMode("");
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
      </div>
    </div>
  );
};

export default ProfileSettings;
