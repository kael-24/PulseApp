

const ConfirmDialogBox = ({ isOpen, title, message, onConfirm, onCancel }) => {
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

            <div className="flex justify-end space-x-3">
            <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
                Confirm
            </button>
            </div>
        </div>
        </div>
    );
};

export default ConfirmDialogBox;
