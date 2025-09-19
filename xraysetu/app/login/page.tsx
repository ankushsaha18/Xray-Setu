'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/ui/LoginForm';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="absolute top-6 left-6">
        <Link 
          href="/" 
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto">
          {/* Left side - Branding */}
          <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12 text-center lg:text-left">
            <div className="inline-flex items-center justify-center lg:justify-start mb-6">
              <div className="bg-gradient-to-r from-primary-500 to-emerald-500 p-2 rounded-xl mr-4">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-emerald-400">
                Xray Setu
              </h1>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
              Advanced <span className="text-primary-400">AI-Powered</span> Diagnostics
            </h2>
            
            <p className="text-lg text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
              Empowering healthcare professionals with cutting-edge technology for faster, more accurate chest X-ray analysis.
            </p>
            
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-400">98%</div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-400">30s</div>
                <div className="text-sm text-gray-400">Analysis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-400">24/7</div>
                <div className="text-sm text-gray-400">Access</div>
              </div>
            </div>
          </div>
          
          {/* Right side - Login Form */}
          <div className="lg:w-1/2 w-full max-w-md">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-1 border border-gray-700">
              <div className="bg-gray-900 rounded-xl p-8">
                <div className="text-center mb-2">
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                  <p className="text-gray-400 mb-6">Sign in to your account</p>
                </div>
                
                <LoginForm />
                
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">
                    Healthcare professional?{' '}
                    <Link href="/nurse-login" className="font-medium text-primary-400 hover:text-primary-300">
                      Nurse Login
                    </Link>
                  </p>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-medium text-primary-400 hover:text-primary-300">
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}