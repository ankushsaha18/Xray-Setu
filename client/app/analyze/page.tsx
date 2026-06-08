'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import ImageUploader from '@/components/ui/ImageUploader';
import PatientVitalsForm from '@/components/ui/PatientVitalsForm';
import { XRayImage, AnalysisResult, PatientVitals } from '@/types';
import { analyzeXray } from '@/utils/predictionService';
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, HelpCircle, Image, Stethoscope, Upload, FileText, User } from 'lucide-react';
import { multimodalDiagnose } from '@/utils/multimodalService';
import useAuth from '@/hooks/useAuth';

export default function AnalyzePage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // State definitions
  const [image, setImage] = useState<XRayImage | null>(null);
  const [vitals, setVitals] = useState<PatientVitals | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepComplete, setStepComplete] = useState<{[key: number]: boolean}>({
    1: false,
    2: false,
    3: false
  });
  const [transcript, setTranscript] = useState<string>("");

  // Handle image selection
  const handleImageSelect = (uploadedImage: XRayImage | null) => {
    setImage(uploadedImage);
    setError(null);
    setStepComplete(prev => ({...prev, 1: !!uploadedImage}));
  };

  // Handle vitals submission
  const handleVitalsSubmit = (patientVitalsData: PatientVitals & { patientName?: string, transcript?: string }) => {
    // Extract transcript if present
    if (patientVitalsData.transcript) {
      setTranscript(patientVitalsData.transcript);
      delete patientVitalsData.transcript; // Remove transcript from vitals data
    }
    
    // Extract vitals without transcript
    const { transcript: _, ...vitalsData } = patientVitalsData;
    setVitals(vitalsData as PatientVitals);
    setError(null);
    setStepComplete(prev => ({
      ...prev, 
      2: true
    }));
    // For patients, we'll automatically move to the review step since voice is integrated
    if (user?.role !== 'nurse') {
      setCurrentStep(3);
    }
  };

  // Navigate to next step
  const goToNextStep = () => {
    if (user?.role === 'nurse') {
      // For nurses, we still have the separate review step
      if (currentStep === 1) {
        setCurrentStep(2);
      } else if (currentStep === 2) {
        setCurrentStep(3); // Go directly to review step
      } else if (currentStep === 3) {
        // Already at the last step
        return;
      }
    } else {
      // For patients, we only have 3 steps now (image, vitals+voice, review)
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  // Navigate to previous step
  const goToPrevStep = () => {
    if (user?.role === 'nurse') {
      // For nurses, go through all steps
      if (currentStep === 3) {
        setCurrentStep(2); // Go back to vitals step
      } else if (currentStep === 2) {
        setCurrentStep(1); // Go back to image upload step
      } else if (currentStep === 1) {
        // Already at the first step
        return;
      }
    } else {
      // For patients, we only have 3 steps now
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
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
      
      // Save patient data with simplified status tags
      if (user?.role === 'nurse' && vitals.patientName) {
        // Determine status based on pneumonia detection
        // The result structure has an 'imaging' field with 'pneumoniaPositive' boolean
        const hasPneumonia = (result as any).imaging?.pneumoniaPositive || false;
        const status = hasPneumonia ? 'Critical' : 'Normal';
        
        const patientData = {
          id: Date.now(), // Simple ID generation
          name: vitals.patientName,
          patientName: vitals.patientName,
          age: calculateAge(vitals.birthdate),
          gender: vitals.gender,
          lastScan: new Date().toISOString().split('T')[0],
          status: status
        };
        
        // Get existing recent patient data
        const recentPatientData = sessionStorage.getItem('recentPatientData');
        let recentPatients = [];
        if (recentPatientData) {
          try {
            recentPatients = JSON.parse(recentPatientData);
          } catch (e) {
            console.error('Error parsing recent patient data:', e);
          }
        }
        
        // Add new patient to the beginning of the list
        recentPatients.unshift(patientData);
        
        // Keep only the first 10 patients
        if (recentPatients.length > 10) {
          recentPatients = recentPatients.slice(0, 10);
        }
        
        // Save back to session storage
        sessionStorage.setItem('recentPatientData', JSON.stringify(recentPatients));
      }
      
      // Navigate to result page
      router.push('/result');
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze the image. Please try again.');
      setIsAnalyzing(false);
    }
  };

  // Progress indicator component
  const ProgressSteps = () => {
    // For nurses, we show 3 steps (1, 2, 3)
    // For patients, we also show 3 steps (1, 2, 3) but step 2 includes voice
    const steps = [1, 2, 3];
    const stepLabels = ['1', '2', '3'];
    
    return (
      <div className="flex items-center justify-center mb-10">
        {steps.map((step, index) => (
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
                <span className="font-bold">{stepLabels[index]}</span>
              )}
            </div>
            
            {index < steps.length - 1 && (
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
  };

  // Step content components
  const StepTitle = ({ step }: { step: number }) => {
    const titles = user?.role === 'nurse' 
      ? [
          "Upload X-Ray Image",
          "Enter Patient Vitals",
          "Review and Submit"
        ]
      : [
          "Upload X-Ray Image",
          "Enter Patient Information",
          "Review and Submit"
        ];
    
    const icons = user?.role === 'nurse'
      ? [
          <Image key="image" className="w-6 h-6 mr-3" />,
          <Stethoscope key="stethoscope" className="w-6 h-6 mr-3" />,
          <FileText key="file" className="w-6 h-6 mr-3" />
        ]
      : [
          <Image key="image" className="w-6 h-6 mr-3" />,
          <User key="user" className="w-6 h-6 mr-3" />,
          <FileText key="file" className="w-6 h-6 mr-3" />
        ];
    
    return (
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-xl bg-primary-900/30 text-primary-400 mr-4">
          {icons[step - 1]}
        </div>
        <h2 className="text-2xl font-bold text-white">{titles[step - 1]}</h2>
      </div>
    );
  };

  // Calculate age from birthdate
  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
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

            {/* Step 2: Patient Vitals/Information */}
            {currentStep === 2 && (
              <div className="animate-fadeIn">
                <StepTitle step={2} />
                <p className="text-gray-300 mb-8">
                  {user?.role === 'nurse' 
                    ? 'Enter accurate patient vital signs and symptoms to receive more precise diagnostic suggestions.' 
                    : 'Enter your information and any symptoms you\'re experiencing for a more accurate analysis.'}
                </p>
                <div className="mb-8">
                  <PatientVitalsForm 
                    onSubmit={handleVitalsSubmit} 
                    isSubmitting={isAnalyzing} 
                    userType={user?.role === 'nurse' ? 'nurse' : 'patient'}
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

            {/* Step 3: Review and Submit */}
            {currentStep === 3 && (
              <div className="animate-fadeIn">
                <StepTitle step={3} />
                
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
                  
                  {/* Patient Information Summary */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                      <User className="w-5 h-5 mr-2 text-primary-400" />
                      {user?.role === 'nurse' ? 'Patient Information' : 'Your Information'}
                    </h3>
                    
                    {vitals ? (
                      <div className="space-y-4">
                        {/* Patient Name - Only for nurses */}
                        {user?.role === 'nurse' && vitals.patientName && (
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <span className="text-gray-400 text-sm">Patient Name</span>
                            <p className="font-medium text-white">{vitals.patientName}</p>
                          </div>
                        )}
                        
                        {/* For nurses, show vitals; for patients, only show DOB and gender */}
                        {user?.role === 'nurse' ? (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gray-800 p-4 rounded-lg">
                                <span className="text-gray-400 text-sm">Temperature</span>
                                <p className="font-medium text-white">{vitals.temperature !== undefined ? `${vitals.temperature}°C` : 'Not provided'}</p>
                              </div>
                              <div className="bg-gray-800 p-4 rounded-lg">
                                <span className="text-gray-400 text-sm">Heart Rate</span>
                                <p className="font-medium text-white">{vitals.heartRate !== undefined ? `${vitals.heartRate} bpm` : 'Not provided'}</p>
                              </div>
                            </div>
                            
                            <div className="bg-gray-800 p-4 rounded-lg">
                              <span className="text-gray-400 text-sm">Blood Pressure</span>
                              <p className="font-medium text-white">
                                {vitals.systolicBP !== undefined && vitals.diastolicBP !== undefined 
                                  ? `${vitals.systolicBP}/${vitals.diastolicBP} mmHg` 
                                  : 'Not provided'}
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <span className="text-gray-400 text-sm">Demographics</span>
                            <p className="font-medium text-white">
                              {vitals.gender.charAt(0).toUpperCase() + vitals.gender.slice(1)}, 
                              {vitals.birthdate ? ` ${calculateAge(vitals.birthdate)} years` : ''}
                            </p>
                          </div>
                        )}
                        
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
                        <p className="text-gray-500">No information entered</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Transcript Summary - Only for patients */}
                  {user?.role !== 'nurse' && (
                    <div className="md:col-span-2 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                        <User className="w-5 h-5 mr-2 text-primary-400" />Voice Symptoms
                      </h3>
                      <div className="text-gray-300 whitespace-pre-wrap min-h-[60px] bg-gray-800 p-4 rounded-lg">
                        {transcript || 'No voice symptoms provided.'}
                      </div>
                    </div>
                  )}
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
                        setError('Please upload image and provide information.');
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
                        
                        // Save patient data to recent patients list for nurses
                        if (user?.role === 'nurse' && vitals.patientName) {
                          const patientData = {
                            id: Date.now(), // Simple ID generation
                            patientName: vitals.patientName,
                            age: vitals.birthdate ? new Date().getFullYear() - new Date(vitals.birthdate).getFullYear() : 'N/A',
                            gender: vitals.gender,
                            lastScan: new Date().toISOString().split('T')[0],
                            status: 'Normal'
                          };
                          
                          // Get existing recent patient data
                          const recentPatientData = sessionStorage.getItem('recentPatientData');
                          let recentPatients = [];
                          if (recentPatientData) {
                            try {
                              recentPatients = JSON.parse(recentPatientData);
                            } catch (e) {
                              console.error('Error parsing recent patient data:', e);
                            }
                          }
                          
                          // Add new patient to the beginning of the list
                          recentPatients.unshift(patientData);
                          
                          // Keep only the first 10 patients
                          if (recentPatients.length > 10) {
                            recentPatients = recentPatients.slice(0, 10);
                          }
                          
                          // Save back to session storage
                          sessionStorage.setItem('recentPatientData', JSON.stringify(recentPatients));
                        }
                        
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
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze X-Ray
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}