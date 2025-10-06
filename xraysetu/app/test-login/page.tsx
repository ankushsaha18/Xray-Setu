'use client';

import { useState } from 'react';
import { apiRequest } from '@/utils/apiClient';

export default function TestLoginPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApiRequest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('Testing API request...');
      const response = await apiRequest({
        endpoint: '/auth/login/',
        method: 'POST',
        body: {
          username: 'testuser',
          password: 'testpass'
        },
        requiresAuth: false
      });
      
      console.log('API response:', response);
      
      if (response.error) {
        setError(`API Error: ${response.error.message || 'Unknown error'}`);
      } else {
        setResult({ status: 'success', data: response.data });
      }
    } catch (err) {
      console.error('Caught error:', err);
      setError(`Network Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Login API Test Page</h1>
      
      <button 
        onClick={testApiRequest}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Login API via apiRequest'}
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
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Open your browser's developer tools (F12)</li>
          <li>Go to the Console tab</li>
          <li>Click the "Test Login API via apiRequest" button above</li>
          <li>Check the console for any error messages</li>
          <li>The results will also appear in the boxes above</li>
        </ol>
      </div>
    </div>
  );
}