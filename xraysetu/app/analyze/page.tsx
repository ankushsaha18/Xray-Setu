'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import ImageUploader from '@/components/ui/ImageUploader';
import PatientVitalsForm from '@/components/ui/PatientVitalsForm';
import { XRayImage, AnalysisResult, PatientVitals } from '@/types';
import { analyzeXray } from '@/utils/predictionService';
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, HelpCircle, Image, Stethoscope, Upload, Mic, FileText } from 'lucide-react';
import VoiceRecorder from '@/components/ui/VoiceRecorder';
import { multimodalDiagnose } from '@/utils/multimodalService';

export default function AnalyzePage() {
  // State definitions
  const [image, setImage] = useState<XRayImage | null>(null);
  const [vitals, setVitals] = useState<PatientVitals | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepComplete, setStepComplete] = useState<{[key: number]: boolean}>({
    1: false,
    2: false
  });
  const [transcript, setTranscript] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const router = useRouter();

  // Handle image selection
  const handleImageSelect = (uploadedImage: XRayImage | null) => {
    setImage(uploadedImage);
    setError(null);
    setStepComplete(prev => ({...prev, 1: !!uploadedImage}));
  };

  // Handle vitals submission
  const handleVitalsSubmit = (patientVitals: PatientVitals) => {
    setVitals(patientVitals);
    setError(null);
    setStepComplete(prev => ({...prev, 2: true}));
  };

  // Navigate to next step
  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Navigate to previous step
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle analysis submission
  const handleAnalyze = async () => {
    if (!image) {
      setError('Please upload an X-ray image first.');
      setCurrentStep(1);
      return;
    }

    if (!vitals) {
      setError('Patient vitals are required for analysis.');
      setCurrentStep(2);
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    try {
      // Use the unified analyzeXray function that handles both image and vitals
      const result = await analyzeXray(image.file, vitals);
      
      // Store result in sessionStorage for the result page
      sessionStorage.setItem('xrayResult', JSON.stringify(result));
      sessionStorage.setItem('originalImageUrl', image.preview);
      sessionStorage.setItem('patientVitals', JSON.stringify(vitals));
      
      // Navigate to result page
      router.push('/result');
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze the image. Please try again.');
      setIsAnalyzing(false);
    }
  };

  // Progress indicator component
  const ProgressSteps = () => (
    <div className="flex items-center justify-center mb-10">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div 
            className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
              ${currentStep === step 
                ? 'border-primary-500 bg-primary-500 text-white shadow-lg' 
                : currentStep > step || stepComplete[step]
                  ? 'border-primary-400 bg-primary-400 text-white'
                  : 'border-gray-300 text-gray-500 dark:border-gray-600 dark:bg-gray-800'
              }`}
            onClick={() => {
              // Only allow clicking on completed steps or the current step + 1 if previous is complete
              if (step < currentStep || (step === currentStep + 1 && stepComplete[currentStep])) {
                setCurrentStep(step);
              }
            }}
            style={{ cursor: (step < currentStep || (step === currentStep + 1 && stepComplete[currentStep])) ? 'pointer' : 'default' }}
          >
            {currentStep > step || stepComplete[step] ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <span className="font-bold">{step}</span>
            )}
          </div>
          
          {step < 4 && (
            <div className={`w-16 h-1 mx-2 rounded-full
              ${currentStep > step || (currentStep === step && stepComplete[step])
                ? 'bg-gradient-to-r from-primary-500 to-emerald-500' 
                : 'bg-gray-200 dark:bg-gray-700'}`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );

  // Step content components
  const StepTitle = ({ step }: { step: number }) => {
    const titles = [
      "Upload X-Ray Image",
      "Enter Patient Vitals",
      "Symptoms (Optional Voice)",
      "Review and Submit"
    ];
    
    const icons = [
      <Image key="image" className="w-6 h-6 mr-3" />,
      <Stethoscope key="stethoscope" className="w-6 h-6 mr-3" />,
      <Mic key="mic" className="w-6 h-6 mr-3" />,
      <FileText key="file" className="w-6 h-6 mr-3" />
    ];
    
    return (
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-xl bg-primary-900/30 text-primary-400 mr-4">
          {icons[step-1]}
        </div>
        <h2 className="text-2xl font-bold text-white">{titles[step-1]}</h2>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-emerald-400">
            AI-Powered X-Ray Analysis
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload a chest X-ray image and provide patient information for AI-assisted diagnostic analysis.
          </p>
        </div>

        {/* Progress Steps Indicator */}
        <ProgressSteps />

        {/* Main content area */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-1 border border-gray-700 mb-10">
          <div className="bg-gray-900 rounded-xl p-6 md:p-8">
            {/* Step 1: Upload X-ray Image */}
            {currentStep === 1 && (
              <div className="animate-fadeIn">
                <StepTitle step={1} />
                <p className="text-gray-300 mb-8">
                  Please upload a clear, high-quality chest X-ray image. The system works best with frontal (PA/AP) views.
                </p>
                <div className="mb-8">
                  <ImageUploader 
                    onImageSelect={handleImageSelect} 
                    maxSizeMB={15} 
                  />
                </div>

                <div className="flex justify-between mt-8">
                  <div></div> {/* Empty div for spacing */}
                  <button
                    onClick={goToNextStep}
                    disabled={!stepComplete[1]}
                    className="flex items-center py-3 px-8 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                  >
                    Next Step
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Patient Vitals */}
            {currentStep === 2 && (
              <div className="animate-fadeIn">
                <StepTitle step={2} />
                <p className="text-gray-300 mb-8">
                  Enter accurate patient vital signs and symptoms to receive more precise diagnostic suggestions.
                </p>
                <div className="mb-8">
                  <PatientVitalsForm 
                    onSubmit={handleVitalsSubmit} 
                    isSubmitting={isAnalyzing} 
                  />
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={goToPrevStep}
                    className="flex items-center py-3 px-8 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl shadow transition-all border border-gray-700"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Previous Step
                  </button>

                  <button
                    onClick={goToNextStep}
                    disabled={!stepComplete[2]}
                    className="flex items-center py-3 px-8 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                  >
                    Next Step
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Optional Voice Symptoms */}
            {currentStep === 3 && (
              <div className="animate-fadeIn">
                <StepTitle step={3} />
                <p className="text-gray-300 mb-8">
                  Record a short voice note describing symptoms like cough, fever, or breathlessness.
                </p>
                
                {/* Language Selection */}
                <div className="mb-6">
                  <label className="block text-gray-300 font-medium mb-3">Select Language</label>
                  <div className="max-w-xs">
                    <select 
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none text-white"
                      defaultValue="en"
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                      <option value="en" className="bg-gray-800">English</option>
                      <option value="hi" className="bg-gray-800">Hindi (हिंदी)</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-8">
                  <VoiceRecorder
                    language={selectedLanguage}
                    onTranscribed={(text) => {
                      setTranscript(text);
                      setStepComplete(prev => ({...prev, 3: true}));
                    }}
                    onError={(m) => setError(m)}
                  />
                </div>
                
                <div className="flex justify-between mt-8">
                  <button
                    onClick={goToPrevStep}
                    className="flex items-center py-3 px-8 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl shadow transition-all border border-gray-700"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Previous Step
                  </button>
                  <button
                    onClick={goToNextStep}
                    className="flex items-center py-3 px-8 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    Next Step
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review and Submit */}
            {currentStep === 4 && (
              <div className="animate-fadeIn">
                <StepTitle step={4} />
                
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  {/* X-ray Image Preview */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                      <Image className="w-5 h-5 mr-2 text-primary-400" />X-ray Image
                    </h3>
                    
                    {image ? (
                      <div className="rounded-lg overflow-hidden border border-gray-700 aspect-square">
                        <img 
                          src={image.preview} 
                          alt="X-ray preview" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700">
                        <p className="text-gray-500">No image uploaded</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Vitals Summary */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                      <Stethoscope className="w-5 h-5 mr-2 text-primary-400" />Patient Vitals
                    </h3>
                    
                    {vitals ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <span className="text-gray-400 text-sm">Temperature</span>
                            <p className="font-medium text-white">{vitals.temperature}°C</p>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <span className="text-gray-400 text-sm">Heart Rate</span>
                            <p className="font-medium text-white">{vitals.heartRate} bpm</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <span className="text-gray-400 text-sm">Blood Pressure</span>
                          <p className="font-medium text-white">{vitals.systolicBP}/{vitals.diastolicBP} mmHg</p>
                        </div>
                        
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <span className="text-gray-400 text-sm">Demographics</span>
                          <p className="font-medium text-white">
                            {vitals.gender.charAt(0).toUpperCase() + vitals.gender.slice(1)}, 
                            {vitals.birthdate ? ` ${calculateAge(vitals.birthdate)} years` : ''}
                          </p>
                        </div>
                        
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <span className="text-gray-400 text-sm">Symptoms</span>
                          <p className="text-white">
                            {[
                              vitals.hasCough ? 'Cough' : null,
                              vitals.hasHeadaches ? 'Headache' : null,
                              !vitals.canSmellTaste ? 'Loss of smell/taste' : null
                            ].filter(Boolean).join(', ') || 'None reported'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
                        <p className="text-gray-500">No vitals entered</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Transcript Summary */}
                  <div className="md:col-span-2 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                      <Mic className="w-5 h-5 mr-2 text-primary-400" />Symptoms Voice Transcript
                    </h3>
                    <div className="text-gray-300 whitespace-pre-wrap min-h-[60px] bg-gray-800 p-4 rounded-lg">
                      {transcript || 'No voice transcript provided.'}
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="p-4 bg-red-900/30 border border-red-700 rounded-xl mb-8 animate-pulse">
                    <p className="text-red-300">{error}</p>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <button
                    onClick={goToPrevStep}
                    className="flex items-center py-3 px-8 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl shadow transition-all border border-gray-700"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Previous Step
                  </button>

                  <button
                    onClick={async () => {
                      if (!image || !vitals) {
                        setError('Please upload image and vitals.');
                        return;
                      }
                      setIsAnalyzing(true);
                      setError(null);
                      try {
                        const result = await multimodalDiagnose({ image: image.file, vitals, transcript });
                        sessionStorage.setItem('xrayResult', JSON.stringify(result));
                        sessionStorage.setItem('originalImageUrl', image.preview);
                        sessionStorage.setItem('patientVitals', JSON.stringify(vitals));
                        sessionStorage.setItem('voiceTranscript', transcript || '');
                        router.push('/result');
                      } catch (err) {
                        console.error('Analysis error:', err);
                        setError('Failed to analyze the data. Please try again.');
                      } finally {
                        setIsAnalyzing(false);
                      }
                    }}
                    disabled={isAnalyzing || !image || !vitals}
                    className="flex items-center py-3 px-8 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze & Submit
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Helpful tips and information card */}
        <div className="bg-gradient-to-r from-primary-900/30 to-emerald-900/30 border border-primary-800/50 rounded-2xl p-6">
          <div className="flex items-start">
            <div className="p-2 rounded-lg bg-primary-900/50 mr-4">
              <HelpCircle className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 text-white">Tips for Best Analysis</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">•</span>
                  <span>Use high-quality, properly exposed X-ray images</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">•</span>
                  <span>Ensure patient vitals are accurate and recent</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">•</span>
                  <span>For children under 12, note that normal vital ranges differ</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">•</span>
                  <span>The AI model works best with frontal chest X-rays (PA/AP views)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-2">•</span>
                  <span>Image analysis typically takes 15-30 seconds to complete</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Helper function to calculate age from birthdate
function calculateAge(birthdate: string): number {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}