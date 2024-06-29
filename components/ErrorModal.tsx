import React from 'react';

interface ErrorModalProps {
    isModalOpen: boolean;
    handleCloseModal: () => void;
    errorMessage: string | null;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ isModalOpen, handleCloseModal, errorMessage }) => {
    return (
        <>
            {isModalOpen && (
                <div
                    className={`fixed inset-0 bg-darkbg bg-opacity-80 flex items-center justify-center transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <div
                        className={`bg-red-700 border border-red-500 p-4 rounded-lg transition-transform transform ${isModalOpen ? 'scale-100' : 'scale-90'
                            }`}
                    >
                        <h2 className="text-xl mb-4 text-red-300">Error</h2>
                        <p className="mb-4 text-red-100">{errorMessage}</p>
                        <button
                            onClick={handleCloseModal}
                            className="px-4 py-2 bg-red-800 text-red-100 border border-red-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
