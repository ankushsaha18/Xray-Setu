'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { ArrowRight, Layers, Shield, BarChart3, Zap, Eye, Heart, CheckCircle } from 'lucide-react';
import StructuredData from '@/components/ui/StructuredData';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur"></div>
    <div className="relative bg-gray-800 p-8 rounded-2xl shadow-xl transition-all duration-300 group-hover:-translate-y-1 h-full">
      <div className="w-16 h-16 bg-primary-900/30 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
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
      
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-gray-900 to-gray-950"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0ibm9uZSIvPgo8ZyBzdHJva2U9IiMyMmM1NWUiIG9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSI+CjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz4KPC9nPgo8L3N2Zz4=')] bg-repeat"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center px-4 py-1.5 bg-primary-900/40 text-primary-300 rounded-full text-sm font-medium mb-6 border border-primary-800/50">
                  <span className="h-2 w-2 bg-primary-400 rounded-full mr-2 animate-pulse"></span>
                  AI-Powered Diagnostics
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                  Revolutionizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-400">Chest X-Ray</span> Analysis
                </h1>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl">
                  Empower clinicians with our advanced clinical decision support system for faster and more accurate diagnostics using cutting-edge AI technology.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href={isAuthenticatedUser ? "/analyze" : "/login"}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transform hover:-translate-y-0.5"
                    aria-label={isAuthenticatedUser ? "Analyze X-Ray" : "Login to Start"}
                  >
                    {isAuthenticatedUser ? "Analyze X-Ray" : "Get Started"}
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                  <Link 
                    href="/about" 
                    className="inline-flex items-center px-8 py-4 bg-gray-800 text-gray-200 font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl border border-gray-700 hover:border-primary-700/50 hover:text-white"
                    aria-label="Learn More"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative">
                  {/* Floating elements for visual effect */}
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-500 rounded-full mix-blend-soft-light opacity-30 blur-xl animate-pulse"></div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500 rounded-full mix-blend-soft-light opacity-20 blur-xl animate-pulse"></div>
                  
                  {/* Main image container */}
                  <div className="relative bg-gradient-to-br from-primary-700/30 to-emerald-800/30 backdrop-blur-sm rounded-3xl p-1 shadow-2xl border border-primary-900/50">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden">
                      <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-8">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-900/50 mb-6">
                            <Layers className="h-10 w-10 text-primary-400" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">AI-Powered Analysis</h3>
                          <p className="text-gray-400 max-w-xs">Advanced machine learning for medical imaging</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-gradient-to-r from-primary-900/20 to-emerald-900/20 border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">98%</div>
                <div className="text-gray-400">Accuracy Rate</div>
              </div>
              <div className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">5K+</div>
                <div className="text-gray-400">Training Images</div>
              </div>
              <div className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">30s</div>
                <div className="text-gray-400">Average Analysis</div>
              </div>
              <div className="p-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">100+</div>
                <div className="text-gray-400">Test Images Analyzed</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Powerful Features for <span className="text-primary-400">Modern Healthcare</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Our AI-powered system provides essential tools for modern radiology, blending accuracy with efficiency.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                title="Intelligent Diagnostics"
                description="Leverage a state-of-the-art deep learning model, trained on thousands of expertly labeled chest X-rays, to detect and highlight critical findings with unparalleled precision."
                icon={<Layers className="h-8 w-8 text-primary-400" />}
              />
              <FeatureCard
                title="Interactive Insights"
                description="Our intuitive interface provides visual cues, such as heatmap overlays and bounding boxes, to pinpoint areas of concern, making complex data easy to interpret."
                icon={<BarChart3 className="h-8 w-8 text-primary-400" />}
              />
              <FeatureCard
                title="Secure and Reliable"
                description="Built with data privacy and security in mind, our platform adheres to strict clinical guidelines and protocols, ensuring a trustworthy and confidential environment for every analysis."
                icon={<Shield className="h-8 w-8 text-primary-400" />}
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-900/50 to-gray-950/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                How <span className="text-primary-400">Xray Setu</span> Works
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Our streamlined process makes chest X-ray analysis fast, accurate, and accessible.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  step: "01", 
                  title: "Upload X-Ray", 
                  description: "Securely upload your chest X-ray image through our intuitive interface.",
                  icon: <CheckCircle className="h-6 w-6 text-primary-400" />
                },
                { 
                  step: "02", 
                  title: "AI Analysis", 
                  description: "Our advanced AI model analyzes the image and identifies potential findings.",
                  icon: <CheckCircle className="h-6 w-6 text-primary-400" />
                },
                { 
                  step: "03", 
                  title: "Get Results", 
                  description: "Receive detailed insights with visual annotations and clinical recommendations.",
                  icon: <CheckCircle className="h-6 w-6 text-primary-400" />
                }
              ].map((item, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-300 blur"></div>
                  <div className="relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 h-full">
                    <div className="flex items-center mb-6">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-900/50 flex items-center justify-center mr-4">
                        <span className="text-primary-400 font-bold">{item.step}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    </div>
                    <p className="text-gray-300 mb-6">{item.description}</p>
                    <div className="flex justify-end">
                      {item.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                    <div className="bg-gray-900 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-4 bg-primary-900 rounded w-3/4"></div>
                        <div className="h-4 bg-primary-900 rounded"></div>
                        <div className="h-4 bg-primary-900 rounded w-5/6"></div>
                        <div className="pt-4">
                          <div className="h-40 bg-gradient-to-r from-primary-600 to-emerald-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMDAwMDAwIi8+CjxwYXRoIGQ9Ik0zMCAxMEMyMCAxMCAxMi41IDIwIDEyLjUgMzBDMTIuNSA0MCAyMCA1MCAzMCA1MEM0MCA1MCA0Ny41IDQwIDQ3LjUgMzBDMTcuNSAyMCAyMCAxMCAzMCAxMFoiIHN0cm9rZT0iIzIyYzU1ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPg==')] bg-repeat opacity-20"></div>
                            <div className="relative z-10 text-white font-bold text-lg">AI Analysis Visualization</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                  Why Choose <span className="text-primary-400">Xray Setu</span>?
                </h2>
                <p className="text-lg text-gray-400 mb-8">
                  Our platform combines cutting-edge AI technology with medical expertise to deliver unparalleled diagnostic support.
                </p>
                
                <div className="space-y-6">
                  {[
                    { 
                      icon: <Zap className="h-6 w-6 text-primary-400" />, 
                      title: "Lightning Fast Results", 
                      description: "Get diagnostic insights in seconds, not minutes, allowing you to focus on patient care." 
                    },
                    { 
                      icon: <Eye className="h-6 w-6 text-primary-400" />, 
                      title: "Visual Clarity", 
                      description: "Interactive heatmaps and visual overlays highlight areas of concern for better understanding." 
                    },
                    { 
                      icon: <Heart className="h-6 w-6 text-primary-400" />, 
                      title: "Patient-Centric", 
                      description: "Designed with both clinicians and patients in mind for better healthcare outcomes." 
                    },
                    { 
                      icon: <Shield className="h-6 w-6 text-primary-400" />, 
                      title: "HIPAA Compliant", 
                      description: "Built with data privacy and security in mind, ensuring compliance with healthcare regulations." 
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start group">
                      <div className="flex-shrink-0 mt-1 p-2 bg-primary-900/30 rounded-lg group-hover:bg-primary-900/50 transition-colors">
                        {item.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-white">{item.title}</h3>
                        <p className="mt-1 text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-3xl blur opacity-20"></div>
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 border border-gray-700">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                  Ready to Transform Your Diagnostic Workflow?
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                  Experience our cutting-edge AI diagnostic solution designed for healthcare professionals.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href={isAuthenticatedUser ? "/analyze" : "/register"}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                    aria-label={isAuthenticatedUser ? "Start Analysis" : "Create Account"}
                  >
                    {isAuthenticatedUser ? "Start Analysis" : "Create Free Account"}
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-8 py-4 bg-gray-800 text-gray-200 font-bold rounded-xl shadow-lg hover:shadow-xl border border-gray-700 hover:border-primary-700/50 hover:text-white transition-all"
                    aria-label="Contact Sales"
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}