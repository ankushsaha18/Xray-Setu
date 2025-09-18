#!/usr/bin/env python
"""
Debug script for thakan negation
"""
import sys
import os
import re

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.core.imaging_service.nlp_symptoms import extract_symptoms

def debug_thakan():
    """Debug the thakan negation"""
    
    test_case = "No thakan reported"
    
    print(f"Input: '{test_case}'")
    
    # Run through the actual extractor
    result = extract_symptoms(test_case)
    print(f"Final result: {result}")
    
    # Check just for fatigue
    fatigue_result = extract_symptoms(test_case)
    print(f"Fatigue result: {fatigue_result.get('fatigue', 'Not found')}")

if __name__ == "__main__":
    debug_thakan()