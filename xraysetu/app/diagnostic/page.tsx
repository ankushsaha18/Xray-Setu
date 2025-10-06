'use client';

import { useState, useEffect } from 'react';

export default function DiagnosticPage() {
  const [diagnostics, setDiagnostics] = useState({
    frontendUrl: '',
    apiUrl: '',
    isDemoMode: false,
    backendAccessible: false,
    backendError: null as string | null,
    corsWorking: false,
    corsError: null as string | null,
  });

  useEffect(() => {
    // Get frontend URL
    const frontendUrl = typeof window !== 'undefined' ? window.location.origin : 'Unknown';
    
    // Get API configuration
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const isDemoMode = apiUrl.toLowerCase().includes('demo');
    
    setDiagnostics(prev => ({
      ...prev,
      frontendUrl,
      apiUrl,
      isDemoMode
    }));
    
    // Test backend accessibility
    const testBackend = async () => {
      try {
        const response = await fetch(`${apiUrl}/auth/login/`, {
          method: 'OPTIONS',
          headers: {
            'Origin': frontendUrl,
            'Access-Control-Request-Method': 'POST',
          }
        });
        
        setDiagnostics(prev => ({
          ...prev,
          backendAccessible: response.ok,
          backendError: response.ok ? null : `HTTP ${response.status}: ${response.statusText}`
        }));
      } catch (error: any) {
        setDiagnostics(prev => ({
          ...prev,
          backendAccessible: false,
          backendError: error.message || 'Unknown error'
        }));
      }
    };
    
    // Test CORS
    const testCors = async () => {
      try {
        const response = await fetch(`${apiUrl}/auth/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': frontendUrl,
          },
          body: JSON.stringify({ test: true })
        });
        
        // We expect a 400 or 401 error for a test request, but that means CORS is working
        const corsWorking = response.status === 400 || response.status === 401 || response.status === 405;
        setDiagnostics(prev => ({
          ...prev,
          corsWorking,
          corsError: corsWorking ? null : `HTTP ${response.status}: ${response.statusText}`
        }));
      } catch (error: any) {
        setDiagnostics(prev => ({
          ...prev,
          corsWorking: false,
          corsError: error.message || 'Unknown error'
        }));
      }
    };
    
    testBackend();
    testCors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Application Diagnostic</h1>
        
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <h2 className="font-semibold text-blue-800 dark:text-blue-200">Frontend Configuration</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              <span className="font-medium">Frontend URL:</span> {diagnostics.frontendUrl}
            </p>
            <p className="mt-1 text-gray-700 dark:text-gray-300">
              <span className="font-medium">API URL:</span> {diagnostics.apiUrl}
            </p>
            <p className="mt-1 text-gray-700 dark:text-gray-300">
              <span className="font-medium">Demo Mode:</span> {diagnostics.isDemoMode ? 'Enabled' : 'Disabled'}
            </p>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <h2 className="font-semibold text-green-800 dark:text-green-200">Backend Connectivity</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              <span className="font-medium">Backend Accessible:</span> {diagnostics.backendAccessible ? 'Yes' : 'No'}
            </p>
            {diagnostics.backendError && (
              <p className="mt-1 text-red-600 dark:text-red-400">
                <span className="font-medium">Error:</span> {diagnostics.backendError}
              </p>
            )}
          </div>
          
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
            <h2 className="font-semibold text-yellow-800 dark:text-yellow-200">CORS Configuration</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              <span className="font-medium">CORS Working:</span> {diagnostics.corsWorking ? 'Yes' : 'No'}
            </p>
            {diagnostics.corsError && (
              <p className="mt-1 text-red-600 dark:text-red-400">
                <span className="font-medium">Error:</span> {diagnostics.corsError}
              </p>
            )}
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <h2 className="font-semibold text-purple-800 dark:text-purple-200">Troubleshooting Steps</h2>
            <ul className="mt-2 list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>Ensure both backend (port 8000) and frontend (port 3000) servers are running</li>
              <li>Check that NEXT_PUBLIC_API_URL in .env.local is set to http://localhost:8000</li>
              <li>Verify that demo mode is disabled (NEXT_PUBLIC_API_URL should not contain "demo")</li>
              <li>Check browser console for any JavaScript errors</li>
              <li>Check browser network tab for failed API requests</li>
              <li>If using a different port for frontend, ensure CORS is configured for that port</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}