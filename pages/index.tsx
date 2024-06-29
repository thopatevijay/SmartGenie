import { useState } from 'react';
import Head from 'next/head';
import { CodeDiffModal } from '@/components';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Code Review');
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-darkbg text-neon font-mono flex flex-col">
      <Head>
        <title>SmartGenie</title>
      </Head>

      <header className="flex justify-center py-4 border-b border-neon">
        <h1 className="text-2xl">SmartGenie</h1>
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
          <button
            onClick={() => setActiveTab('AI Agent')}
            className={`px-4 py-2 focus:outline-none ${activeTab === 'AI Agent' ? 'bg-darkfg' : ''
              }`}
          >
            Create AI Agent
          </button>
        </div>

        {activeTab === 'Code Review' ? (
          <div className="flex-1 flex space-x-4">
            {/* Input Section */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl">Input</h2>
                <button className="px-4 py-2 bg-darkfg text-neon border border-neon">Review My Code</button>
              </div>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 p-2 bg-darkfg text-neon border border-neon focus:outline-none"
                placeholder="Enter your Solidity code here..."
              ></textarea>
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
              <textarea
                value={outputValue}
                onChange={(e) => setOutputValue(e.target.value)}
                className="flex-1 p-2 bg-darkfg text-neon border border-neon focus:outline-none"
                placeholder="Output will be displayed here..."
              ></textarea>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="text-xl mb-4">AI Agent Tab Content</h2>
            <p>This is where the AI Agent functionality would be displayed.</p>
          </div>
        )}

        {/* Modal */}
        <CodeDiffModal isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} />
      </main>
    </div>
  );
}
