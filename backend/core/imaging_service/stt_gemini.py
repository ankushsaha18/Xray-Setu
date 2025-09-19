import os
from typing import Optional

# Import google.generativeai with error handling
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    genai = None
    GENAI_AVAILABLE = False


class GeminiTranscriber:
    """
    Transcribe audio using Google Gemini (Generative AI) API.
    Requires GOOGLE_API_KEY and google-generativeai package.
    """

    def __init__(self, model_name: Optional[str] = None):
        self.api_key = os.getenv('GOOGLE_API_KEY')
        self.model_name = model_name or os.getenv('GEMINI_MODEL', 'gemini-1.5-pro')
        self._configured = False
        if self.api_key and GENAI_AVAILABLE:
            try:
                genai.configure(api_key=self.api_key)
                self._configured = True
            except Exception:
                self._configured = False

    def is_configured(self) -> bool:
        # Check if API key exists and is not a placeholder
        return (self._configured and 
                bool(self.api_key and 
                     self.api_key.strip() and 
                     self.api_key != 'your-google-api-key-here'))

    def transcribe_file(self, file_name: str, file_bytes: bytes, language: Optional[str] = None) -> str:
        if not self.is_configured() or not GENAI_AVAILABLE:
            raise NotImplementedError('Gemini STT is not configured. Set GOOGLE_API_KEY and install google-generativeai.')

        # Gemini supports audio parts directly; set appropriate mime type for webm
        mime_type = 'audio/webm'
        if file_name.lower().endswith('.mp3'):
            mime_type = 'audio/mpeg'
        elif file_name.lower().endswith('.wav'):
            mime_type = 'audio/wav'
        elif file_name.lower().endswith('.m4a'):
            mime_type = 'audio/mp4'

        try:
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
        except Exception as e:
            # Handle authentication errors specifically
            error_str = str(e).lower()
            if 'api key' in error_str or 'authentication' in error_str or 'unauthorized' in error_str:
                raise RuntimeError('Authentication failed with Google Gemini API. Please check your GOOGLE_API_KEY.')
            raise RuntimeError(f"Transcription failed: {e}")