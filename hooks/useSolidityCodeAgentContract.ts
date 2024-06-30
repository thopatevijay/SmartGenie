import { useState, useCallback, useEffect, useMemo } from "react";
import { ethers } from 'ethers';
import SolidityCodeAgentABI from '../utils/SolidityCodeAgentABI.json';
import { useConnectWallet } from '@web3-onboard/react';

type UseSolidityCodeAgentContract = {
    code: string;
    setCode: (code: string) => void;
    suggestions: string | null;
    loading: boolean;
    error: string | null;
    isErrorModalOpen: boolean;
    handleCloseErrorModal: () => void;
    handleRunAgent: () => void;
    setError: (error: string) => void;
    progressMessage: string;
};

export function useSolidityCodeAgentContract(): UseSolidityCodeAgentContract {
    const [code, setCode] = useState('');
    const [suggestions, setSuggestions] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [{ wallet, connecting }, connect] = useConnectWallet()
    const [ethersProvider, setProvider] = useState<ethers.providers.Web3Provider | null>();
    const [progressMessage, setProgressMessage] = useState<string>('');

    const messages = useMemo(() => [
        'Analyzing your code...',
        'Identifying code improvement suggestions...',
        'Evaluating best coding practices...',
        'Inspecting for potential bugs...',
        'Optimizing gas usage...',
    ], []);

    const handleOpenErrorModal = (message: string) => {
        setError(message);
        setIsErrorModalOpen(true);
    };

    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false);
    };

    useEffect(() => {
        if (wallet?.provider) {
            console.log('Wallet connected:', wallet);
        }
    }, [wallet]);

    useEffect(() => {
        if (wallet?.provider) {
            console.log("wallet", wallet)
            setProvider(new ethers.providers.Web3Provider(wallet.provider, 'any'))
        }
    }, [connect, connecting, wallet])

    const signer = ethersProvider?.getSigner();
    const contractAddress = process.env.NEXT_PUBLIC_SOLIDITY_CODE_AGENT_CONTRACT_ADDRESS ?? '';
    console.log('contractAddress', contractAddress);

    const contract = useMemo(() => {
        if (ethersProvider) {
            return new ethers.Contract(contractAddress, SolidityCodeAgentABI, signer);
        }
    }, [contractAddress, ethersProvider, signer]);

    const runAgent = useCallback(async (query: string, maxIterations: number) => {
        const tx = await contract?.runAgent(query, maxIterations);
        const receipt = await tx.wait();
        const event = receipt.events?.find((event: { event: string; }) => event.event === 'AgentRunCreated');
        return event.args[1].toNumber();
    }, [contract]);

    const getMessageHistoryContents = useCallback(async (agentId: number) => {
        return await contract?.getMessageHistoryContents(agentId);
    }, [contract]);

    const isRunFinished = useCallback(async (runId: number) => {
        return await contract?.isRunFinished(runId);
    }, [contract]);

    const handleRunAgent = useCallback(async () => {
        if (!wallet?.provider) {
            handleOpenErrorModal('Please connect your wallet');
            return;
        }

        const maxIterations = 2;

        const query = `
        Complete and review the following Solidity code as if you are an expert smart contract researcher. 
      Provide suggestions and organize them into sections like:
    
      // Code Suggestions
      ...
    
      // Best Code Practices
      ...

      // Common Bugs detected
      ...
    
      // Gas Optimization Suggestions
      ...
    
      Then provide the reviewed code with the recommended changes without wrapping the code in triple backticks or any markdown formatting.
    
      Solidity code:
        ${code}
    `
        if (!code) {
            handleOpenErrorModal('Please enter some code.');
            return;
        }

        setLoading(true);
        setError(null);

        console.log('Running agent...');
        try {
            const runId = await runAgent(query, maxIterations);
            console.log('Agent run started:');
            console.log('Run ID:', runId);

            let finished = false;
            let messageIndex = 0;

            while (!finished) {
                if (messageIndex < messages.length) {
                    setProgressMessage(messages[messageIndex]);
                    messageIndex++;
                }
                finished = await isRunFinished(runId);
                console.log('Run finished:', finished);
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
            const messageHistoryContents = await getMessageHistoryContents(runId);
            console.log('Message history contents:', messageHistoryContents);
            setSuggestions(messageHistoryContents[2]);
        } catch (error) {
            console.error('Error running agent:', error);
            handleOpenErrorModal('Error fetching suggestions');
        } finally {
            console.log('Agent run complete');
            setLoading(false);
            setProgressMessage('');
        }

    }, [code, getMessageHistoryContents, isRunFinished, messages, runAgent, wallet?.provider]);


    return {
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
    };
}