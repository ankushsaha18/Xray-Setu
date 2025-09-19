"use client";
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  onTranscribed?: (text: string, symptoms?: Record<string, boolean>) => void;
  onError?: (message: string) => void;
  language?: string;
  className?: string;
};

export default function VoiceRecorder({ onTranscribed, onError, language, className }: Props) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    // Show warning for unsupported languages
    if (language === 'or') {
      setWarning("Odia language is not currently supported.");
    } else {
      setWarning("");
    }
  }, [language]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await uploadAudio(blob);
        chunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
      setPermissionDenied(false);
    } catch (err) {
      setPermissionDenied(true);
      onError?.('Microphone permission denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
    }
  };

  const uploadAudio = async (blob: Blob) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('audio', blob, 'symptoms.webm');
      if (language) formData.append('language', language);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const tokensStr = typeof window !== 'undefined' ? localStorage.getItem('authTokens') : null;
      let access = '';
      if (tokensStr) {
        try { access = JSON.parse(tokensStr).access_token || ''; } catch {}
      }
      const res = await fetch(`${baseUrl}/api/symptoms/transcribe`, {
        method: 'POST',
        headers: access ? { 'Authorization': `Bearer ${access}` } : undefined,
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errorMsg = errData.error || 'Transcription failed';
        const suggestion = errData.suggestion || '';
        
        // Provide more specific error messages based on status code
        let fullErrorMsg = errorMsg;
        if (res.status === 401) {
          fullErrorMsg = 'API authentication failed. Please check your API key configuration.';
        } else if (res.status === 501) {
          fullErrorMsg = 'Speech-to-text service not configured. ' + (suggestion || 'Please contact system administrator.');
        } else if (res.status === 400) {
          fullErrorMsg = 'Bad request. ' + errorMsg;
        } else if (res.status === 429) {
          fullErrorMsg = 'API quota exceeded. Please try again later. ' + (suggestion || 'Consider switching to a different provider.');
        }
        
        throw new Error(suggestion ? `${fullErrorMsg} ${suggestion}` : fullErrorMsg);
      }
      const data = await res.json();
      setTranscript(data.transcript || '');
      onTranscribed?.(data.transcript || '', data.symptoms || {});
    } catch (e: any) {
      console.error('Transcription error:', e);
      onError?.(e?.message || 'Transcription failed. Please check your network connection and API configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      {warning && (
        <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
          <p className="text-yellow-300 text-sm">{warning}</p>
        </div>
      )}
      <div className="flex items-center gap-4">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            {permissionDenied ? 'Retry Mic' : 'Record Symptoms'}
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center"
          >
            <span className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></span>
            Stop Recording
          </button>
        )}
        {loading && <span className="text-gray-400 flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Transcribing…
        </span>}
      </div>
      {transcript && (
        <div className="mt-6 p-5 rounded-xl border border-gray-700 bg-gray-800/50">
          <div className="font-semibold mb-2 text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
            Transcript
          </div>
          <div className="text-gray-300 whitespace-pre-wrap">{transcript}</div>
        </div>
      )}
    </div>
  );
}