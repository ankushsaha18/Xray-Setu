#!/usr/bin/env python
"""
Debug script for Deepgram Hindi transcription
"""
import os
import sys
import requests
from dotenv import load_dotenv

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

def test_deepgram_hindi():
    """Test Deepgram with Hindi language parameter"""
    print("=== Deepgram Hindi Transcription Test ===\n")
    
    # Check Deepgram configuration
    api_key = os.getenv('DEEPGRAM_API_KEY')
    if not api_key:
        print("✗ DEEPGRAM_API_KEY is not set")
        return
    
    print("✓ DEEPGRAM_API_KEY is set")
    
    # Test the URL construction for Hindi
    model = os.getenv('DEEPGRAM_MODEL', 'nova-2')
    base_url = f'https://api.deepgram.com/v1/listen?model={model}&smart_format=true'
    hindi_url = base_url + '&language=hi'
    
    print(f"Base URL: {base_url}")
    print(f"Hindi URL: {hindi_url}")
    
    # Test with a simple audio file or create a test
    print("\nTo test with an actual Hindi audio file:")
    print("curl -X POST \"" + hindi_url + "\" \\")
    print("  -H \"Authorization: Token " + api_key + "\" \\")
    print("  -H \"Content-Type: audio/wav\" \\")
    print("  --data-binary @path/to/hindi-audio.wav")
    
    # Test Deepgram API directly with a simple request
    print("\n=== Testing Deepgram API Access ===")
    try:
        headers = {
            'Authorization': f'Token {api_key}'
        }
        response = requests.get('https://api.deepgram.com/v1/projects', headers=headers, timeout=10)
        if response.status_code == 200:
            print("✓ Deepgram API is accessible")
        else:
            print(f"✗ Deepgram API returned status {response.status_code}")
            print(f"  Response: {response.text}")
    except Exception as e:
        print(f"✗ Failed to connect to Deepgram API: {e}")
    
    print("\n=== Deepgram Language Support ===")
    print("Deepgram supports Hindi with language code 'hi'")
    print("Make sure your audio file contains actual Hindi speech")
    print("Silent or very short audio files may not be transcribed properly")

if __name__ == "__main__":
    test_deepgram_hindi()