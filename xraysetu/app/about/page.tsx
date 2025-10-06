'use client';

import { Layers, Award, Brain, FileCheck, ShieldAlert, Leaf } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-xl p-8 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl backdrop-blur-sm border border-primary-200 dark:border-primary-900">
    <div className="flex flex-col items-center text-center">
      <div className="flex-shrink-0 mb-4 bg-primary-100/70 dark:bg-primary-900/70 rounded-full p-4 backdrop-blur-sm">
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
      
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] bg-repeat"></div>
      </div>
      
      {/* Hero Section */}
      <div className="relative z-10 py-24 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-950 dark:to-primary-950 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium mb-4">
            About Our Platform
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            About <span className="text-primary-600 dark:text-primary-400">Xray Setu</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We are dedicated to revolutionizing clinical diagnostics with AI. Xray Setu is a state-of-the-art clinical decision support system designed to enhance accuracy, speed, and confidence in chest X-ray interpretation for medical professionals.
          </p>
        </div>
      </div>
      
      {/* Our Mission */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center md:justify-between bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-sm border border-primary-200 dark:border-primary-900">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Our <span className="text-primary-600 dark:text-primary-400">Mission</span></h2>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              Our core mission is to empower healthcare providers with cutting-edge technology. By leveraging advanced deep learning, we aim to augment the capabilities of radiologists and clinicians, enabling faster, more precise diagnoses that lead to better patient outcomes.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary-500 rounded-full blur opacity-20"></div>
              <div className="relative bg-gradient-to-br from-primary-500 to-primary-700 rounded-full p-8">
                <Leaf className="h-24 w-24 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 bg-gradient-to-b from-white to-primary-50 dark:from-gray-900 dark:to-primary-950 backdrop-blur-md">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Brain className="h-8 w-8 text-primary-600 dark:text-primary-400" />}
            title="Advanced AI Diagnostics"
            description="Our deep learning algorithms are trained on vast datasets to identify pathologies with high accuracy, serving as a powerful second opinion."
          />
          <FeatureCard
            icon={<Layers className="h-8 w-8 text-primary-600 dark:text-primary-400" />}
            title="Insightful Visualizations"
            description="Generate intuitive heatmaps that visually highlight critical areas of concern, making complex findings easy to interpret at a glance."
          />
          <FeatureCard
            icon={<FileCheck className="h-8 w-8 text-primary-600 dark:text-primary-400" />}
            title="Actionable Guidance"
            description="Receive tailored, evidence-based recommendations that guide you through potential next steps and treatment considerations."
          />
          <FeatureCard
            icon={<Award className="h-8 w-8 text-primary-600 dark:text-primary-400" />}
            title="Continuous Validation"
            description="The system's performance is continuously monitored and validated against expert readings to ensure reliability and trust."
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">How It Works</h2>
        <div className="bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-xl p-8 md:p-12 backdrop-blur-sm border border-primary-200 dark:border-primary-900">
          <div className="relative">
            {/* Vertical Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-400 to-primary-600 dark:from-primary-700 dark:to-primary-900 -translate-x-1/2 rounded-full"></div>
            
            <div className="grid md:grid-cols-2 gap-12">
              {/* Step 1 */}
              <div className="flex flex-col items-center md:items-end text-center md:text-right">
                <div className="w-12 h-12 flex items-center justify-center bg-primary-600 text-white rounded-full font-bold text-xl mb-4 shadow-lg ring-4 ring-primary-300 dark:ring-primary-700">1</div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Secure Upload</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">Securely upload a chest X-ray image in a standard format through our compliant platform.</p>
              </div>
              <div className="hidden md:block"></div> {/* Spacer */}

              {/* Step 2 */}
              <div className="hidden md:block"></div> {/* Spacer */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-12 h-12 flex items-center justify-center bg-primary-600 text-white rounded-full font-bold text-xl mb-4 shadow-lg ring-4 ring-primary-300 dark:ring-primary-700">2</div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">AI Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">Our advanced algorithms process the image, rapidly identifying patterns and potential anomalies.</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center md:items-end text-center md:text-right">
                <div className="w-12 h-12 flex items-center justify-center bg-primary-600 text-white rounded-full font-bold text-xl mb-4 shadow-lg ring-4 ring-primary-300 dark:ring-primary-700">3</div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Insight Generation</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">The system produces a comprehensive report with probability scores and visual aids to enhance your understanding.</p>
              </div>
              <div className="hidden md:block"></div> {/* Spacer */}

              {/* Step 4 */}
              <div className="hidden md:block"></div> {/* Spacer */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-12 h-12 flex items-center justify-center bg-primary-600 text-white rounded-full font-bold text-xl mb-4 shadow-lg ring-4 ring-primary-300 dark:ring-primary-700">4</div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Informed Decisions</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">Use these insights to inform your expert judgment, leading to more confident and accurate clinical decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="relative bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-800 dark:to-primary-950 rounded-3xl p-8 md:p-12 shadow-xl border border-primary-200 dark:border-primary-900 transition-all duration-300 backdrop-blur-sm">
          
          <div className="flex justify-center mb-6">
            <ShieldAlert className="h-16 w-16 text-primary-600 dark:text-primary-400 drop-shadow-lg" strokeWidth={1.5} />
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6 text-gray-900 dark:text-white">
            Disclaimer & Important Notice
          </h2>
          <div className="text-center text-gray-700 dark:text-gray-300 space-y-4 font-medium max-w-4xl mx-auto leading-relaxed">
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