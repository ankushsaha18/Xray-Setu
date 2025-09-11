'use client';

import { useState, useEffect } from 'react';

export default function TestApiPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get API URL from environment
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log('Testing API connection to:', apiUrl);
      
      // Test OPTIONS request (for CORS preflight)
      const optionsResponse = await fetch(`${apiUrl}/auth/login/`, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3003',
        }
      });
      
      console.log('OPTIONS response:', optionsResponse.status, optionsResponse.statusText);
      
      // Test actual login endpoint
      const loginResponse = await fetch(`${apiUrl}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3003',
        },
        body: JSON.stringify({
          username: 'testuser',
          password: 'testpass123'
        })
      });
      
      console.log('Login response:', loginResponse.status, loginResponse.statusText);
      
      const data = await loginResponse.json();
      console.log('Login response data:', data);
      
      setResult({
        options: {
          status: optionsResponse.status,
          statusText: optionsResponse.statusText
        },
        login: {
          status: loginResponse.status,
          statusText: loginResponse.statusText,
          data: data
        }
      });
    } catch (err) {
      console.error('API test error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">API Connection Test</h1>
        
        <button 
          onClick={testApiConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API Connection'}
        </button>
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
            <h2 className="font-bold">Error:</h2>
            <p>{error}</p>
          </div>
        )}
        
        {result && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
              <h2 className="font-bold">OPTIONS Request:</h2>
              <p>Status: {result.options.status} {result.options.statusText}</p>
            </div>
            
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
              <h2 className="font-bold">Login Request:</h2>
              <p>Status: {result.login.status} {result.login.statusText}</p>
              <pre className="mt-2 text-sm overflow-auto">
                {JSON.stringify(result.login.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}