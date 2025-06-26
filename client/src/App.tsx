import { useEffect, useState } from 'react';

interface ApiResponse {
  message: string;
  timestamp: string;
  environment: string;
}

function App() {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Using relative path - Vite proxy will forward to localhost:3001
    fetch('/api/test')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: ApiResponse) => {
        setApiData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 Ordish - Full Stack App</h1>
      
      {apiData && (
        <div style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '15px', 
          borderRadius: '5px',
          marginTop: '20px'
        }}>
          <h2>API Response:</h2>
          <p><strong>Message:</strong> {apiData.message}</p>
          <p><strong>Environment:</strong> {apiData.environment}</p>
          <p><strong>Timestamp:</strong> {new Date(apiData.timestamp).toLocaleString()}</p>
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <h3>🎯 Development Setup Complete!</h3>
        <ul>
          <li>✅ React Frontend (Vite + TypeScript)</li>
          <li>✅ Express Backend (TypeScript + ES Modules)</li>
          <li>✅ API Proxy Configuration</li>
          <li>✅ Production Build Support</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
