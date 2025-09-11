'use client';

import { useEffect, useState } from 'react';
import { isDemoMode, getApiBaseUrl } from '@/lib/config';

export default function TestConfigPage() {
  const [config, setConfig] = useState({
    apiUrl: '',
    demoMode: false,
    frontendUrl: '',
  });

  useEffect(() => {
    const checkConfig = async () => {
      const apiUrl = getApiBaseUrl();
      const demoMode = await isDemoMode();
      const frontendUrl = typeof window !== 'undefined' ? window.location.origin : '';
      
      setConfig({
        apiUrl,
        demoMode,
        frontendUrl,
      });
    };

    checkConfig();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Configuration Test</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <h2 className="font-semibold text-blue-800 dark:text-blue-200">Environment Configuration</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              <span className="font-medium">Frontend URL:</span> {config.frontendUrl}
            </p>
            <p className="mt-1 text-gray-700 dark:text-gray-300">
              <span className="font-medium">API URL:</span> {config.apiUrl}
            </p>
            <p className="mt-1 text-gray-700 dark:text-gray-300">
              <span className="font-medium">Demo Mode:</span> {config.demoMode ? 'Enabled' : 'Disabled'}
            </p>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <h2 className="font-semibold text-green-800 dark:text-green-200">Troubleshooting Information</h2>
            <ul className="mt-2 list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>Frontend is running on: {config.frontendUrl}</li>
              <li>Backend API URL is set to: {config.apiUrl}</li>
              <li>Demo mode is: {config.demoMode ? 'Enabled' : 'Disabled'}</li>
              <li>If demo mode is enabled, the app will use mock data instead of connecting to the backend</li>
              <li>If demo mode is disabled, the app should connect to the backend at {config.apiUrl}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}