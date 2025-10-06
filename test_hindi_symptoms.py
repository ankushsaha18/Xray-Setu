#!/usr/bin/env python
"""
Test script to verify Hindi symptom recognition through English transliterations
"""
import sys
import os

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.core.imaging_service.nlp_symptoms import extract_symptoms

def test_hindi_symptoms():
    """Test that Hindi symptom terms (in English transliteration) are correctly recognized"""
    
    # Test cases with English transliterations of Hindi terms
    test_cases = [
        {
            'input': 'I have khashi',
            'expected': {'cough': True, 'fever': False, 'chest_pain': False}
        },
        {
            'input': 'I have jukam',
            'expected': {'fever': True, 'cough': False, 'chest_pain': False}
        },
        {
            'input': 'I have sar dard',  # Changed from "sir dard" to "sar dard" for headache
            'expected': {'headache': True, 'fever': False, 'cough': False}
        },
        {
            'input': 'I have seena dard',
            'expected': {'chest_pain': True}
        },
        {
            'input': 'I have gala dard',
            'expected': {'sore_throat': True}
        },
        {
            'input': 'I feel thakan',
            'expected': {'fatigue': True}
        },
        {
            'input': 'I have ghrana khamoshi',
            'expected': {'loss_of_smell': True}
        },
        # Test combinations
        {
            'input': 'I have khashi and jukam',
            'expected': {'cough': True, 'fever': True}
        },
        # Test negation
        {
            'input': 'I do not have khashi',  # This should work with the existing negation patterns
            'expected': {'cough': False}
        },
        {
            'input': 'I have no jukam',
            'expected': {'fever': False}
        }
    ]
    
    print("Testing Hindi symptom recognition through English transliterations...\n")
    
    all_passed = True
    for i, test_case in enumerate(test_cases, 1):
        result = extract_symptoms(test_case['input'])
        passed = True
        
        for symptom, expected_value in test_case['expected'].items():
            actual_value = result.get(symptom, False)
            if actual_value != expected_value:
                passed = False
                all_passed = False
                break
        
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"Test {i}: {status}")
        print(f"  Input: '{test_case['input']}'")
        print(f"  Expected: {test_case['expected']}")
        print(f"  Actual: {{", end="")
        first = True
        for symptom, expected_value in test_case['expected'].items():
            if not first:
                print(", ", end="")
            print(f"'{symptom}': {result.get(symptom, False)}", end="")
            first = False
        print("}\n")
    
    if all_passed:
        print("🎉 All tests passed! The system can now recognize Hindi symptom terms in English transliteration.")
    else:
        print("❌ Some tests failed. Please check the implementation.")
    
    # Let's also test the negation patterns specifically
    print("Testing negation patterns specifically:")
    negation_tests = [
        {
            'input': 'no khashi',
            'expected': {'cough': False}
        },
        {
            'input': 'not jukam',
            'expected': {'fever': False}
        },
        {
            'input': 'I have no khashi',
            'expected': {'cough': False}
        },
        {
            'input': 'I do not have jukam',
            'expected': {'fever': False}
        }
    ]
    
    negation_passed = True
    for i, test_case in enumerate(negation_tests, 1):
        result = extract_symptoms(test_case['input'])
        passed = True
        
        for symptom, expected_value in test_case['expected'].items():
            actual_value = result.get(symptom, False)
            if actual_value != expected_value:
                passed = False
                negation_passed = False
                break
        
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"  Negation Test {i}: {status} - '{test_case['input']}' -> {result}")
    
    if not negation_passed:
        print("  Note: Some negation patterns may need adjustment for more complex phrases.")
    
    return all_passed and negation_passed

if __name__ == "__main__":
    test_hindi_symptoms()