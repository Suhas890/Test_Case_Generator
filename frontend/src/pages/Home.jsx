import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Test Case Generator</h1>
      <p className="mb-8">Generate test cases for LeetCode problems easily.</p>
      <Link to="/generator" className="px-4 py-2 bg-blue-500 text-white rounded">Get Started</Link>
    </div>
  );
}

export default Home;