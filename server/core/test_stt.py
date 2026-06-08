#!/usr/bin/env python
"""
Test script for Speech-to-Text services
"""
import os
import sys
from dotenv import load_dotenv

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

def test_stt_configuration():
    """Test which STT providers are configured"""
    print("=== Speech-to-Text Configuration Test ===\n")
    
    # Check which provider is selected
    provider = os.getenv('STT_PROVIDER', 'whisper')
    print(f"Selected STT Provider: {provider}")
    
    # Test each provider
    if provider == 'whisper':
        api_key = os.getenv('OPENAI_API_KEY')
        if api_key:
            print("✓ OpenAI API Key is configured")
            print("✓ Whisper STT is ready to use")
        else:
            print("✗ OpenAI API Key is missing")
            print("  Please set OPENAI_API_KEY in your environment")
            
    elif provider == 'gemini':
        api_key = os.getenv('GOOGLE_API_KEY')
        if api_key:
            print("✓ Google API Key is configured")
            try:
                import google.generativeai as genai
                print("✓ Google Generative AI package is installed")
                print("✓ Gemini STT is ready to use")
            except ImportError:
                print("✗ Google Generative AI package is not installed")
                print("  Run: pip install google-generativeai")
        else:
            print("✗ Google API Key is missing")
            print("  Please set GOOGLE_API_KEY in your environment")
            
    elif provider == 'deepgram':
        api_key = os.getenv('DEEPGRAM_API_KEY')
        if api_key:
            print("✓ Deepgram API Key is configured")
            print("✓ Deepgram STT is ready to use")
        else:
            print("✗ Deepgram API Key is missing")
            print("  Please set DEEPGRAM_API_KEY in your environment")
    else:
        print(f"✗ Unknown STT provider: {provider}")
        print("  Valid providers are: whisper, gemini, deepgram")
    
    print("\n=== Environment Variables ===")
    print(f"STT_PROVIDER: {os.getenv('STT_PROVIDER', 'Not set (defaults to whisper)')}")
    print(f"OPENAI_API_KEY: {'Set' if os.getenv('OPENAI_API_KEY') else 'Not set'}")
    print(f"GOOGLE_API_KEY: {'Set' if os.getenv('GOOGLE_API_KEY') else 'Not set'}")
    print(f"DEEPGRAM_API_KEY: {'Set' if os.getenv('DEEPGRAM_API_KEY') else 'Not set'}")

if __name__ == "__main__":
    test_stt_configuration()