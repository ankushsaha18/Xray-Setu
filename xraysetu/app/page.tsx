'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { ArrowRight, Layers, Shield, BarChart3, Zap, Eye, Heart } from 'lucide-react';
import StructuredData from '@/components/ui/StructuredData';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <div className="relative p-px rounded-2xl overflow-hidden group bg-gradient-to-br from-primary-500 to-primary-700 hover:from-primary-400 hover:to-primary-600 transition-all duration-300">
    <div className="relative h-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl transition-all transform group-hover:-translate-y-2">
      <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/50 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
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
        <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-950">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-5"></div>
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-block px-4 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium mb-4">
                  AI-Powered Diagnostics
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-gray-900 dark:text-white">
                  Revolutionizing <span className="text-primary-600 dark:text-primary-400">Chest X-Ray</span> Analysis
                </h1>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-lg">
                  Empower clinicians with our advanced clinical decision support system for faster and more accurate diagnostics.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href={isAuthenticatedUser ? "/analyze" : "/login"}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                    aria-label={isAuthenticatedUser ? "Analyze X-Ray" : "Login to Start"}
                  >
                    {isAuthenticatedUser ? "Analyze X-Ray" : "Login to Start"}
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                  <Link 
                    href="/about" 
                    className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-300 font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl border border-primary-200 dark:border-primary-900 hover:border-primary-300 dark:hover:border-primary-700"
                    aria-label="Learn More"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="order-1 md:order-2 flex justify-center items-center">
                {/* Improved Image Background */}
                <div className="relative p-6 bg-gradient-to-br from-primary-700 to-gray-900 rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-105">
                  <div className="relative border-4 border-white border-opacity-20 rounded-2xl overflow-hidden">
                    <img 
                      src="/ai_image.png" 
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
        <section className="py-20 px-4 bg-gradient-to-b from-white to-primary-50 dark:from-gray-900 dark:to-primary-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                Key Features
              </h2>
              <p className="text-lg md:text-xl font-medium text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Our AI-powered system provides essential tools for modern radiology, blending accuracy with efficiency.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                title="Intelligent Diagnostics"
                description="Leverage a state-of-the-art deep learning model, trained on thousands of expertly labeled chest X-rays, to detect and highlight critical findings with unparalleled precision."
                icon={<Layers className="h-8 w-8 text-primary-600 dark:text-primary-400" />}
              />
              <FeatureCard
                title="Interactive Insights"
                description="Our intuitive interface provides visual cues, such as heatmap overlays and bounding boxes, to pinpoint areas of concern, making complex data easy to interpret."
                icon={<BarChart3 className="h-8 w-8 text-primary-600 dark:text-primary-400" />}
              />
              <FeatureCard
                title="Secure and Reliable"
                description="Built with data privacy and security in mind, our platform adheres to strict clinical guidelines and protocols, ensuring a trustworthy and confidential environment for every analysis."
                icon={<Shield className="h-8 w-8 text-primary-600 dark:text-primary-400" />}
              />
            </div>
          </div>
        </section>

        {/* New Benefits Section */}
        <section className="py-20 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
                  Why Choose <span className="text-primary-600 dark:text-primary-400">Xray Setu</span>?
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                  Our platform combines cutting-edge AI technology with medical expertise to deliver unparalleled diagnostic support.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Zap className="h-6 w-6 text-primary-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Lightning Fast Results</h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Get diagnostic insights in seconds, not minutes, allowing you to focus on patient care.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Eye className="h-6 w-6 text-primary-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Visual Clarity</h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Interactive heatmaps and visual overlays highlight areas of concern for better understanding.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Heart className="h-6 w-6 text-primary-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Patient-Centric</h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Designed with both clinicians and patients in mind for better healthcare outcomes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary-500 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 shadow-xl">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                      <div className="flex items-center mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-4 bg-primary-200 dark:bg-primary-900 rounded w-3/4"></div>
                        <div className="h-4 bg-primary-200 dark:bg-primary-900 rounded"></div>
                        <div className="h-4 bg-primary-200 dark:bg-primary-900 rounded w-5/6"></div>
                        <div className="pt-4">
                          <div className="h-32 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">AI Analysis Visualization</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-10 md:p-16 shadow-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Ready to revolutionize your workflow? 🚀
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
              Join the growing number of healthcare professionals using our AI-assisted platform for enhanced diagnostics.
            </p>
            <Link
              href={isAuthenticatedUser ? "/analyze" : "/login"}
              className="inline-block px-10 py-5 bg-white text-primary-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
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