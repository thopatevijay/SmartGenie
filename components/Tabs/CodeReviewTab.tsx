import React, { useState } from 'react';
import { SolidityEditor } from '../SolidityEditor';
import { ErrorModal } from '../ErrorModal';
import { CodeDiffModal } from '../CodeDiffModal';
import { useSolidityCodeAgentContract } from '@/hooks';

interface CodeReviewTabProps {
}

export const CodeReviewTab: React.FC<CodeReviewTabProps> = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        code,
        setCode,
        suggestions,
        loading,
        error,
        isErrorModalOpen,
        handleCloseErrorModal,
        handleRunAgent,
        setError,
    } = useSolidityCodeAgentContract();

    const handleCodeChange = (value: any) => {
        setError('');
        setCode(value);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    return (
        <div className="flex-1 flex space-x-4">
            {/* Input Section */}
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl">Input</h2>
                    <button className="px-4 py-2 bg-darkfg text-neon border border-neon"
                        disabled={loading}
                        onClick={handleRunAgent}
                    >
                        {loading ? 'Loading...' : 'Review My Code'}
                    </button>
                </div>
                <div
                    className="flex-1 p-2 bg-darkfg text-neon border border-neon focus:outline-none"
                >
                    <SolidityEditor code={code} onChange={handleCodeChange} />
                </div>
            </div>

            {/* Output Section */}
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl">Output</h2>
                    <div>
                        <button
                            onClick={handleOpenModal}
                            className="px-4 py-2 bg-darkfg text-neon border border-neon mr-2"
                        >
                            See Code Diff
                        </button>
                        <button className="px-4 py-2 bg-darkfg text-neon border border-neon"

                        >Improve my code</button>
                    </div>
                </div>
                <div
                    className="flex-1 p-2 bg-darkfg text-neon border border-neon focus:outline-none"
                >
                    <SolidityEditor code={loading ? "Reviewing your code, hold tight ..." : suggestions ?? ''} />
                </div>
            </div>
            <ErrorModal isModalOpen={isErrorModalOpen} handleCloseModal={handleCloseErrorModal} errorMessage={error} />
            <CodeDiffModal isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} />
        </div>
    );
};
