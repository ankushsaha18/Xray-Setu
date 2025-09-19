# Deepgram Authentication Error Troubleshooting

## Problem
You're encountering an `AuthenticationError: Authentication failed` error when using the Deepgram speech-to-text service.

## Root Cause
This error typically occurs when:
1. The Deepgram API key is invalid or incorrect
2. The API key has been revoked or expired
3. The API key doesn't have the necessary permissions
4. The API key is using a placeholder value instead of a real key

## Solution

### 1. Obtain a Real Deepgram API Key
If you haven't already, you need to sign up for a Deepgram account and obtain a valid API key:

1. Go to [Deepgram Console](https://console.deepgram.com/)
2. Sign up for an account or log in if you already have one
3. Navigate to the "API Keys" section
4. Create a new API key with the necessary permissions
5. Copy the generated API key

### 2. Update Your Environment Configuration
Replace the placeholder API key in your `.env` file with your real Deepgram API key:

```env
# In /backend/core/.env
STT_PROVIDER=deepgram
DEEPGRAM_API_KEY=your-real-deepgram-api-key-here
```

Make sure to:
- Remove any quotes around the API key
- Ensure there are no extra spaces
- Restart your application after making changes

### 3. Verify Your API Key
Test your API key using curl to ensure it's working:

```bash
curl -X POST \
  'https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true' \
  -H 'Authorization: Token YOUR_REAL_API_KEY_HERE' \
  -H 'Content-Type: audio/webm' \
  --data-binary @/path/to/audio/file.webm
```

### 4. Check API Key Permissions
Ensure your API key has the necessary permissions:
- Speech-to-text transcription access
- Access to the model you're trying to use (nova-2 by default)

### 5. Common Issues and Fixes

#### Issue: Using Placeholder Keys
The system now rejects common placeholder keys including:
- `your-deepgram-api-key-here`
- `953b20e36b6a3e3561895f50f3059a279ee4cbee`

#### Issue: Quoted API Keys
Incorrect:
```
DEEPGRAM_API_KEY="your-api-key-here"
```

Correct:
```
DEEPGRAM_API_KEY=your-api-key-here
```

#### Issue: Extra Spaces
Incorrect:
```
DEEPGRAM_API_KEY= your-api-key-here
```

Correct:
```
DEEPGRAM_API_KEY=your-api-key-here
```

### 6. Alternative Providers
If you continue to have issues with Deepgram, you can switch to alternative providers:

#### Using Google Gemini:
```env
STT_PROVIDER=gemini
GOOGLE_API_KEY=your-google-api-key-here
```

#### Using OpenAI Whisper:
```env
STT_PROVIDER=whisper
OPENAI_API_KEY=your-openai-api-key-here
```

## Verification
After updating your API key:

1. Restart your application
2. Try transcribing a voice note again
3. Check application logs for any remaining errors

## Support
If you continue to experience authentication issues:

1. Verify your API key at the Deepgram console
2. Check that your account has sufficient credits
3. Contact Deepgram support if the issue persists