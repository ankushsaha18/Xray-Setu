'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { ArrowRight, Layers, Shield, BarChart3 } from 'lucide-react';
import StructuredData from '@/components/ui/StructuredData';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <div className="relative p-px rounded-xl overflow-hidden group">
    {/* Gradient Border Effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <div className="relative h-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg transition-all transform group-hover:-translate-y-1">
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

export default function Home() {
  const { isAuthenticatedUser } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <StructuredData
        type="website"
        name="Xray Setu - AI-Powered Clinical Decision Support System"
        description="Enhance diagnostic accuracy and speed with advanced machine learning algorithms designed to assist medical professionals in chest X-ray interpretation."
        customData={{
          offers: {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          applicationCategory: "HealthcareApplication"
        }}
      />
      
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300 animate-fade-in-up">
                  AI-Powered Chest X-Ray Analysis
                </h1>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-lg animate-fade-in-up delay-200">
                  Empower clinicians with our advanced clinical decision support system for faster and more accurate diagnostics.
                </p>
                <div className="flex flex-wrap gap-4 animate-fade-in-up delay-400">
                  <Link 
                    href={isAuthenticatedUser ? "/analyze" : "/login"}
                    className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    aria-label={isAuthenticatedUser ? "Analyze X-Ray" : "Login to Start"}
                  >
                    {isAuthenticatedUser ? "Analyze X-Ray" : "Login to Start"}
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                  <Link 
                    href="/about" 
                    className="inline-flex items-center px-8 py-4 bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-200 font-semibold rounded-xl transition-all hover:bg-teal-200 dark:hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                    aria-label="Learn More"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="order-1 md:order-2 flex justify-center items-center">
                {/* Improved Image Background */}
                <div className="relative p-6 bg-gradient-to-br from-blue-700 to-gray-900 rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-105">
                  <div className="relative border-4 border-white border-opacity-20 rounded-2xl overflow-hidden">
                    <img 
                      src="/ai_image.jpg" 
                      alt="X-Ray Analysis - AI-powered medical illustration" 
                      className="max-w-full h-auto"
                      width={600}
                      height={400} 
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-blue-800 dark:text-blue-300 mb-4" id="features">
                Key Features
              </h2>
              <p className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-300 max-w-3xl mx-auto">
                Our AI-powered system provides essential tools for modern radiology, blending accuracy with efficiency.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                title="Intelligent Diagnostics"
                description="Leverage a state-of-the-art deep learning model, trained on thousands of expertly labeled chest X-rays, to detect and highlight critical findings with unparalleled precision."
                icon={<Layers className="h-8 w-8 text-teal-600 dark:text-teal-300" />}
              />
              <FeatureCard
                title="Interactive Insights"
                description="Our intuitive interface provides visual cues, such as heatmap overlays and bounding boxes, to pinpoint areas of concern, making complex data easy to interpret."
                icon={<BarChart3 className="h-8 w-8 text-teal-600 dark:text-teal-300" />}
              />
              <FeatureCard
                title="Secure and Reliable"
                description="Built with data privacy and security in mind, our platform adheres to strict clinical guidelines and protocols, ensuring a trustworthy and confidential environment for every analysis."
                icon={<Shield className="h-8 w-8 text-teal-600 dark:text-teal-300" />}
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto bg-gradient-to-br from-blue-600 to-teal-500 rounded-3xl p-10 md:p-16 shadow-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Ready to revolutionize your workflow? 🚀
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Join the growing number of healthcare professionals using our AI-assisted platform for enhanced diagnostics.
            </p>
            <Link
              href={isAuthenticatedUser ? "/analyze" : "/login"}
              className="inline-block px-10 py-5 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label={isAuthenticatedUser ? "Start Analysis" : "Login Now"}
            >
              {isAuthenticatedUser ? "Start Analysis" : "Login Now"}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
