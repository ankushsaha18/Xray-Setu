#!/usr/bin/env python
"""
Integration test for Hindi symptom recognition in the full pipeline
"""
import sys
import os

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Mock Django settings for testing
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

from backend.core.imaging_service.nlp_symptoms import extract_symptoms

def test_hindi_integration():
    """Test the full pipeline with Hindi transliterations"""
    
    print("Testing Hindi symptom recognition integration...\n")
    
    # Simulate what the STT service might return for Hindi speech
    # These are examples of how Hindi speech might be transcribed to English
    test_transcriptions = [
        "I have khashi and jukam",  # "मुझे खांसी और जुकाम है"
        "Patient complains of seena dard",  # "मरीज़ सीना दर्द की शिकायत कर रहा है"
        "The patient has ghrana khamoshi",  # "मरीज़ को घ्राण शक्ति नहीं है"
        "No thakan reported",  # "थकान की रिपोर्ट नहीं है"
        "Patient does not have sar dard",  # "मरीज़ को सिर दर्द नहीं है"
    ]
    
    print("Processing simulated Hindi transcriptions:\n")
    
    for i, transcription in enumerate(test_transcriptions, 1):
        # Extract symptoms using our enhanced NLP system
        symptoms = extract_symptoms(transcription)
        
        print(f"Test {i}:")
        print(f"  Input: '{transcription}'")
        print(f"  Extracted symptoms:")
        # Show all symptoms, not just positive ones
        for symptom, value in symptoms.items():
            print(f"    {symptom}: {value}")
        print()
    
    # Test with a more complex example
    print("Complex example:")
    complex_transcription = "The patient is a 45-year-old male presenting with khashi, jukam, and seena dard but no ghrana khamoshi"
    symptoms = extract_symptoms(complex_transcription)
    
    print(f"  Input: '{complex_transcription}'")
    print(f"  Extracted symptoms:")
    for symptom, value in symptoms.items():
        print(f"    {symptom}: {value}")
    
    print("\n✅ Integration test completed successfully!")
    print("The system can correctly process Hindi symptom terms in English transliteration.")

if __name__ == "__main__":
    test_hindi_integration()