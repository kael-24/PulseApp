import { useState } from "react";


const DialogBox = ({ isOpen, title, message, onCancel, onDontSave, onConfirm, type }) => {
    const [inputValue, setInputValue] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (type === 'handleDeepworkSession') {
            onConfirm(inputValue);
        } else {
            onConfirm();
        }
    }

    return (
        <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
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
        <div className="relative z-10 w-full max-w-md p-8 mx-auto bg-gradient-to-br from-gray-900 via-blue-950 to-slate-900 border border-blue-700/30 rounded-2xl shadow-2xl backdrop-blur-md transform translate-y-0">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{title}</h2>
            <p className="text-blue-100/90 mb-6">{message}</p>

            {type === 'handleDeepworkSession' && (
                <input
                className="w-full px-4 py-3 mb-6 bg-slate-700/80 text-white border border-blue-600/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/70 transition"
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value..."
                autoFocus
                />   
            )}

            <div className="flex justify-end space-x-3">
                <button
                    onClick={onCancel}
                    className="px-5 py-2 bg-slate-700 text-blue-300 rounded-xl hover:bg-slate-600 transition-colors font-medium"
                >
                    Back
                </button>
                {type === 'handleDeepworkSession' && (
                    <button 
                        className="px-5 py-2 bg-slate-700/80 text-red-400 rounded-xl hover:bg-slate-600 transition-colors font-medium"
                        onClick={onDontSave}
                    >
                        Don't Save
                    </button>
                )}
                {type !== 'inform' && (
                    <button
                        onClick={handleConfirm}
                        className="px-5 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-medium hover:from-blue-500 hover:to-teal-400 transition shadow-lg"
                    >
                        Confirm
                    </button>
                )}
            </div>
        </div>
        </div>
    );
};

export default DialogBox;
