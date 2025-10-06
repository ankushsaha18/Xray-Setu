import { apiRequest } from './apiClient';
import { AnalysisResult, PatientVitals } from '@/types';

export async function transcribeSymptoms(audio: File | Blob, language?: string): Promise<{ transcript: string; symptoms: Record<string, boolean> }>{
  const form = new FormData();
  form.append('audio', audio, (audio as File)?.name || 'symptoms.webm');
  if (language) form.append('language', language);
  const res = await apiRequest<{ transcript: string; symptoms: Record<string, boolean> }>({
    endpoint: '/api/symptoms/transcribe',
    method: 'POST',
    body: form,
    formData: true,
    requiresAuth: true,
  });
  if (res.error) throw res.error;
  return res.data as any;
}

export async function multimodalDiagnose(params: { image?: File; vitals: PatientVitals; transcript?: string }): Promise<AnalysisResult> {
  const form = new FormData();
  if (params.image) form.append('image', params.image);
  if (params.transcript) form.append('transcript', params.transcript);

  const v = params.vitals;
  if (v.birthdate) form.append('birthdate', v.birthdate);
  if (v.gender) form.append('gender', v.gender);
  if (v.systolicBP !== undefined) form.append('systolicBP', String(v.systolicBP));
  if (v.diastolicBP !== undefined) form.append('diastolicBP', String(v.diastolicBP));
  if (v.temperature !== undefined) form.append('temperature', String(v.temperature));
  if (v.heartRate !== undefined) form.append('heartRate', String(v.heartRate));
  if (v.hasCough !== undefined) form.append('hasCough', String(v.hasCough));
  if (v.hasHeadaches !== undefined) form.append('hasHeadaches', String(v.hasHeadaches));
  if (v.canSmellTaste !== undefined) form.append('canSmellTaste', String(v.canSmellTaste));

  const res = await apiRequest<AnalysisResult>({
    endpoint: '/api/diagnosis/multimodal',
    method: 'POST',
    body: form,
    formData: true,
    requiresAuth: true,
  });
  if (res.error) throw res.error;
  return res.data as AnalysisResult;
}