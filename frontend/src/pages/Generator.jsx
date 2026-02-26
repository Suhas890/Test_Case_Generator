import { useState } from 'react';
import axios from 'axios';
import InputForm from '../components/InputForm';
import ProblemPreview from '../components/ProblemPreview';
import TestCaseOutput from '../components/TestCaseOutput';
import DownloadButton from '../components/DownloadButton';

function Generator() {
  const [formData, setFormData] = useState({
    inputType: 'description',
    input: '',
    numCases: 5,
    difficulty: 'medium',
    language: 'python',
    outputFormat: 'json',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await axios.post('/api/generate-testcases', formData);
      setResult(res.data.testCases);
      setPreview(formData.inputType === 'url' ? formData.input : formData.input.slice(0, 300) + '...');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Check backend logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Generate Test Cases
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-10">
          Create strong, diverse test cases for your coding problems
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          <InputForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
          />

          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {preview && <ProblemPreview content={preview} />}

          {result && (
            <div className="mt-10">
              <TestCaseOutput testCases={result} format={formData.outputFormat} />
              <DownloadButton data={result} format={formData.outputFormat} filename="testcases" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Generator;