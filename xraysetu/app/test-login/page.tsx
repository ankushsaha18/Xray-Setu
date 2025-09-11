'use client';

import { useState } from 'react';

export default function TestLoginPage() {
  const [username, setUsername] = useState('testuser');
  const [password, setPassword] = useState('testpass123');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTestLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      console.log('Testing login with:', { username, password });
      
      const response = await fetch('http://localhost:8000/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      setResult({
        status: response.status,
        data: data,
        success: response.ok,
      });
    } catch (error) {
      console.error('Login error:', error);
      setResult({
        error: error.message,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Direct Login Test</h1>
        
        <form onSubmit={handleTestLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Login'}
          </button>
        </form>
        
        {result && (
          <div className="mt-6 p-4 rounded-md">
            {result.success ? (
              <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                <h2 className="font-bold">Success!</h2>
                <p>Status: {result.status}</p>
                <pre className="mt-2 text-sm overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                <h2 className="font-bold">Error</h2>
                {result.error ? (
                  <p>{result.error}</p>
                ) : (
                  <>
                    <p>Status: {result.status}</p>
                    <pre className="mt-2 text-sm overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}