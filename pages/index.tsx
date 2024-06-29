import { useState } from 'react';
import Head from 'next/head';
import { AIAgentTab, CodeReviewTab } from '@/components';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Code Review');
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
          <CodeReviewTab />
        ) : (
          <AIAgentTab />
        )}
      </main>
    </div>
  );
}
