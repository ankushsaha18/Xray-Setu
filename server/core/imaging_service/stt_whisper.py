import os
import time
import requests


class WhisperTranscriber:
    """
    Thin wrapper around OpenAI Whisper (via REST) to transcribe short clinical voice notes.
    Expects OPENAI_API_KEY in environment. Falls back to NotImplementedError if missing.
    """

    def __init__(self):
        self.api_key = os.getenv('OPENAI_API_KEY')
        # Use the chat/completions-compatible Audio Transcriptions endpoint
        # Docs: https://api.openai.com/v1/audio/transcriptions
        self.endpoint = 'https://api.openai.com/v1/audio/transcriptions'
        self.model = os.getenv('WHISPER_MODEL', 'whisper-1')

    def is_configured(self) -> bool:
        # Check if API key exists and is not a placeholder
        return bool(self.api_key and 
                   self.api_key.strip() and 
                   self.api_key != 'your-openai-api-key-here')

    def transcribe_file(self, file_name: str, file_bytes: bytes, language: str | None = None) -> str:
        if not self.is_configured():
            raise NotImplementedError('Speech-to-text is not configured. Set OPENAI_API_KEY to enable.')

        headers = {
            'Authorization': f'Bearer {self.api_key}'
        }
        # Multipart form with file and model fields
        data = {
            'model': self.model,
        }
        if language:
            data['language'] = language

        files = {
            'file': (file_name, file_bytes, 'application/octet-stream')
        }

        # Retry with exponential backoff on 429/5xx
        max_retries = 3
        backoff_seconds = 2
        last_error = None
        for attempt in range(max_retries + 1):
            try:
                response = requests.post(self.endpoint, headers=headers, data=data, files=files, timeout=90)
                if response.status_code == 401:
                    raise RuntimeError('Unauthorized: Invalid or missing OpenAI API key')
                if response.status_code == 429:
                    # Respect Retry-After if present
                    retry_after = response.headers.get('Retry-After')
                    wait = int(retry_after) if retry_after and retry_after.isdigit() else backoff_seconds
                    if attempt < max_retries:
                        time.sleep(wait)
                        backoff_seconds *= 2
                        continue
                elif response.status_code in (502, 503, 504):
                    if attempt < max_retries:
                        time.sleep(backoff_seconds)
                        backoff_seconds *= 2
                        continue
                response.raise_for_status()
                json_response = response.json()
                return json_response.get('text', '')
            except requests.HTTPError as http_err:
                last_error = http_err
                status = getattr(http_err.response, 'status_code', None)
                # Retry on 429 and 5xx
                if status in (429,) or (status and 500 <= status < 600):
                    if attempt < max_retries:
                        time.sleep(backoff_seconds)
                        backoff_seconds *= 2
                        continue
                break
            except requests.RequestException as req_err:
                last_error = req_err
                if attempt < max_retries:
                    time.sleep(backoff_seconds)
                    backoff_seconds *= 2
                    continue
                break

        # If we reach here, retries failed
        raise RuntimeError(f"Transcription failed after retries: {last_error}")