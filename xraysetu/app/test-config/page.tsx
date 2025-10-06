'use client';

import { useEffect, useState } from 'react';
import { getApiBaseUrl, isDemoMode } from '@/lib/config';

export default function TestConfigPage() {
  const [config, setConfig] = useState<any>(null);
  const [envVars, setEnvVars] = useState<any>(null);

  useEffect(() => {
    setConfig({
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      apiBaseUrl: getApiBaseUrl(),
      isDemoMode: isDemoMode(),
    });
    
    // Log to console for debugging
    console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    console.log('API Base URL:', getApiBaseUrl());
    console.log('Is Demo Mode:', isDemoMode());
    
    // Also check all env vars that start with NEXT_PUBLIC_
    const publicEnvVars: Record<string, string> = {};
    for (const key in process.env) {
      if (key.startsWith('NEXT_PUBLIC_')) {
        publicEnvVars[key] = process.env[key] as string;
      }
    }
    setEnvVars(publicEnvVars);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Configuration Test</h1>
      
      {config && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <h2 className="text-xl font-bold">Configuration:</h2>
          <pre>{JSON.stringify(config, null, 2)}</pre>
        </div>
      )}
      
      {envVars && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <h2 className="text-xl font-bold">All NEXT_PUBLIC Environment Variables:</h2>
          <pre>{JSON.stringify(envVars, null, 2)}</pre>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Open your browser's developer tools (F12)</li>
          <li>Go to the Console tab</li>
          <li>Navigate to this page: http://localhost:3000/test-config</li>
          <li>Check the console for the logged environment variables</li>
        </ol>
      </div>
    </div>
  );
}