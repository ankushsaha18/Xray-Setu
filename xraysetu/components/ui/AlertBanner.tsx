'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AlertBannerProps {
  condition: string;
  confidence: number;
  className?: string;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ 
  condition,
  confidence,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  
  useEffect(() => {
    // Pulse animation effect
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!isVisible) return null;
  
  const confidencePercentage = Math.min(Math.round(confidence * 100), 100);
  
  
  
  return (
    <div className={`fixed inset-x-0 top-24 z-50 flex justify-center px-4 pointer-events-none ${className}`}>
      <div className={
        `bg-gradient-to-r from-red-900/80 to-orange-900/80 
        border border-red-700/50
        text-red-100
        p-5 rounded-2xl shadow-2xl max-w-2xl w-full
        transition-all duration-500
        pointer-events-auto
        backdrop-blur-sm
        ${isAnimating ? 'pulse-glow' : ''}`
      }>
        <div className="flex">
          <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-900/50 mr-3">
            <AlertTriangle className={
              `h-6 w-6 text-red-300
              ${isAnimating ? 'animate-pulse' : ''}`
            } />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold text-red-100">
                High Risk: {condition} Detected
              </h3>
              <button 
                onClick={() => setIsVisible(false)}
                className="inline-flex text-red-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-4"
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-3">
              <p className="text-red-200">
                {condition} has been detected with {confidencePercentage}% confidence. Immediate clinical attention may be required.
              </p>
              <p className="mt-3 text-red-100 font-medium">
                Additional testing and specialist consultation is recommended.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .pulse-glow {
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
          animation: pulse-glow 2s infinite;
        }
        
        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default AlertBanner;