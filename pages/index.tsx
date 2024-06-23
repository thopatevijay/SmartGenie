import { CodeBlock } from '@/components/CodeBlock';
import Head from 'next/head';
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [code, setCode] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>('');

  const handleCodeChange = (value: any) => {
    setError('');
    setCode(value);
  };

  const isValidSolidityCode = (code: string) => {
    const solidityPattern = /pragma solidity \^\d+\.\d+\.\d+;|contract\s+\w+\s*{|function\s+\w+\s*\(.*\)\s*(public|private|internal|external)?/;
    return solidityPattern.test(code);
  };


  const fetchSuggestions = async () => {
    if (!code) {
      setError('Please enter some code.');
      return;
    }

    if (!isValidSolidityCode(code)) {
      setError('Please enter valid Solidity code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/getCodeSuggestions', { code });
      setSuggestions(response.data);
    } catch (error) {
      setError('Error fetching suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Solidity Code Co-pilots</title>
        <meta
          name="description"
          content="Use AI to Complete and review the solidity code"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full min-h-screen flex-col items-center bg-[#0E1117] px-4 pb-20 text-neutral-200 sm:px-10">
        <div className="mt-10 flex flex-col items-center justify-center sm:mt-20">
          <div className="text-4xl font-bold">Solidity Co-Pilots</div>
        </div>

        <div className="mt-2 flex items-center space-x-2">
          <button
            className="w-[240px] cursor-pointer rounded-md bg-violet-500 px-4 py-2 font-bold hover:bg-violet-600 active:bg-violet-700"
            onClick={fetchSuggestions}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get Code Suggestions'}
          </button>
        </div>

        <div className="mt-2 text-center text-xs">
          {loading
            ? ''
            : 'Enter solidity code and click "Get Code Suggestions"'}
        </div>

        {error && (
          <div className="mt-2 text-center text-xs text-red-600 bg-yellow-100 font-bold p-2 rounded">
            {error}
          </div>
        )}

        <div className="mt-6 flex w-full max-w-[1200px] flex-col justify-between sm:flex-row sm:space-x-4">
          <div className="h-100 flex flex-col justify-center space-y-2 sm:w-2/4">
            <div className="text-center text-xl font-bold">Input</div>
            <div className="code-container">
              <CodeBlock
                code={code}
                editable={!loading}
                onChange={(value: any) => {
                  handleCodeChange(value);
                }}
              />
            </div>
          </div>
          <div className="mt-8 flex h-full flex-col justify-center space-y-2 sm:mt-0 sm:w-2/4">
            <div className="text-center text-xl font-bold">Output</div>
            <div className="code-container">
              <CodeBlock code={loading ? "Reviewing your code, hold tight ..." : suggestions?.answer} />
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-white-700">
          This chatbot assists Solidity developers by providing code completions and review suggestions. It enhances productivity by suggesting code snippets, identifying potential errors, and offering best practices for writing secure and efficient Solidity contracts.
        </div>
      </div>
    </>
  );
}
