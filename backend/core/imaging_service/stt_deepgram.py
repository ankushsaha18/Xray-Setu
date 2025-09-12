import os
import time
import requests
from typing import Optional


class DeepgramTranscriber:
    """
    Transcribe audio using Deepgram's REST API.
    Requires DEEPGRAM_API_KEY.
    Docs: https://developers.deepgram.com/docs/transcribe-audio-rest
    """

    def __init__(self, model: Optional[str] = None):
        self.api_key = os.getenv('DEEPGRAM_API_KEY')
        self.model = model or os.getenv('DEEPGRAM_MODEL', 'nova-2')
        self.endpoint = f'https://api.deepgram.com/v1/listen?model={self.model}&smart_format=true'

    def is_configured(self) -> bool:
        return bool(self.api_key)

    def _guess_mime(self, file_name: str) -> str:
        name = file_name.lower()
        if name.endswith('.webm'):
            return 'audio/webm'
        if name.endswith('.wav'):
            return 'audio/wav'
        if name.endswith('.mp3'):
            return 'audio/mpeg'
        if name.endswith('.m4a'):
            return 'audio/mp4'
        return 'application/octet-stream'

    def transcribe_file(self, file_name: str, file_bytes: bytes, language: Optional[str] = None) -> str:
        if not self.is_configured():
            raise NotImplementedError('Deepgram STT not configured. Set DEEPGRAM_API_KEY.')

        headers = {
            'Authorization': f'Token {self.api_key}',
            'Content-Type': self._guess_mime(file_name)
        }

        url = self.endpoint
        if language:
            url = url + f'&language={language}'

        max_retries = 3
        backoff = 2
        last_error = None
        for attempt in range(max_retries + 1):
            try:
                resp = requests.post(url, headers=headers, data=file_bytes, timeout=90)
                if resp.status_code in (429, 502, 503, 504):
                    if attempt < max_retries:
                        # honor Retry-After when present
                        retry_after = resp.headers.get('Retry-After')
                        wait = int(retry_after) if retry_after and retry_after.isdigit() else backoff
                        time.sleep(wait)
                        backoff *= 2
                        continue
                resp.raise_for_status()
                data = resp.json()
                # Deepgram returns transcript in data['results']['channels'][0]['alternatives'][0]['transcript']
                results = data.get('results', {})
                channels = results.get('channels', [])
                if channels and channels[0].get('alternatives'):
                    return channels[0]['alternatives'][0].get('transcript', '')
                return ''
            except requests.RequestException as e:
                last_error = e
                if attempt < max_retries:
                    time.sleep(backoff)
                    backoff *= 2
                    continue
                break

        raise RuntimeError(f'Transcription failed after retries: {last_error}')


