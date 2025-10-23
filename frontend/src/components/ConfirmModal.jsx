export default function ConfirmModal({ isOpen, title, message, confirmText, cancelText, onConfirm, onCancel, type = 'danger' }) {
    if (!isOpen) return null;

    const typeStyles = {
        danger: {
            button: 'bg-red-600 hover:bg-red-700',
            icon: 'text-red-600',
            bg: 'bg-red-50'
        },
        warning: {
            button: 'bg-yellow-600 hover:bg-yellow-700',
            icon: 'text-yellow-600',
            bg: 'bg-yellow-50'
        },
        info: {
            button: 'bg-blue-600 hover:bg-blue-700',
            icon: 'text-blue-600',
            bg: 'bg-blue-50'
        }
    };

    const styles = typeStyles[type];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="p-6">
                    {/* Icon */}
                    <div className={`${styles.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                        {type === 'danger' && (
                            <svg className={`w-8 h-8 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                        {type === 'warning' && (
                            <svg className={`w-8 h-8 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                        {type === 'info' && (
                            <svg className={`w-8 h-8 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-gray-600 text-center mb-6">
                        {message}
                    </p>

                    {/* Actions */}
                    <div className="flex space-x-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition duration-200 font-semibold"
                        >
                            {cancelText || 'Cancel'}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 text-white py-3 rounded-lg transition duration-200 font-semibold ${styles.button}`}
                        >
                            {confirmText || 'Confirm'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}