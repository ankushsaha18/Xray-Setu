'use client';

import { useState } from 'react';

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testLogin = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          password: 'testpass'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult({ status: 'success', data });
      } else {
        setError(`API Error: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      setError(`Network Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <button 
        onClick={testLogin}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Login API'}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-900 rounded">
          <h2 className="text-xl font-bold">Error:</h2>
          <pre>{error}</pre>
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-4 bg-green-900 rounded">
          <h2 className="text-xl font-bold">Success:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
