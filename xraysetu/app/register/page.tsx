'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/ui/RegisterForm';
import { ArrowLeft, Stethoscope, Heart } from 'lucide-react';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<'patient' | 'nurse'>('patient');
  
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
              Join Our <span className="text-primary-400">Healthcare</span> Platform
            </h2>
            
            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => setUserType('patient')}
                className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center transition-all ${
                  userType === 'patient'
                    ? 'bg-primary-500/20 border-2 border-primary-500'
                    : 'bg-gray-800 border-2 border-gray-700 hover:border-primary-500'
                }`}
              >
                <Heart className={`h-8 w-8 mb-2 ${userType === 'patient' ? 'text-primary-400' : 'text-gray-400'}`} />
                <span className={`font-medium ${userType === 'patient' ? 'text-white' : 'text-gray-300'}`}>
                  Patient
                </span>
              </button>
              
              <button
                onClick={() => setUserType('nurse')}
                className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center transition-all ${
                  userType === 'nurse'
                    ? 'bg-blue-500/20 border-2 border-blue-500'
                    : 'bg-gray-800 border-2 border-gray-700 hover:border-blue-500'
                }`}
              >
                <Stethoscope className={`h-8 w-8 mb-2 ${userType === 'nurse' ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className={`font-medium ${userType === 'nurse' ? 'text-white' : 'text-gray-300'}`}>
                  Nurse
                </span>
              </button>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              {userType === 'patient' ? (
                <>
                  <h3 className="text-xl font-bold text-white mb-3">Patient Registration</h3>
                  <p className="text-gray-300 mb-4">
                    Create an account to access personalized health analysis and track your medical history.
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      AI-powered X-ray analysis
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Personal health insights
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Secure medical records
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-white mb-3">Nurse Registration</h3>
                  <p className="text-gray-300 mb-4">
                    Create an account to access professional tools for patient management and diagnosis support.
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Patient management dashboard
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Team collaboration tools
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Advanced diagnostic support
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>
          
          {/* Right side - Registration Form */}
          <div className="lg:w-1/2 w-full max-w-md">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-1 border border-gray-700">
              <div className="bg-gray-900 rounded-xl p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Create {userType === 'nurse' ? 'Nurse' : 'Patient'} Account
                  </h2>
                  <p className="text-gray-400">
                    Join our healthcare platform today
                  </p>
                </div>
                
                <RegisterForm userType={userType} />
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-primary-400 hover:text-primary-300">
                      Sign in
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