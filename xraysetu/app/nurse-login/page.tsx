'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Stethoscope, LogIn, CheckCircle } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import Image from 'next/image';

export default function NurseLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const router = useRouter();
  const { login, error, user } = useAuth();

  // Check for registration success message in session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const registrationSuccessful = sessionStorage.getItem('registrationSuccess') === 'true';
      const email = sessionStorage.getItem('registeredEmail') || '';
      
      if (registrationSuccessful) {
        setRegistrationSuccess(true);
        setRegisteredEmail(email);
        
        // Set username if email is provided
        if (email.includes('@')) {
          const usernameFromEmail = email.split('@')[0];
          setUsername(usernameFromEmail);
        }
        
        // Clear success message from session storage
        sessionStorage.removeItem('registrationSuccess');
        sessionStorage.removeItem('registeredEmail');
        
        // Auto-hide success message after 8 seconds
        const timeoutId = setTimeout(() => {
          setRegistrationSuccess(false);
        }, 8000);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, []);

  // Redirect nurses to their dashboard after login
  useEffect(() => {
    if (user && user.role === 'nurse') {
      router.push('/nurse-dashboard');
    } else if (user && user.role === 'patient') {
      // If a patient tries to access nurse login, redirect them to patient portal
      router.push('/analyze');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        // The redirect will be handled by the useEffect above
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-xl">
              <Stethoscope className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Nurse Portal
          </h1>
          <p className="text-gray-400">
            Professional healthcare management system
          </p>
        </div>

        {registrationSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-start">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                Registration successful!
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Your account has been created{registeredEmail ? ` for ${registeredEmail}` : ''}. Please sign in with your credentials.
              </p>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="mb-1">
                <label 
                  htmlFor="username" 
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Nurse ID
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Stethoscope className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-4 bg-gray-700 border border-gray-600 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your nurse ID"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="mb-1">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Secure Password
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-4 bg-gray-700 border border-gray-600 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all font-medium"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <LogIn className="h-5 w-5 mr-2" />
                )}
                {isLoading ? 'Authenticating...' : 'Access Nurse Dashboard'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link href="/nurse-register" className="font-medium text-blue-400 hover:text-blue-300">
                Register as Nurse
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-400 flex items-center justify-center">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Patient Login
          </Link>
        </div>
      </div>
    </div>
  );
}