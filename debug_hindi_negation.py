#!/usr/bin/env python
"""
Debug script for Hindi negation patterns
"""
import sys
import os
import re

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.core.imaging_service.nlp_symptoms import extract_symptoms, NEGATION_PATTERNS, SYMPTOM_LEXICON

def debug_negation_patterns():
    """Debug the negation patterns with specific examples"""
    
    test_cases = [
        "No thakan reported",
        "Patient does not have sir dard",
        "I have no khashi",
        "no khashi"
    ]
    
    print("Debugging negation patterns:\n")
    
    for test_case in test_cases:
        print(f"Input: '{test_case}'")
        text = re.sub(r"\s+", " ", test_case.strip().lower())
        print(f"Normalized: '{text}'")
        
        # Check each symptom
        for key, variants in SYMPTOM_LEXICON.items():
            for variant in variants:
                pattern = re.escape(variant)
                if re.search(pattern, text):
                    print(f"  Found '{variant}' for symptom '{key}'")
                    
                    # Check negation patterns
                    for neg_tpl in NEGATION_PATTERNS:
                        neg_regex = neg_tpl.format(term=pattern)
                        if re.search(neg_regex, text):
                            print(f"    Negated by pattern: '{neg_regex}'")
                        else:
                            print(f"    Pattern '{neg_regex}' does not match")
        
        # Run through the actual extractor
        result = extract_symptoms(test_case)
        print(f"  Final result: {result}")
        print()

if __name__ == "__main__":
    debug_negation_patterns()