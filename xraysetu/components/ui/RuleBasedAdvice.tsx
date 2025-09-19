'use client';

import { AlertTriangle, BookOpen, Stethoscope } from 'lucide-react';

interface RuleBasedAdviceProps {
  result: Record<string, any>;
  className?: string;
}

const RuleBasedAdvice: React.FC<RuleBasedAdviceProps> = ({ result, className = '' }) => {  // Handle both structured and flat data formats
  let diagnosisEntries: Array<{label: string, confidence: number}> = [];
  
  if (result.predictions && Array.isArray(result.predictions) && result.predictions.length > 0) {
    // Handle the case where result has predictions array (from mockService)
    diagnosisEntries = result.predictions.map((p: {label: string, confidence: number}) => ({
      label: p.label,
      confidence: p.confidence
    }));
  } else if (result.topPrediction && typeof result.topPrediction === 'object') {
    // Use topPrediction if available
    diagnosisEntries = [{ 
      label: String(result.topPrediction.label), 
      confidence: Number(result.topPrediction.confidence) 
    }];
  } else {
    // Handle the flat object structure
    diagnosisEntries = Object.entries(result)
      .filter(([key]) => !['age', 'topPrediction', 'predictions', 'heatmapUrl', 'regions', 'severity', 'diagnosisWithVitals', 'treatmentSuggestions', 'vitals'].includes(key))
      .map(([label, confidence]) => ({ 
        label: String(label), 
        confidence: Number(confidence) 
      }));
  }
  
  // Find the top prediction (highest confidence)
  const topPrediction = diagnosisEntries.reduce(
    (max, current) => current.confidence > max.confidence ? current : max, 
    { label: '', confidence: 0 }
  );
  
  // Get appropriate advice based on top prediction and confidence level
  const getAdvice = () => {
    const label = topPrediction.label.toLowerCase();
    const confidence = topPrediction.confidence;
    
    // Normal case
    if (label === 'normal') {
      if (confidence > 0.9) {
        return {
          title: 'No Significant Findings',
          description: 'The chest X-ray appears normal with high confidence. No further imaging studies are indicated unless clinically warranted.',
          icon: <Stethoscope className="h-5 w-5 text-green-500" />,
          recommendations: [
            'Regular follow-up as appropriate for patient age and risk factors',
            'Consider annual chest X-ray for patients with smoking history or occupational exposures'
          ]
        };
      } else {
        return {
          title: 'Likely Normal',
          description: 'The chest X-ray appears mostly normal, but with modest confidence. Consider clinical correlation.',
          icon: <Stethoscope className="h-5 w-5 text-yellow-500" />,
          recommendations: [
            'Correlate with patient symptoms',
            'Consider follow-up imaging in 3-6 months if clinically indicated',
            'Consider further evaluation if symptomatic'
          ]
        };
      }
    }
    
    // COVID-19 case
    if (label === 'covid-19') {
      if (confidence > 0.8) {
        return {
          title: 'High Probability of COVID-19',
          description: 'The findings strongly suggest COVID-19 pneumonia. Bilateral, peripheral, and basal predominant ground-glass opacities are typical.',
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          recommendations: [
            'Confirm with PCR or antigen testing if not already done',
            'Consider isolation protocols as per institutional guidelines',
            'Evaluate oxygen saturation and respiratory status',
            'Consider CT scan for patients with severe symptoms or deteriorating condition'
          ]
        };
      } else {
        return {
          title: 'Possible COVID-19',
          description: 'Some findings suggestive of COVID-19 pneumonia, but lower confidence. Consider other viral pneumonias in differential.',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
          recommendations: [
            'Confirm with PCR or antigen testing',
            'Consider other viral pneumonia etiologies',
            'Follow up imaging in 24-48 hours if clinical condition worsens',
            'Monitor oxygen saturation'
          ]
        };
      }
    }
    
    // Pneumonia case
    if (label === 'pneumonia') {
      if (confidence > 0.8) {
        return {
          title: 'High Probability of Bacterial Pneumonia',
          description: 'Findings consistent with bacterial pneumonia. Lobar consolidation with air bronchograms is typical.',
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          recommendations: [
            'Consider empiric antibiotic therapy based on local guidelines',
            'Obtain sputum culture if possible before initiating antibiotics',
            'Assess for pleural effusion and consider thoracentesis if present',
            'Consider hospital admission based on CURB-65 or PSI score'
          ]
        };
      } else {
        return {
          title: 'Possible Pneumonia',
          description: 'Some findings suggestive of pneumonia, but with lower confidence.',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
          recommendations: [
            'Correlate with clinical symptoms and laboratory findings',
            'Consider sputum culture and sensitivity',
            'Follow up imaging in 2-3 days if outpatient management',
            'Consider bronchoscopy if persistent infiltrate or recurrent pneumonia'
          ]
        };
      }
    }
    
    // Tuberculosis case
    if (label === 'tuberculosis') {
      if (confidence > 0.8) {
        return {
          title: 'High Probability of Tuberculosis',
          description: 'Findings highly suggestive of pulmonary tuberculosis. Upper lobe cavitary lesions and/or nodular infiltrates are typical.',
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          recommendations: [
            'Obtain sputum for AFB smear and TB PCR',
            'Consider respiratory isolation',
            'Consult infectious disease specialist',
            'Screen close contacts as per public health guidelines'
          ]
        };
      } else {
        return {
          title: 'Possible Tuberculosis',
          description: 'Some findings concerning for tuberculosis, but with lower confidence.',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
          recommendations: [
            'Obtain sputum for AFB smear and culture',
            'Consider QuantiFERON or tuberculin skin test',
            'Consider CT chest for better characterization',
            'Review risk factors and history of exposure'
          ]
        };
      }
    }
    
    // Lung Cancer case
    if (label === 'lung cancer') {
      if (confidence > 0.8) {
        return {
          title: 'Suspicious for Malignancy',
          description: 'Findings concerning for primary lung malignancy. Spiculated mass or nodule with associated lymphadenopathy.',
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          recommendations: [
            'Urgent CT chest with contrast',
            'Consider PET-CT for staging',
            'Pulmonology or thoracic surgery consult for tissue diagnosis',
            'Evaluate for metastatic disease'
          ]
        };
      } else {
        return {
          title: 'Indeterminate Pulmonary Nodule/Mass',
          description: 'Findings concerning for possible malignancy, but with lower confidence.',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
          recommendations: [
            'CT chest with contrast',
            'Consider PET-CT if > 8mm solid nodule',
            'Review prior imaging if available',
            'Follow Fleischner Society guidelines for pulmonary nodule follow-up'
          ]
        };
      }
    }
    
    // Default case for other predictions
    return {
      title: 'Indeterminate Findings',
      description: 'The findings are non-specific and may require further evaluation.',
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      recommendations: [
        'Correlate with clinical symptoms and laboratory findings',
        'Consider additional imaging studies based on clinical suspicion',
        'Follow up chest X-ray in 4-6 weeks to assess for resolution or progression',
        'Consider pulmonology consultation if persistent abnormalities'
      ]
    };
  };
  
  const advice = getAdvice();

  // Symptom-aware supportive care suggestions (from voice transcript extraction and vitals)
  const derivedSymptoms: Record<string, boolean> = result.derivedSymptoms || {};
  
  // Extract symptoms from vitals if available
  const vitalsSymptoms: Record<string, boolean> = {};
  if (result.vitals) {
    if (result.vitals.hasCough) vitalsSymptoms.cough = true;
    if (result.vitals.hasHeadaches) vitalsSymptoms.headache = true;
    if (!result.vitals.canSmellTaste) vitalsSymptoms.loss_of_smell = true;
    // Check for fever based on temperature (>37.5°C is generally considered fever)
    if (result.vitals.temperature && result.vitals.temperature > 37.5) vitalsSymptoms.fever_symptom = true;
  }
  
  // Combine symptoms from both sources
  const allSymptoms: Record<string, boolean> = { ...derivedSymptoms, ...vitalsSymptoms };
  
  const symptomRecommendations: string[] = [];

  // Enhanced symptom-based guidance
  if (allSymptoms.cough) {
    symptomRecommendations.push(
      'Hydration and warm fluids; consider honey (if not diabetic) and steam inhalation',
      'Over-the-counter cough suppressant if troubling (per local guidelines)',
      'Consider saline gargles to soothe throat irritation',
      'Avoid irritants like smoke and strong odors'
    );
  }
  
  if (allSymptoms.fever_symptom) {
    symptomRecommendations.push(
      'Paracetamol/acetaminophen for fever as per dosing guidelines',
      'Adequate oral fluids and rest',
      'Use tepid sponging if fever is high and not responding to medication',
      'Monitor for signs of dehydration and worsening symptoms'
    );
  }
  
  if (allSymptoms.breathlessness) {
    symptomRecommendations.push(
      'Monitor SpO2 if available; seek urgent care if SpO2 < 94% or worsening',
      'Avoid exertion; maintain upright position during episodes',
      'Practice pursed-lip breathing techniques',
      'Ensure good ventilation in the room and avoid allergens'
    );
  }
  
  if (allSymptoms.chest_pain) {
    symptomRecommendations.push(
      'Chest pain can be serious; seek urgent medical evaluation, especially if severe or persistent',
      'Avoid physical exertion until evaluated by a healthcare provider',
      'Practice relaxation techniques to reduce anxiety-related chest discomfort',
      'Monitor for associated symptoms like sweating, nausea, or radiation to arm/jaw'
    );
  }
  
  if (allSymptoms.loss_of_smell) {
    symptomRecommendations.push(
      'Loss of smell often recovers over weeks; consider olfactory training exercises',
      'Keep a log of when smell returns to track recovery',
      'Be cautious with food spoilage and gas leaks due to reduced smell sensitivity',
      'Consider zinc supplementation if deficient (consult healthcare provider)'
    );
  }
  
  if (allSymptoms.headache) {
    symptomRecommendations.push(
      'Ensure adequate hydration and rest',
      'Apply cold or warm compress to forehead or neck',
      'Consider over-the-counter pain relievers as per dosing guidelines',
      'Avoid bright lights and loud noises; rest in a quiet, dark room'
    );
  }
  
  if (allSymptoms.sore_throat) {
    symptomRecommendations.push(
      'Gargle with warm salt water several times a day',
      'Stay hydrated with warm liquids like tea with honey',
      'Use throat lozenges or sprays for temporary relief',
      'Avoid irritants like smoke and dry air'
    );
  }
  
  if (allSymptoms.fatigue) {
    symptomRecommendations.push(
      'Prioritize rest and maintain regular sleep schedule',
      'Eat a balanced diet with adequate calories and nutrients',
      'Gradually increase activity as tolerated',
      'Stay hydrated and limit caffeine intake'
    );
  }
  
  return (
    <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-1 border border-gray-700 ${className}`}>
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-lg bg-gray-800 mr-3">
            {advice.icon}
          </div>
          <h3 className="text-xl font-bold text-white">
            {advice.title}
          </h3>
        </div>
      
      <p className="mb-6 text-gray-300 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        {advice.description}
      </p>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Recommendations
        </h4>
        <ul className="space-y-3">
          {advice.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start bg-gray-800/30 p-3 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors">
              <div className="mr-3 mt-0.5 flex-shrink-0">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5"></div>
              </div>
              <span className="text-sm text-gray-300">{rec}</span>
            </li>
          ))}
          {symptomRecommendations.length > 0 && (
            <li className="mt-4 pt-4 border-t border-gray-700/50">
              <div className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Symptom-guided care (from voice symptoms and vitals)
              </div>
              <ul className="space-y-3">
                {symptomRecommendations.map((rec, i) => (
                  <li key={`sym-${i}`} className="flex items-start bg-gray-800/30 p-3 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors">
                    <div className="mr-3 mt-0.5 flex-shrink-0">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5"></div>
                    </div>
                    <span className="text-sm text-gray-300">{rec}</span>
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <p className="text-xs text-gray-400 italic flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Note: This is decision support only. Clinical judgment should always supersede automated predictions.
        </p>
      </div>
    </div>
  </div>);
};

export default RuleBasedAdvice;