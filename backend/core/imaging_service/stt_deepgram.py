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

    # Languages supported by Deepgram
    SUPPORTED_LANGUAGES = {
        'en', 'en-US', 'en-AU', 'en-GB', 'en-IN', 'en-NZ',  # English variants
        'es', 'es-419',  # Spanish
        'hi',  # Hindi
        'de',  # German
        'fr', 'fr-CA',  # French
        'pt', 'pt-BR', 'pt-PT',  # Portuguese
        'it',  # Italian
        'ja',  # Japanese
        'ko', 'ko-KR',  # Korean
        'zh', 'zh-CN', 'zh-Hans', 'zh-TW', 'zh-Hant', 'zh-HK',  # Chinese
        'ru',  # Russian
        'nl', 'nl-BE',  # Dutch, Flemish
        'sv', 'sv-SE',  # Swedish
        'da', 'da-DK',  # Danish
        'no',  # Norwegian
        'fi',  # Finnish
        'pl',  # Polish
        'tr',  # Turkish
        'cs',  # Czech
        'sk',  # Slovak
        'uk',  # Ukrainian
        'ro',  # Romanian
        'hu',  # Hungarian
        'el',  # Greek
        'bg',  # Bulgarian
        'ca',  # Catalan
        'et',  # Estonian
        'lv',  # Latvian
        'lt',  # Lithuanian
        'th', 'th-TH',  # Thai
        'vi',  # Vietnamese
        'id',  # Indonesian
        'ms',  # Malay
        'ta',  # Tamil
        'taq',  # Tamasheq
    }

    def __init__(self, model: Optional[str] = None):
        self.api_key = os.getenv('DEEPGRAM_API_KEY')
        self.model = model or os.getenv('DEEPGRAM_MODEL', 'nova-2')
        self.endpoint = f'https://api.deepgram.com/v1/listen?model={self.model}&smart_format=true'

    def is_configured(self) -> bool:
        # Check if API key exists and is not a placeholder
        return bool(self.api_key and 
                   self.api_key.strip() and 
                   self.api_key != 'your-deepgram-api-key-here' and
                   self.api_key != '953b20e36b6a3e3561895f50f3059a279ee4cbee')  # Reject placeholder key

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

    def is_language_supported(self, language: Optional[str]) -> bool:
        """Check if the given language is supported by Deepgram"""
        if not language:
            return True  # Default language (English) is supported
        return language in self.SUPPORTED_LANGUAGES

    def transcribe_file(self, file_name: str, file_bytes: bytes, language: Optional[str] = None) -> str:
        if not self.is_configured():
            raise NotImplementedError('Deepgram STT not configured. Set DEEPGRAM_API_KEY.')

        # Check if language is supported by Deepgram
        if language and not self.is_language_supported(language):
            raise ValueError(f'Language "{language}" is not supported by Deepgram. Supported languages: {", ".join(sorted(self.SUPPORTED_LANGUAGES))}')

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
                # Handle rate limiting specifically
                if resp.status_code == 429:
                    # Check for Retry-After header
                    retry_after = resp.headers.get('Retry-After')
                    wait = int(retry_after) if retry_after and retry_after.isdigit() else backoff
                    if attempt < max_retries:
                        time.sleep(wait)
                        backoff *= 2
                        continue
                elif resp.status_code in (502, 503, 504):
                    if attempt < max_retries:
                        time.sleep(backoff)
                        backoff *= 2
                        continue
                # Handle authentication errors specifically
                elif resp.status_code == 401:
                    raise RuntimeError(f'Authentication failed with Deepgram API. Please check your DEEPGRAM_API_KEY.')
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