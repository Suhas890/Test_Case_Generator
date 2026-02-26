import { useEffect, useState } from 'react';
import axios from 'axios';

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get('/api/history').then(res => setHistory(res.data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">History</h1>
      <ul className="space-y-4">
        {history.map(item => (
          <li key={item._id} className="p-4 border rounded">
            <h2 className="font-bold">{item.problemTitle}</h2>
            <p>{item.problemLink}</p>
            <p>Created: {new Date(item.createdAt).toLocaleString()}</p>
            <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(item.testCases, null, 2).slice(0, 200)}...</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;