'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/ui/RegisterForm';
import { ArrowLeft, Stethoscope } from 'lucide-react';
import Image from 'next/image';

export default function NurseRegisterPage() {
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
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl mr-4">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                Xray Setu Nurse Portal
              </h1>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
              Professional <span className="text-blue-400">Healthcare</span> Platform
            </h2>
            
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
              <h3 className="text-xl font-bold text-white mb-3">Nurse Registration</h3>
              <p className="text-gray-300 mb-4">
                Create an account to access professional tools for patient management and diagnosis support.
              </p>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Patient management dashboard with comprehensive health records</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Team collaboration tools for healthcare professionals</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Advanced diagnostic support with AI-powered analysis</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Secure communication with patients and medical teams</span>
                </li>
              </ul>
            </div>
            
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">24/7</div>
                <div className="text-sm text-gray-400">Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">HIPAA</div>
                <div className="text-sm text-gray-400">Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">100+</div>
                <div className="text-sm text-gray-400">Hospitals</div>
              </div>
            </div>
          </div>
          
          {/* Right side - Registration Form */}
          <div className="lg:w-1/2 w-full max-w-md">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-1 border border-gray-700">
              <div className="bg-gray-900 rounded-xl p-8">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
                      <Stethoscope className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Nurse Registration
                  </h2>
                  <p className="text-gray-400">
                    Create your professional healthcare account
                  </p>
                </div>
                
                <RegisterForm userType="nurse" />
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/nurse-login" className="font-medium text-blue-400 hover:text-blue-300">
                      Nurse Login
                    </Link>
                  </p>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    Not a nurse?{' '}
                    <Link href="/register" className="font-medium text-primary-400 hover:text-primary-300">
                      Patient Registration
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