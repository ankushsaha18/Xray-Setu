'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import PredictionCard from '@/components/ui/PredictionCard';
import HeatmapViewer from '@/components/ui/HeatmapViewer';
import RuleBasedAdvice from '@/components/ui/RuleBasedAdvice';
import AlertBanner from '@/components/ui/AlertBanner';
import { ArrowLeft, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Threshold for high-risk alerts (70%)
const HIGH_RISK_THRESHOLD = 0.7;
// Threshold for considering a case normal (both COVID-19 and Pneumonia below this)
const NORMAL_THRESHOLD = 0.3;

export default function ResultPage() {
  const [result, setResult] = useState<Record<string, number> | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [highRiskCondition, setHighRiskCondition] = useState<{ name: string; confidence: number } | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const router = useRouter();

  // Load results from sessionStorage on mount
  useEffect(() => {
    try {
      const storedResult = sessionStorage.getItem('xrayResult');
      const storedImageUrl = sessionStorage.getItem('originalImageUrl');
      
      if (!storedResult || !storedImageUrl) {
        throw new Error('No analysis results found');
      }

      // Parse the JSON result
      const parsedResult = JSON.parse(storedResult);
      
      // Handle both formats - whether the data is directly available or nested in a data property
      const resultData = parsedResult.data ? parsedResult.data : parsedResult;
      
      // Process the results - check for high risk conditions or modify to normal if both below threshold
      const processedResult = processResults(resultData);
      
      setResult(processedResult);
      setOriginalImageUrl(storedImageUrl);
    } catch (error) {
      console.error('Failed to load results:', error);
      // Redirect back to analyze page if no results found
      router.push('/analyze');
    } finally {
      setIsLoading(false);
    }
  }, [router]);
    // Process the results: check high-risk conditions and normalize if needed
  const processResults = (data: any) => {
    // Create a copy of the data that we can modify
    const processedData = { ...data };
    
    // Handle structured result format (from mockService)
    if (data.predictions && Array.isArray(data.predictions)) {
      // Check for high risk conditions in predictions array
      const covidPrediction: { label: string; confidence: number } | undefined = data.predictions.find(
        (p: { label: string; confidence: number }) => p.label === 'COVID-19' || p.label === 'Covid-19'
      );
      const pneumoniaPrediction: { label: string; confidence: number } | undefined = data.predictions.find(
        (p: { label: string; confidence: number }) => p.label === 'Pneumonia'
      );
      
      if (covidPrediction && covidPrediction.confidence >= HIGH_RISK_THRESHOLD) {
        setHighRiskCondition({ name: 'COVID-19', confidence: covidPrediction.confidence });
      } else if (pneumoniaPrediction && pneumoniaPrediction.confidence >= HIGH_RISK_THRESHOLD) {
        setHighRiskCondition({ name: 'Pneumonia', confidence: pneumoniaPrediction.confidence });
      }
      
      return processedData;
    }
    
    // Handle flat object format
    // Check for COVID-19 with confidence above high-risk threshold
    if (data['Covid-19'] && data['Covid-19'] >= HIGH_RISK_THRESHOLD) {
      setHighRiskCondition({ name: 'COVID-19', confidence: data['Covid-19'] });
      return processedData;
    }
    
    // Check for Pneumonia with confidence above high-risk threshold
    if (data['Pneumonia'] && data['Pneumonia'] >= HIGH_RISK_THRESHOLD) {
      setHighRiskCondition({ name: 'Pneumonia', confidence: data['Pneumonia'] });
      return processedData;
    }
    
    // If both COVID-19 and Pneumonia are below the normal threshold, normalize the results
    const covidValue = typeof data['Covid-19'] === 'number' ? data['Covid-19'] : 0;
    const pneumoniaValue = typeof data['Pneumonia'] === 'number' ? data['Pneumonia'] : 0;
    
    if (covidValue < NORMAL_THRESHOLD && pneumoniaValue < NORMAL_THRESHOLD) {
      // Set the case to normal by boosting the normal prediction
      // We keep the original values but ensure "normal" is the highest
      if (typeof data['Normal'] === 'number') {
        // Find the current highest numeric value
        const numericValues = Object.entries(data)
          .filter(([key, value]) => typeof value === 'number')
          .map(([_, value]) => value as number);
        const maxValue = numericValues.length ? Math.max(...numericValues) : 0;
        // Set normal to be higher than the current max value
        processedData['Normal'] = Math.max(data['Normal'] as number, maxValue + 0.1);
      } else {
        // If there's no normal key yet, add it with a high value
        processedData['Normal'] = 0.9;
      }
    }
    
    return processedData;
  };

  // Generate and download PDF report
  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);
      
      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Report header
      doc.setFontSize(22);
      doc.setTextColor(44, 62, 80);
      doc.text('X-Ray Analysis Report', 20, 20);
      doc.setDrawColor(41, 128, 185);
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      
      // Date & Time
      const now = new Date();
      doc.text(`Generated: ${now.toLocaleString()}`, 20, 35);
      
      // Capture the X-ray image
      const reportElement = document.getElementById('report-container');
      const imageElement = document.getElementById('xray-image');
      
      if (imageElement) {
        const canvas = await html2canvas(imageElement, {
          scale: 2,
          logging: false,
          useCORS: true,
        });
        
        // Add the image to the PDF
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        doc.addImage(imageData, 'JPEG', 20, 45, 80, 80);
        
        // Add diagnosis info
        doc.setFontSize(16);
        doc.setTextColor(44, 62, 80);
        doc.text('Diagnosis Results', 110, 55);
        
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        
        let y = 65;
        
        // Display top conditions sorted by confidence
        const sortedConditions = Object.entries(result || {})
          .filter(([key]) => !['age'].includes(key))
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3);
        
        sortedConditions.forEach(([condition, confidence], i) => {
          doc.setTextColor(i === 0 ? 41 : 100, i === 0 ? 128 : 100, i === 0 ? 185 : 100);
          doc.setFontSize(i === 0 ? 14 : 12);
          doc.text(`${condition}: ${Math.round(confidence * 100)}%`, 110, y);
          y += 10;
        });
        
        // Clinical recommendations
        doc.setFontSize(16);
        doc.setTextColor(44, 62, 80);
        doc.text('Clinical Recommendations', 20, 140);
        
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        
        // Get the top prediction
        const topPrediction = sortedConditions[0];
        if (topPrediction) {
          const [condition, confidence] = topPrediction;
          
          // Add condition-specific advice
          y = 150;
          let advice = '';
          
          if (condition.toLowerCase().includes('covid')) {
            advice = 'Consider COVID-19 protocol. Recommend RT-PCR testing for confirmation. ' + 
                     'If positive, evaluate for supplemental oxygen needs and monitor for clinical deterioration.';
          } else if (condition.toLowerCase().includes('pneumonia')) {
            advice = 'Bacterial pneumonia suspected. Consider antibiotic therapy based on local guidelines. ' +
                     'Evaluate respiratory status and consider sputum culture if available.';
          } else if (condition.toLowerCase() === 'normal') {
            advice = 'No significant radiographic abnormalities detected. Correlate with clinical presentation.';
          } else {
            advice = 'Findings suggest abnormality that may require further investigation. ' +
                     'Consider specialist consultation or additional imaging studies.';
          }
          
          // Apply text wrapping for the advice
          const splitText = doc.splitTextToSize(advice, 170);
          doc.text(splitText, 20, y);
        }
        
        // Disclaimer
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text('DISCLAIMER: This is an AI-assisted analysis and should be used as a clinical decision support tool only.', 20, 270);
        doc.text('Always correlate with clinical findings and seek specialist consultation as appropriate.', 20, 275);
        
        // Download the PDF
        doc.save(`xray-analysis-${now.toISOString().split('T')[0]}.pdf`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-emerald-500 opacity-20"></div>
            <div className="mt-4 h-6 w-48 bg-gradient-to-r from-primary-500/30 to-emerald-500/30 rounded-lg"></div>
            <div className="mt-2 h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!result) {
    return (
      <ProtectedRoute>
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-1 border border-gray-700 max-w-2xl mx-auto">
            <div className="bg-gray-900 rounded-xl p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-4 text-white">No Results Found</h1>
              <p className="mb-6 text-gray-400">Please upload and analyze an X-ray image first.</p>
              <Link 
                href="/analyze"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go to Analysis Page
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      {/* High risk alert banner for COVID-19 or Pneumonia */}
      {highRiskCondition && (
        <AlertBanner 
          condition={highRiskCondition.name}
          confidence={highRiskCondition.confidence}
        />
      )}
      
      <div id="report-container" className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-emerald-400">
            X-Ray Analysis Results
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            AI-assisted analysis and clinical decision support
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/analyze"
              className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl shadow transition-all border border-gray-700 transform hover:-translate-y-0.5"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              New Analysis
            </Link>
            <button
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="mr-2 h-5 w-5" />
              {isDownloading ? 'Generating...' : 'Download Report'}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Left column - Image with enhanced heatmap */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-1 border border-gray-700">
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                X-Ray Image
              </h2>
              <div id="xray-image" className="rounded-lg overflow-hidden">
                <HeatmapViewer 
                  originalImageUrl={originalImageUrl} 
                  predictionResult={result || undefined}
                  className="aspect-square w-full"
                />
              </div>
              <p className="mt-4 text-sm text-gray-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Toggle the heatmap overlay using the eye icon in the top right corner.
              </p>
            </div>
          </div>
          
          {/* Right column - Prediction results */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-1 border border-gray-700">
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analysis Results
              </h2>
              <PredictionCard result={result || {}} />
            </div>
          </div>
        </div>

        {/* Clinical advice section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-1 border border-gray-700 mb-8">
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Clinical Guidance
            </h2>
            <RuleBasedAdvice result={result || {}} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-800/50 rounded-2xl p-6 mb-6">
          <div className="flex items-start">
            <div className="p-2 rounded-lg bg-amber-900/50 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-amber-200">Important Disclaimer</h3>
              <p className="text-amber-300">
                This system is intended as a clinical decision support tool only. 
                The suggestions provided are not a substitute for professional medical judgment. 
                Always correlate with clinical findings and seek specialist consultation as appropriate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}