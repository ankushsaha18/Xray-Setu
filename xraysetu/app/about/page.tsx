'use client';

import { Layers, Award, Brain, FileCheck, ShieldAlert } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-xl p-8 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl backdrop-blur-sm border border-gray-200 dark:border-gray-700">
    <div className="flex flex-col items-center text-center">
      <div className="flex-shrink-0 mb-4 bg-blue-100/70 dark:bg-blue-900/70 rounded-full p-4 backdrop-blur-sm">
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900 dark:text-white leading-snug">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">{description}</p>
    </div>
  </div>
);

export default function AboutPage() {
  return (
    <div className="font-sans antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative overflow-hidden">
      
      {/* Background Gradient & Blob Effects */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Hero Section */}
      <div className="relative z-10 py-24 bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-950 dark:to-gray-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 dark:text-blue-300 mb-4">
            About Xray Setu
          </h1>
          <p className="text-lg md:text-xl text-blue-800 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            We are dedicated to revolutionizing clinical diagnostics with AI. Xray Setu is a state-of-the-art clinical decision support system designed to enhance accuracy, speed, and confidence in chest X-ray interpretation for medical professionals.
          </p>
        </div>
      </div>
      
      {/* Our Mission */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center md:justify-between bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-700 dark:text-blue-400">Our Mission</h2>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              Our core mission is to empower healthcare providers with cutting-edge technology. By leveraging advanced deep learning, we aim to augment the capabilities of radiologists and clinicians, enabling faster, more precise diagnoses that lead to better patient outcomes.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            {/* You could replace this with an SVG or an illustrative image */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-48 w-48 text-blue-600 dark:text-blue-400 animate-pulse-slow" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.41L10 14.17l-2.59-2.58-1.42 1.41L10 17l8-8-1.41-1.41z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-md">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-900 dark:text-white">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
            title="Advanced AI Diagnostics"
            description="Our deep learning algorithms are trained on vast datasets to identify pathologies with high accuracy, serving as a powerful second opinion."
          />
          <FeatureCard
            icon={<Layers className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
            title="Insightful Visualizations"
            description="Generate intuitive heatmaps that visually highlight critical areas of concern, making complex findings easy to interpret at a glance."
          />
          <FeatureCard
            icon={<FileCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
            title="Actionable Guidance"
            description="Receive tailored, evidence-based recommendations that guide you through potential next steps and treatment considerations."
          />
          <FeatureCard
            icon={<Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
            title="Continuous Validation"
            description="The system's performance is continuously monitored and validated against expert readings to ensure reliability and trust."
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-900 dark:text-white">How It Works</h2>
        <div className="bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-xl p-8 md:p-12 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <div className="relative">
            {/* Vertical Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 dark:from-blue-700 dark:to-purple-900 -translate-x-1/2 rounded-full transform-gpu animate-line-glow"></div>
            
            <div className="grid md:grid-cols-2 gap-12">
              {/* Step 1 */}
              <div className="flex flex-col items-center md:items-end text-center md:text-right">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold text-xl mb-4 shadow-lg ring-4 ring-blue-300 dark:ring-blue-700 animate-pulse-fast">1</div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Secure Upload</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">Securely upload a chest X-ray image in a standard format through our compliant platform.</p>
              </div>
              <div className="hidden md:block"></div> {/* Spacer */}

              {/* Step 2 */}
              <div className="hidden md:block"></div> {/* Spacer */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold text-xl mb-4 shadow-lg ring-4 ring-blue-300 dark:ring-blue-700 animate-pulse-fast">2</div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">AI Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">Our advanced algorithms process the image, rapidly identifying patterns and potential anomalies.</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center md:items-end text-center md:text-right">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold text-xl mb-4 shadow-lg ring-4 ring-blue-300 dark:ring-blue-700 animate-pulse-fast">3</div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Insight Generation</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">The system produces a comprehensive report with probability scores and visual aids to enhance your understanding.</p>
              </div>
              <div className="hidden md:block"></div> {/* Spacer */}

              {/* Step 4 */}
              <div className="hidden md:block"></div> {/* Spacer */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold text-xl mb-4 shadow-lg ring-4 ring-blue-300 dark:ring-blue-700 animate-pulse-fast">4</div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Informed Decisions</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">Use these insights to inform your expert judgment, leading to more confident and accurate clinical decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW & IMPROVED Disclaimer Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 shadow-xl ring-4 ring-blue-300 dark:ring-blue-700 transition-all duration-300 animate-pulse-slow backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          
          <div className="flex justify-center mb-6">
            <ShieldAlert className="h-16 w-16 text-blue-600 dark:text-blue-400 drop-shadow-lg" strokeWidth={1.5} />
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6 text-blue-900 dark:text-white">
            Disclaimer & Important Notice
          </h2>
          <div className="text-center text-gray-800 dark:text-gray-200 space-y-4 font-medium max-w-4xl mx-auto leading-relaxed">
            <p>
              Xray Setu is designed solely as a **clinical decision support tool** and must **not** be considered a substitute for professional medical judgment, diagnosis, or treatment. The AI-generated insights and predictions require thorough review and interpretation by qualified healthcare professionals in conjunction with the patient's complete clinical history and other diagnostic findings.
            </p>
            <p>
              This system is for informational and assistive purposes. Its application in actual patient care scenarios must strictly adhere to local regulations, ethical guidelines, and institutional policies. Over-reliance on this system for making medical decisions without expert human oversight is strongly discouraged.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
