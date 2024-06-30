import { useEffect, useState } from 'react';
import Head from 'next/head';
import { AIAgentTab, CodeReviewTab } from '@/components';
import { useConnectWallet } from '@web3-onboard/react';
import { WalletState } from "@web3-onboard/core/dist/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState('Code Review');
  const [{ wallet, connecting }, connect] = useConnectWallet()
  const [wallets, setWallets] = useState<WalletState>();

  useEffect(() => {
    if (wallet?.provider) {
      console.log('Wallet connected:', wallet);
      setWallets(wallet);
    }
  }, [wallet]);

  const handleConnectClick = async () => {
    try {
      const walletStates = await connect();
      console.log('Connected wallets:', walletStates);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };
  const walletAddress = wallets?.accounts[0].address;

  const truncateString = (str: string, length: number): string => {
    return str.length > length ? `${str.slice(0, length / 2)}...${str.slice(-length / 2)}` : str;
  };

  const truncatedAddress = truncateString(walletAddress ?? '', 10);

  return (
    <div className="min-h-screen bg-darkbg text-neon font-mono flex flex-col">
      <Head>
        <title>SmartGenie</title>
      </Head>
      <header className="flex justify-between items-center py-4 border-b border-neon">
        <h1 className="text-2xl flex-1 text-center">SmartGenie</h1>
        <button className="bg-neon text-darkbg border border-neon px-4 py-2 rounded-lg hover:bg-darkfg hover:text-neon transition duration-300 ease-in-out"
          disabled={!!connecting || !!wallet?.provider}
          onClick={handleConnectClick}
        >
          {walletAddress ? truncatedAddress : "Connect Wallet"}
        </button>
      </header>

      <main className="flex-1 flex flex-col p-4">
        <div className="flex mb-4 border-b border-neon">
          <button
            onClick={() => setActiveTab('Code Review')}
            className={`px-4 py-2 focus:outline-none border-r border-neon ${activeTab === 'Code Review' ? 'bg-darkfg' : ''
              }`}
          >
            Get Code Review
          </button>
          {/* <button
            onClick={() => setActiveTab('AI Agent')}
            className={`px-4 py-2 focus:outline-none ${activeTab === 'AI Agent' ? 'bg-darkfg' : ''
              }`}
          >
            Create AI Agent
          </button> */}
        </div>

        {activeTab === 'Code Review' ? (
          <CodeReviewTab />
        ) : (
          <AIAgentTab />
        )}
      </main>
    </div>
  );
}
