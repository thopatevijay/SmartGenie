import React, { useState } from 'react';
import { SolidityEditor } from '../SolidityEditor';
import { ErrorModal } from '../ErrorModal';
import { CodeDiffModal } from '../CodeDiffModal';
import { useSolidityCodeAgentContract } from '@/hooks';
import { codeImprovementEditorDefaultValue, codeReviewEditorDefaultValue } from '../../utils/editorDefaultValues';
import { useConnectWallet } from '@web3-onboard/react';
import { FaExpand } from 'react-icons/fa';
import { FullScreenModal } from '../FullScreenModal';

interface CodeReviewTabProps {
}

export const CodeReviewTab: React.FC<CodeReviewTabProps> = () => {
    const [{ wallet }] = useConnectWallet();
    const [isFullScreenModalOpen, setIsFullScreenModalOpen] = useState(false);
    const [isCodeReviewInFullScreen, setIsCodeReviewInFullScreen] = useState<boolean>();
    const [fullScreenContent, setFullScreenContent] = useState<string | null>('');

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
        handleOpenErrorModal,
    } = useSolidityCodeAgentContract();

    const handleCodeChange = (value: any) => {
        setError('');
        setCode(value);
    };

    const handleOutputCodeChange = (value: any) => {
        setError('');
        setSuggestions(value);
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
        if (!wallet?.provider) {
            handleOpenErrorModal('Please connect your wallet');
            return;
        }
        const instructions = extractGenieInstructions(suggestions);

        if (instructions.length === 0) {
            handleOpenErrorModal('No @Genie instructions found in the code. Tag @Genie with your wishes, and watch the magic happen!');
            return;
        }

        const instructionText = instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n');

        handleRunAgent(instructionText, true);

    }

    const handleOpenFullScreenModal = (content: string, isCodeReviewInFullScreen: boolean) => {
        setIsCodeReviewInFullScreen(isCodeReviewInFullScreen);
        setFullScreenContent(content);
        setIsFullScreenModalOpen(true);
    }

    const handleCloseFullScreenModal = () => {
        setIsFullScreenModalOpen(false);
        setFullScreenContent(null);

    };

    return (
        <div className="flex-1 flex space-x-4">
            {/* Input Section */}
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl">Input</h2>
                    <div className="flex items-center space-x-2">
                        <button
                            className="px-4 py-2 bg-darkfg text-neon border border-neon"
                            disabled={loading}
                            onClick={() => handleRunAgent(code, false)}
                        >
                            {loading ? 'Loading...' : 'Review My Code'}
                        </button>
                        <button
                            className="p-2 bg-darkfg text-neon border border-neon"
                            onClick={() => handleOpenFullScreenModal(code, true)}
                        >
                            <FaExpand />
                        </button>
                    </div>
                </div>
                <div className="flex-1 p-2 bg-darkfg text-neon border border-neon focus:outline-none">
                    <SolidityEditor
                        code={code}
                        onChange={handleCodeChange}
                        defaultValue={codeReviewEditorDefaultValue}
                    />
                </div>
            </div>

            {/* Output Section */}
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl">Output</h2>
                    <div className="flex items-center space-x-2">
                        <button
                            className="px-4 py-2 bg-darkfg text-neon border border-neon"
                            onClick={handleImprovement}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Improve my code'}
                        </button>
                        <button
                            className="p-2 bg-darkfg text-neon border border-neon"
                            onClick={() => handleOpenFullScreenModal(suggestions ?? '', false)}
                        >
                            <FaExpand />
                        </button>
                    </div>
                </div>
                <div className="flex-1 p-2 bg-darkfg text-neon border border-neon focus:outline-none">
                    <SolidityEditor
                        code={loading ? progressMessage : suggestions ?? ''}
                        onChange={handleOutputCodeChange}
                        defaultValue={codeImprovementEditorDefaultValue}
                    />
                </div>
            </div>
            <ErrorModal isModalOpen={isErrorModalOpen} handleCloseModal={handleCloseErrorModal} errorMessage={error} />
            <CodeDiffModal isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} />
            <FullScreenModal
                isOpen={isFullScreenModalOpen}
                onClose={handleCloseFullScreenModal}
                code={fullScreenContent ?? ''}
                onChange={isCodeReviewInFullScreen ? handleCodeChange : handleOutputCodeChange}
                defaultValue={isCodeReviewInFullScreen ? codeReviewEditorDefaultValue : codeImprovementEditorDefaultValue}
            />
        </div>
    );
};
