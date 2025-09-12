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
        const errText = await res.text();
        throw new Error(errText || 'Transcription failed');
      }
      const data = await res.json();
      setTranscript(data.transcript || '');
      onTranscribed?.(data.transcript || '', data.symptoms || {});
    } catch (e: any) {
      onError?.(e?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {permissionDenied ? 'Retry Mic' : 'Record Symptoms'}
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
          >
            Stop Recording
          </button>
        )}
        {loading && <span className="text-sm text-gray-500">Transcribing…</span>}
      </div>
      {transcript && (
        <div className="mt-3 text-sm p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="font-medium mb-1">Transcript</div>
          <div className="whitespace-pre-wrap">{transcript}</div>
        </div>
      )}
    </div>
  );
}


