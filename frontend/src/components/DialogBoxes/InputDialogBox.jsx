import { useState } from "react";

const InputDialogBox = ({ isOpen, title, message, onCancel, onDontSave, onSave }) => {
    const [inputValue, setInputValue] = useState('');


    if (!isOpen) return null;

    return (
        <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
        role="dialog"
        aria-modal="true"
        tabIndex="-1"
        >
        {/* Backdrop */}
        <div
            className="absolute inset-0"
            onClick={onCancel}
            aria-hidden="true"
        ></div>

        {/* Dialog Box */}
        <div className="relative z-10 w-full max-w-md p-6 mx-4 bg-white border border-gray-200 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
            <p className="text-gray-600 mb-6">{message}</p>

            <input
                className=""
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />    

            <div className="flex justify-end space-x-3">
            <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
                Cancel
            </button>
            <button
                onClick={onDontSave}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
                Dont Save
            </button>
            <button
                onClick={() => onSave(inputValue)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
                Save
            </button>
            </div>
        </div>
        </div>
    );
};

export default InputDialogBox;
