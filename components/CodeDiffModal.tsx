import React from 'react';

interface CodeDiffModalProps {
    isModalOpen: boolean;
    handleCloseModal: () => void;
}

export const CodeDiffModal: React.FC<CodeDiffModalProps> = ({ isModalOpen, handleCloseModal }) => {
    return (
        <>
            {isModalOpen && (
                <div
                    className={`fixed inset-0 bg-darkbg bg-opacity-80 flex items-center justify-center transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <div
                        className={`bg-darkfg border border-neon p-4 rounded-lg transition-transform transform ${isModalOpen ? 'scale-100' : 'scale-90'
                            }`}
                    >
                        <h2 className="text-xl mb-4">Modal Title</h2>
                        <p className="mb-4">This is the modal content.</p>
                        <button
                            onClick={handleCloseModal}
                            className="px-4 py-2 bg-darkbg text-neon border border-neon"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
