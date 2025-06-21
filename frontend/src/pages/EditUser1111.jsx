import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import useEditUser from "../hooks/useEditUser";
import { Link } from "react-router-dom";

// Icons
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * Component for editable input field with edit/save/cancel controls
 */
const EditableField = ({ 
  label, 
  type = "text",
  value,
  onSave,
  onCancel,
  editMode,
  children
}) => {
  const [localValue, setLocalValue] = useState(value);
  
  // Handle local input change
  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };
  
  // Reset local value when cancelling
  const handleCancel = () => {
    setLocalValue(value);
    onCancel();
  };
  
  // Pass the updated value to parent when saving
  const handleSave = () => {
    onSave(localValue);
  };

  return (
    <div className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="flex items-center space-x-3">
        <div className="flex-grow">
          {editMode ? (
            <div className="space-y-2">
              <input
                type={type}
                value={localValue}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {children}
            </div>
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
                onClick={handleSave}
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
              onClick={() => onSave(null)}  // Trigger edit mode
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200"
              aria-label="Edit field"
            >
              <EditIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * EditUser page component for editing user profile
 */
const EditUser = () => {
  const { user } = useAuthContext();
  const { editUserDetails, error, isLoading, success } = useEditUser();
  
  // Track which field is being edited
  const [activeField, setActiveField] = useState(null);
  
  // Form field values
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    retypePassword: ""
  });
  
  /**
   * Handle field edit actions
   * @param {string} field - The field being edited
   * @param {string} value - The new value (or null to toggle edit mode)
   */
  const handleFieldAction = (field, value) => {
    // If value is null, toggle edit mode
    if (value === null) {
      setActiveField(field === activeField ? null : field);
      return;
    }
    
    // Otherwise update the value and exit edit mode
    setFormData(prev => ({ ...prev, [field]: value }));
    setActiveField(null);
  };
  
  /**
   * Submit the form to update user details
   */
  const handleSubmit = async () => {
    // Only include fields that changed
    const updates = {};
    
    if (formData.name !== user.name) updates.name = formData.name;
    if (formData.email !== user.email) updates.newEmail = formData.email;
    if (formData.currentPassword) {
      updates.currentPassword = formData.currentPassword;
      updates.newPassword = formData.newPassword;
      updates.retypePassword = formData.retypePassword;
    }
    
    await editUserDetails(user.email, updates);
    
    // Clear password fields after submission
    setFormData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      retypePassword: ""
    }));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowBackIcon fontSize="small" />
          <span className="ml-1">Back</span>
        </Link>
      </div>
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
          Your profile has been updated successfully!
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}
      
      <EditableField
        label="Name"
        value={formData.name}
        editMode={activeField === "name"}
        onSave={(value) => handleFieldAction("name", value)}
        onCancel={() => setActiveField(null)}
      />
      
      <EditableField
        label="Email"
        type="email"
        value={formData.email}
        editMode={activeField === "email"}
        onSave={(value) => handleFieldAction("email", value)}
        onCancel={() => setActiveField(null)}
      />
      
      <EditableField
        label="Password"
        type="password"
        value={formData.currentPassword}
        editMode={activeField === "password"}
        onSave={(value) => handleFieldAction("password", value)}
        onCancel={() => {
          setActiveField(null);
          setFormData(prev => ({
            ...prev,
            currentPassword: "",
            newPassword: "",
            retypePassword: ""
          }));
        }}
      >
        {activeField === "password" && (
          <>
            <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={formData.retypePassword}
              onChange={(e) => setFormData(prev => ({ ...prev, retypePassword: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </>
        )}
      </EditableField>
      
      <button
        onClick={handleSubmit}
        disabled={isLoading || !activeField}
        className={`w-full py-2 px-4 rounded-lg text-white font-medium transition duration-200 ${
          !activeField ? "bg-gray-400 cursor-not-allowed" 
                        : isLoading ? "bg-blue-400 cursor-wait" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default EditUser;