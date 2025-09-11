# Multimodal AI Diagnosis (X-ray + Vitals + Voice Symptoms)

This project now supports optional voice symptom capture, server-side speech-to-text (Whisper), rule-based clinical NLP, and fusion with existing X-ray + vitals analysis.

## Backend (Django) Setup

1. Environment
   - Set these variables in your backend environment:
     - `OPENAI_API_KEY` = your OpenAI API key (required for Whisper cloud)
     - `WHISPER_MODEL` (optional, default: `whisper-1`)
   - If you cannot use cloud STT, replace `imaging_service/stt_whisper.py` with your on-prem solution and keep the same `transcribe_file` signature.

2. Dependencies
   - Install new deps:
     - `requests` (added to `backend/core/requirements.txt`)

3. Run server
   - Activate venv: `source backend/core/venv/bin/activate` (or your env)
   - Install deps: `pip install -r backend/core/requirements.txt`
   - Run dev: `python backend/core/manage.py runserver 0.0.0.0:8000`

4. Endpoints
   - `POST /api/upload-scan` (existing): X-ray + vitals
   - `POST /api/symptoms/transcribe` (new): multipart `audio` → `{ transcript, symptoms }`
   - `POST /api/diagnosis/multimodal` (new): multipart `image` (optional) + vitals + optional `transcript` → fused result

## Frontend (Next.js) Setup

1. Environment
   - Set `NEXT_PUBLIC_API_URL` to your backend URL (e.g., `http://localhost:8000`).

2. Voice Recorder
   - New component `components/ui/VoiceRecorder.tsx` lets users record a short voice note; it uploads to `/api/symptoms/transcribe`.

3. Analyze Flow
   - `app/analyze/page.tsx` now has 4 steps: Image → Vitals → (Optional) Voice → Review & Submit.
   - Final submission calls `POST /api/diagnosis/multimodal` via `utils/multimodalService.ts`.

## Notes
- Authentication: These endpoints require JWT, consistent with the existing API client. Ensure you are logged in.
- Privacy: Consider adding an audio consent notice and retention controls in production.
- Languages/accents: Pass `language` to `VoiceRecorder` if you want to enforce a language; otherwise Whisper auto-detects.

## Quick Test (cURL)
```
# Transcribe audio
curl -H "Authorization: Bearer <JWT>" -F audio=@/path/to/sample.webm \
  ${NEXT_PUBLIC_API_URL}/api/symptoms/transcribe | jq

# Multimodal diagnose
curl -H "Authorization: Bearer <JWT>" \
  -F image=@/path/to/xray.png \
  -F birthdate=1980-05-10 -F gender=female \
  -F systolicBP=130 -F diastolicBP=85 -F temperature=37.8 -F heartRate=96 \
  -F transcript='patient reports cough and breathlessness for 3 days' \
  ${NEXT_PUBLIC_API_URL}/api/diagnosis/multimodal | jq
```
