'use client';

import { useState } from 'react';
import { PatientVitals } from '@/types';
import { AlertCircle, Calendar, Users, Wind, User, Mic } from 'lucide-react';
import VoiceRecorder from '@/components/ui/VoiceRecorder';

interface PatientVitalsFormProps {
  onSubmit: (vitals: PatientVitals & { patientName?: string, transcript?: string }) => void;
  isSubmitting: boolean;
  userType?: 'nurse' | 'patient';
}

const PatientVitalsForm: React.FC<PatientVitalsFormProps> = ({ onSubmit, isSubmitting, userType = 'patient' }) => {
  const [formData, setFormData] = useState<PatientVitals & { patientName?: string }>({
    patientName: '',
    temperature: userType === 'nurse' ? 37 : undefined,
    systolicBP: userType === 'nurse' ? 120 : undefined,
    diastolicBP: userType === 'nurse' ? 80 : undefined,
    heartRate: userType === 'nurse' ? 75 : undefined,
    birthdate: '',
    gender: '',
    hasCough: false,
    hasHeadaches: false,
    canSmellTaste: true,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [transcript, setTranscript] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Patient name validation for nurses
    if (userType === 'nurse' && !formData.patientName?.trim()) {
      newErrors.patientName = 'Patient name is required';
    }
    
    // Temperature validation for nurses only
    if (userType === 'nurse' && formData.temperature !== undefined) {
      if (formData.temperature < 35 || formData.temperature > 42) {
        newErrors.temperature = 'Temperature should be between 35-42°C';
      }
    }
    
    // Blood pressure validation for nurses only
    if (userType === 'nurse' && formData.systolicBP !== undefined && formData.diastolicBP !== undefined) {
      if (formData.systolicBP < 70 || formData.systolicBP > 220) {
        newErrors.systolicBP = 'Systolic BP should be between 70-220 mmHg';
      }
      
      if (formData.diastolicBP < 40 || formData.diastolicBP > 130) {
        newErrors.diastolicBP = 'Diastolic BP should be between 40-130 mmHg';
      }
    }
    
    // Heart rate validation for nurses only
    if (userType === 'nurse' && formData.heartRate !== undefined) {
      if (formData.heartRate < 40 || formData.heartRate > 220) {
        newErrors.heartRate = 'Heart rate should be between 40-220 bpm';
      }
    }
    
    // Birthdate validation
    if (!formData.birthdate) {
      newErrors.birthdate = 'Birthdate is required';
    } else {
      // Check if date is valid and not in the future
      const birthdateObj = new Date(formData.birthdate);
      const today = new Date();
      if (isNaN(birthdateObj.getTime())) {
        newErrors.birthdate = 'Invalid date format';
      } else if (birthdateObj > today) {
        newErrors.birthdate = 'Birthdate cannot be in the future';
      } else if (birthdateObj.getFullYear() < 1900) {
        newErrors.birthdate = 'Birthdate year must be after 1900';
      }
    }
    
    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if ((e.target as HTMLInputElement).type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? undefined : Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Include the transcript in the submission
      onSubmit({ ...formData, transcript });
    }
  };

  // For patients, we'll automatically extract symptoms from voice transcript
  const handleTranscribed = (text: string, symptoms?: Record<string, boolean>) => {
    setTranscript(text);
    
    // If symptoms were extracted from the voice input, update the form
    if (symptoms) {
      setFormData(prev => ({
        ...prev,
        hasCough: symptoms.hasCough ?? prev.hasCough,
        hasHeadaches: symptoms.hasHeadaches ?? prev.hasHeadaches,
        canSmellTaste: symptoms.canSmellTaste !== undefined ? symptoms.canSmellTaste : prev.canSmellTaste,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl shadow-2xl border border-gray-800 overflow-hidden">
      <div className="p-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 mb-4">
              <Users className="h-8 w-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
              {userType === 'nurse' ? 'Patient Biometric Data' : 'Patient Information'}
            </h2>
            <p className="text-gray-400 text-sm">
              {userType === 'nurse' 
                ? 'Enter patient biometric data for AI-powered diagnostic analysis' 
                : 'Enter your information for AI-powered diagnostic analysis'}
            </p>
          </div>

          {/* Patient Name Section - Only for nurses */}
          {userType === 'nurse' && (
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                <h3 className="px-4 text-lg font-semibold text-cyan-400 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Patient Information
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="patientName" className="block text-gray-300 font-medium text-sm uppercase tracking-wider">
                  Patient Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-cyan-400" />
                  </div>
                  <input
                    type="text"
                    id="patientName"
                    name="patientName"
                    value={formData.patientName || ''}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 bg-gray-800/70 border rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all ${
                      errors.patientName ? 'border-red-500/50' : 'border-gray-700 hover:border-cyan-500/50'
                    } text-white placeholder-gray-500 backdrop-blur-sm`}
                    placeholder="Enter patient's full name"
                    disabled={isSubmitting}
                  />
                  {errors.patientName && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.patientName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Patient Information Section */}
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
              <h3 className="px-4 text-lg font-semibold text-cyan-400 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Demographics
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="birthdate" className="block text-gray-300 font-medium text-sm uppercase tracking-wider">
                  Birthdate
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-cyan-400" />
                  </div>
                  <input
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 bg-gray-800/70 border rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all ${
                      errors.birthdate ? 'border-red-500/50' : 'border-gray-700 hover:border-cyan-500/50'
                    } text-white backdrop-blur-sm`}
                    max={new Date().toISOString().split('T')[0]}
                    disabled={isSubmitting}
                  />
                  {errors.birthdate && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.birthdate}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="gender" className="block text-gray-300 font-medium text-sm uppercase tracking-wider">
                  Gender
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-cyan-400" />
                  </div>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 bg-gray-800/70 border rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all appearance-none ${
                      errors.gender ? 'border-red-500/50' : 'border-gray-700 hover:border-cyan-500/50'
                    } text-white backdrop-blur-sm`}
                    disabled={isSubmitting}
                  >
                    <option value="" className="bg-gray-800">Select gender</option>
                    <option value="male" className="bg-gray-800">Male</option>
                    <option value="female" className="bg-gray-800">Female</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.gender}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Numeric Vitals Section - Only for nurses */}
          {userType === 'nurse' && (
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                <h3 className="px-4 text-lg font-semibold text-cyan-400 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Vital Signs
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="temperature" className="block text-gray-300 font-medium text-sm uppercase tracking-wider">
                    Temperature (°C)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="temperature"
                      name="temperature"
                      step="0.1"
                      value={formData.temperature || ''}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 bg-gray-800/70 border rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all ${
                        errors.temperature ? 'border-red-500/50' : 'border-gray-700 hover:border-cyan-500/50'
                      } text-white backdrop-blur-sm`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.temperature && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.temperature}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-gray-300 font-medium text-sm uppercase tracking-wider">
                    Blood Pressure (mmHg)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <input
                        type="number"
                        id="systolicBP"
                        name="systolicBP"
                        placeholder="Systolic"
                        value={formData.systolicBP || ''}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 bg-gray-800/70 border rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all ${
                          errors.systolicBP ? 'border-red-500/50' : 'border-gray-700 hover:border-cyan-500/50'
                        } text-white placeholder-gray-500 backdrop-blur-sm`}
                        disabled={isSubmitting}
                      />
                      {errors.systolicBP && (
                        <p className="mt-2 text-sm text-red-400 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.systolicBP}
                        </p>
                      )}
                    </div>
                    
                    <div className="relative">
                      <input
                        type="number"
                        id="diastolicBP"
                        name="diastolicBP"
                        placeholder="Diastolic"
                        value={formData.diastolicBP || ''}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 bg-gray-800/70 border rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all ${
                          errors.diastolicBP ? 'border-red-500/50' : 'border-gray-700 hover:border-cyan-500/50'
                        } text-white placeholder-gray-500 backdrop-blur-sm`}
                        disabled={isSubmitting}
                      />
                      {errors.diastolicBP && (
                        <p className="mt-2 text-sm text-red-400 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.diastolicBP}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="heartRate" className="block text-gray-300 font-medium text-sm uppercase tracking-wider">
                    Heart Rate (bpm)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="heartRate"
                      name="heartRate"
                      value={formData.heartRate || ''}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 bg-gray-800/70 border rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all ${
                        errors.heartRate ? 'border-red-500/50' : 'border-gray-700 hover:border-cyan-500/50'
                      } text-white backdrop-blur-sm`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.heartRate && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.heartRate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Symptoms Section - Now visible for both patients and nurses */}
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
              <h3 className="px-4 text-lg font-semibold text-cyan-400 flex items-center">
                <Wind className="h-5 w-5 mr-2" />
                Symptom Profile
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
            </div>
            
            {/* Voice Recording for Patients */}
            {userType !== 'nurse' && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-gray-300 font-medium text-sm uppercase tracking-wider">
                    Voice Symptoms (Optional)
                  </label>
                  <div className="flex items-center">
                    <Mic className="h-4 w-4 text-cyan-400 mr-2" />
                    <span className="text-xs text-cyan-400">Voice Input</span>
                  </div>
                </div>
                
                {/* Language Selection */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-2">Select Language</label>
                  <div className="max-w-xs relative">
                    <select 
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-white appearance-none cursor-pointer transition-all hover:bg-gray-750 text-sm"
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                      <option value="en" className="bg-gray-800">English</option>
                      <option value="hi" className="bg-gray-800">Hindi (हिंदी)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <VoiceRecorder
                  language={selectedLanguage}
                  onTranscribed={handleTranscribed}
                  onError={(message) => console.error("Transcription error:", message)}
                  className="mb-4"
                />
                
                {transcript && (
                  <div className="mt-4 p-3 rounded-lg border border-gray-700 bg-gray-800/50">
                    <div className="font-medium text-cyan-400 text-sm mb-1 flex items-center">
                      <Mic className="h-4 w-4 mr-1" />
                      Transcript
                    </div>
                    <div className="text-gray-300 text-sm whitespace-pre-wrap">{transcript}</div>
                  </div>
                )}
              </div>
            )}
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-2xl blur opacity-0 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative flex items-center p-5 bg-gray-800/70 rounded-2xl border border-gray-700 group-hover:border-cyan-500/50 transition-all">
                  <input
                    type="checkbox"
                    id="hasCough"
                    name="hasCough"
                    checked={formData.hasCough}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-cyan-500 focus:ring-cyan-500 border-gray-600 rounded"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="hasCough" className="ml-3 text-gray-300">
                    Persistent Cough
                  </label>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-2xl blur opacity-0 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative flex items-center p-5 bg-gray-800/70 rounded-2xl border border-gray-700 group-hover:border-cyan-500/50 transition-all">
                  <input
                    type="checkbox"
                    id="hasHeadaches"
                    name="hasHeadaches"
                    checked={formData.hasHeadaches}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-cyan-500 focus:ring-cyan-500 border-gray-600 rounded"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="hasHeadaches" className="ml-3 text-gray-300">
                    Severe Headaches
                  </label>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-2xl blur opacity-0 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative flex items-center p-5 bg-gray-800/70 rounded-2xl border border-gray-700 group-hover:border-cyan-500/50 transition-all">
                  <input
                    type="checkbox"
                    id="canSmellTaste"
                    name="canSmellTaste"
                    checked={formData.canSmellTaste}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-cyan-500 focus:ring-cyan-500 border-gray-600 rounded"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="canSmellTaste" className="ml-3 text-gray-300">
                    Olfactory Function
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-2xl shadow-cyan-500/20 group overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-300/20 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              <span className="relative flex items-center font-medium">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-5 w-5" />
                    {userType === 'nurse' ? 'Process Patient Data' : 'Continue to Analysis'}
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PatientVitalsForm;