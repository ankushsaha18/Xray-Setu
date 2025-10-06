#!/usr/bin/env python
"""
Test Deepgram Hindi transcription with actual API call
"""
import os
import sys
import requests
from dotenv import load_dotenv

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

def test_deepgram_hindi_api():
    """Test Deepgram API with Hindi language parameter"""
    print("=== Deepgram Hindi API Test ===\n")
    
    # Get API key
    api_key = os.getenv('DEEPGRAM_API_KEY')
    if not api_key:
        print("✗ DEEPGRAM_API_KEY is not set")
        return
    
    print("✓ DEEPGRAM_API_KEY is set")
    
    # Create a simple test audio (silence)
    # In a real scenario, you would use an actual Hindi audio file
    test_audio = b"RIFF$\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00D\xac\x00\x00\x88X\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00"
    
    # Test URL with Hindi language
    url = "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&language=hi"
    
    print(f"Testing URL: {url}")
    
    headers = {
        'Authorization': f'Token {api_key}',
        'Content-Type': 'audio/wav'
    }
    
    try:
        response = requests.post(url, headers=headers, data=test_audio, timeout=30)
        print(f"Response Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response Data: {data}")
        else:
            print(f"Error Response: {response.text}")
            
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_deepgram_hindi_api()