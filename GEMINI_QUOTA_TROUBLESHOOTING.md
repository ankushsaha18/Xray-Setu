# Google Gemini API Quota Exceeded Issue

## Problem
You're encountering a "429 Quota Exceeded" error when using the Google Gemini API:
```
Error: 429 You exceeded your current quota, please check your plan and billing details.
* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_input_token_count, limit: 0
* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0
```

## Root Cause
This error occurs because you've exceeded the free tier limits for Google's Gemini API. The free tier has strict usage limits that reset periodically.

## Solution

### Option 1: Switch to Deepgram (Recommended)
I've already updated your configuration to use Deepgram, which should resolve the quota issue immediately.

1. **Verify Configuration**:
   - The [.env](file:///Users/ankushsaha/Desktop/Xray-Setu/backend/core/.env) file is now set to use Deepgram
   - Your Deepgram API key is already configured
   - No quota limits should be encountered with Deepgram

2. **Restart Services**:
   - Restart your backend service to apply the configuration changes

### Option 2: Upgrade Google Gemini Account
If you prefer to continue using Gemini:

1. **Enable Billing**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to your project
   - Enable billing for your project
   - Add a payment method

2. **Upgrade Quotas**:
   - With billing enabled, you'll get higher quota limits
   - Check [Gemini API Quotas](https://ai.google.dev/gemini-api/docs/quotas) for details

3. **Monitor Usage**:
   - Regularly check your usage in the Google Cloud Console
   - Set up alerts to avoid exceeding quotas

### Option 3: Implement Rate Limiting
If you continue using Gemini, implement rate limiting in your application:

1. **Add Retry Logic**:
   - The Deepgram transcriber already has proper retry logic for rate limiting
   - Similar logic can be added to other services

2. **Queue Requests**:
   - Implement a queue system to spread out requests over time

## Language Support Comparison

### Deepgram (Now Configured)
- **English**: Excellent support
- **Hindi**: Good support
- **Odia**: Not supported (use Whisper/Gemini for Odia)
- **Other Languages**: Spanish, French, German, etc.

### Google Gemini (Previously Used)
- **English**: Excellent support
- **Hindi**: Good support
- **Odia**: Limited support
- **Other Languages**: Wide variety of languages

## Immediate Steps

1. **Restart Backend Service** to apply the Deepgram configuration
2. **Test Transcription** with English or Hindi audio
3. **For Odia Transcription**, you'll need to temporarily switch to Whisper or Gemini

## Monitoring and Prevention

1. **Check API Usage**:
   - Regularly monitor your Deepgram usage dashboard
   - Set up alerts for approaching limits

2. **Implement Fallbacks**:
   - The system already has fallback logic for Odia language
   - Consider implementing similar logic for other scenarios

3. **Optimize Requests**:
   - Send shorter audio clips when possible
   - Batch requests during low-usage periods

## Additional Resources

- [Deepgram Pricing](https://deepgram.com/pricing)
- [Google Gemini API Quotas](https://ai.google.dev/gemini-api/docs/quotas)
- [Rate Limiting Best Practices](https://developers.deepgram.com/docs/rate-limits)