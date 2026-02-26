import { useState } from 'react';

function TestCaseOutput({ testCases, format }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const content = format === 'json' ? JSON.stringify(testCases, null, 2) : testCases;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-10 bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Generated Test Cases
        </h2>
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          {copied ? 'Copied!' : 'Copy All'}
        </button>
      </div>

      <pre className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg overflow-auto text-sm text-gray-800 dark:text-gray-200 max-h-96">
        {format === 'json' ? JSON.stringify(testCases, null, 2) : testCases}
      </pre>
    </div>
  );
}

export default TestCaseOutput;