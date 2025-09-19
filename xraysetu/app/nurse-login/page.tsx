'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import NurseLoginForm from '@/components/ui/NurseLoginForm';
import useAuth from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function NurseLoginPage() {
  const { isAuthenticatedUser, isLoading } = useAuth();
  const router = useRouter();
  
  // Redirect to nurse dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticatedUser) {
      // Check if user is a nurse and redirect accordingly
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.role === 'nurse') {
            router.push('/nurse-dashboard');
          } else {
            router.push('/analyze');
          }
        } catch (error) {
          router.push('/analyze');
        }
      } else {
        router.push('/analyze');
      }
    }
  }, [isAuthenticatedUser, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 text-primary-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10 text-primary-500 animate-spin"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Don't render if user is authenticated (will redirect)
  if (isAuthenticatedUser) {
    return null;
  }

  return (
    <div className=" flex flex-col md:flex-row">
      {/* Background image - full screen with gradient overlay */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/background.png"
          alt="Background"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
      </div>
      
      {/* Content container */}
      <div className="flex flex-col md:flex-row relative z-10 w-full">
        {/* Left side - Branding */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center backdrop-blur-[2px]">
          <div className="max-w-md mx-auto bg-black/40 p-8 rounded-lg shadow-2xl backdrop-blur-[2px]">
            <div className="flex items-center space-x-3 mb-6">
              <Image 
                src="/logo3.png" 
                alt="Xray Setu Logo" 
                width={48} 
                height={48} 
                className="rounded-md"
              />
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Xray Setu
              </h1>
            </div>
            <p className="text-xl text-primary-300 mb-6">
              Nurse Portal
            </p>
            <p className="text-gray-200">
              Access the nurse portal for streamlined patient care and X-ray analysis with comprehensive patient details collection.
            </p>
          </div>
        </div>
        
        {/* Right side - Nurse Login Form */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center backdrop-blur-[2px]">
          <div className="max-w-md mx-auto w-full bg-gray-900/80 p-8 rounded-lg shadow-2xl backdrop-blur-[2px]">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2 text-white">Nurse Sign In</h2>
              <p className="text-gray-300">
                Enter your nurse credentials to access the portal
              </p>
            </div>
            
            <NurseLoginForm />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-300">
                Regular user?{" "}
                <Link href="/login" className="text-primary-400 hover:underline font-medium">
                  User login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}