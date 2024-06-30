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
        progressMessage,
        setSuggestions,
    } = useSolidityCodeAgentContract();

    const handleCodeChange = (value: any) => {
        setError('');
        setCode(value);
    };

    const handleOutputCodeChange = (value: any) => {
        setError('');
        setSuggestions(value);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const extractGenieInstructions = (code: string | null): string[] => {
        const regex = /\/\/\s*@Genie\s*:\s*(.*)/g;
        const instructions = [];
        let match;
        if (code) {
            while ((match = regex.exec(code)) !== null) {
                instructions.push(match[1].trim());
            }
        }
        return instructions;
    };

    const handleImprovement = () => {
        const instructions = extractGenieInstructions(suggestions);

        if (instructions.length === 0) {
            console.log('No @Genie instructions found in the code.');
            return;
        }

        const instructionText = instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n');

        handleRunAgent(instructionText, true);

    }
    return (
        <div className="flex-1 flex space-x-4">
            {/* Input Section */}
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl">Input</h2>
                    <button className="px-4 py-2 bg-darkfg text-neon border border-neon"
                        disabled={loading}
                        onClick={() => handleRunAgent(code, false)}
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
                        {/* <button
                            onClick={handleOpenModal}
                            className="px-4 py-2 bg-darkfg text-neon border border-neon mr-2"
                        >
                            See Code Diff
                        </button> */}
                        <button className="px-4 py-2 bg-darkfg text-neon border border-neon"
                            onClick={handleImprovement}

                        >Improve my code</button>
                    </div>
                </div>
                <div
                    className="flex-1 p-2 bg-darkfg text-neon border border-neon focus:outline-none"
                >
                    <SolidityEditor code={loading ? progressMessage : suggestions ?? ''} onChange={handleOutputCodeChange} />
                </div>
            </div>
            <ErrorModal isModalOpen={isErrorModalOpen} handleCloseModal={handleCloseErrorModal} errorMessage={error} />
            <CodeDiffModal isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} />
        </div>
    );
};
