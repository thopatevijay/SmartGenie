import React, { useState } from 'react';
import { SolidityEditor } from '../SolidityEditor';
import axios from 'axios';
import { ErrorModal } from '../ErrorModal';
import { CodeDiffModal } from '../CodeDiffModal';

type Suggestion = {
    answer: string;
};

interface CodeReviewTabProps {
}

export const CodeReviewTab: React.FC<CodeReviewTabProps> = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [code, setCode] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

    const handleOpenErrorModal = (message: string) => {
        setError(message);
        setIsErrorModalOpen(true);
    };

    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false);
    };

    const handleCodeChange = (value: any) => {
        setError('');
        setCode(value);
    };

    const fetchSuggestions = async () => {
        if (!code) {
            handleOpenErrorModal('Please enter some code.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post<Suggestion>('/api/getCodeSuggestions', { code });
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching suggestions', error);
            handleOpenErrorModal('Error fetching suggestions');
        } finally {
            setLoading(false);
        }
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
                        onClick={fetchSuggestions}
                        disabled={loading}>
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
                        <button className="px-4 py-2 bg-darkfg text-neon border border-neon">Improve my code</button>
                    </div>
                </div>
                <div
                    className="flex-1 p-2 bg-darkfg text-neon border border-neon focus:outline-none"
                >
                    <SolidityEditor code={loading ? "Reviewing your code, hold tight ..." : suggestions?.answer ?? ''} />
                </div>
            </div>
            <ErrorModal isModalOpen={isErrorModalOpen} handleCloseModal={handleCloseErrorModal} errorMessage={error} />
            <CodeDiffModal isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} />
        </div>
    );
};
