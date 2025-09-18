import re
from typing import Dict, List


SYMPTOM_LEXICON = {
    'cough': ['cough', 'coughing', 'khashi', 'sardi'],
    'fever': ['fever', 'febrile', 'temperature is high', 'jukam', 'buqar'],
    'chest_pain': ['chest pain', 'pain in chest', 'tight chest', 'chest tightness', 'seena dard'],
    'breathlessness': ['shortness of breath', 'breathless', 'difficulty breathing', 'dyspnea', 'dyspnoea', 'sans lai', 'dimaagi'],
    'headache': ['headache', 'head pain', 'migraine', 'sar dard'],
    'sore_throat': ['sore throat', 'throat pain', 'throat hurts', 'gala dard'],
    'fatigue': ['fatigue', 'tired', 'weakness', 'thakan', 'kamzori'],
    'loss_of_smell': ['loss of smell', 'can’t smell', 'cant smell', 'anosmia', 'ghrana khamoshi'],
}


NEGATION_PATTERNS = [
    r"no\s+{term}",
    r"not\s+{term}",
    r"denies\s+{term}",
    r"without\s+{term}",
    r"nahi\s+{term}",
    r"nahin\s+{term}",
    r"do not have\s+{term}",
    r"do not\s+{term}",
    r"don't have\s+{term}",
    r"don't\s+{term}",
]


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def extract_symptoms(transcript: str) -> Dict[str, bool]:
    """
    Lightweight rule-based extractor with negation handling.
    Returns a dict of normalized symptom flags.
    """
    text = normalize_text(transcript)

    findings: Dict[str, bool] = {}
    for key, variants in SYMPTOM_LEXICON.items():
        present = False
        negated = False
        for variant in variants:
            pattern = re.escape(variant)
            if re.search(pattern, text):
                present = True
                # Check negation windows (simple heuristic: negation within 10 tokens before term)
                for neg_tpl in NEGATION_PATTERNS:
                    neg_regex = neg_tpl.format(term=pattern)
                    if re.search(neg_regex, text):
                        negated = True
                        break
            if present and negated:
                break
        findings[key] = True if (present and not negated) else False
    return findings


def to_vitals_flags(symptoms: Dict[str, bool]) -> Dict[str, bool]:
    """
    Map extracted symptoms to vitals/knowledge_base expected flags where applicable.
    """
    return {
        'has_cough': symptoms.get('cough', False),
        'has_headache': symptoms.get('headache', False),
        'can_smell': not symptoms.get('loss_of_smell', False),
        'breathlessness': symptoms.get('breathlessness', False),
        'chest_pain': symptoms.get('chest_pain', False),
        'fever_symptom': symptoms.get('fever', False),
    }