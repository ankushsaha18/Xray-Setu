import os
from typing import Optional

try:
    import google.generativeai as genai
except Exception:
    genai = None


class GeminiTranscriber:
    """
    Transcribe audio using Google Gemini (Generative AI) API.
    Requires GOOGLE_API_KEY and google-generativeai package.
    """

    def __init__(self, model_name: Optional[str] = None):
        self.api_key = os.getenv('GOOGLE_API_KEY')
        self.model_name = model_name or os.getenv('GEMINI_MODEL', 'gemini-1.5-pro')
        self._configured = False
        if self.api_key and genai is not None:
            try:
                genai.configure(api_key=self.api_key)
                self._configured = True
            except Exception:
                self._configured = False

    def is_configured(self) -> bool:
        return self._configured

    def transcribe_file(self, file_name: str, file_bytes: bytes, language: Optional[str] = None) -> str:
        if not self.is_configured():
            raise NotImplementedError('Gemini STT is not configured. Set GOOGLE_API_KEY and install google-generativeai.')

        # Gemini supports audio parts directly; set appropriate mime type for webm
        mime_type = 'audio/webm'
        if file_name.lower().endswith('.mp3'):
            mime_type = 'audio/mpeg'
        elif file_name.lower().endswith('.wav'):
            mime_type = 'audio/wav'
        elif file_name.lower().endswith('.m4a'):
            mime_type = 'audio/mp4'

        model = genai.GenerativeModel(self.model_name)
        prompt = 'Transcribe this clinical voice note to plain text. Only return the transcript.'
        contents = [
            prompt,
            {"mime_type": mime_type, "data": file_bytes},
        ]

        # Note: language hint isn't directly supported like Whisper; include in prompt if provided
        if language:
            contents[0] = f"Transcribe this clinical voice note (language: {language}) to plain text. Only return the transcript."

        response = model.generate_content(contents)
        # response.text contains the generated text
        return getattr(response, 'text', '') or ''


