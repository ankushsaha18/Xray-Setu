from rest_framework.decorators import api_view, parser_classes, authentication_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from .knowledge_base import calculate
from datetime import datetime
from dateutil.relativedelta import relativedelta
from .model.model_predict import predict_pneumonia
import os
from .stt_whisper import WhisperTranscriber
from .stt_gemini import GeminiTranscriber
from .stt_deepgram import DeepgramTranscriber
from .nlp_symptoms import extract_symptoms, to_vitals_flags

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_scan(request):
    """
    Upload a medical scan image and check vitals then get result
    """
    try:
        # Check if image file was provided
        if 'image' not in request.FILES:
            return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get image file
        image_file = request.FILES['image']

        # Check if the patient has pneumonia
        has_pneumonia = predict_pneumonia(image_file)
        
        # Calculate age from birthdate
        try:
            birthdate_str = request.data.get('birthdate')
            if not birthdate_str:
                return Response({'error': 'Birthdate is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Parse birthdate (handle different possible formats)
            try:
                # Try ISO format (YYYY-MM-DD)
                birthdate = datetime.fromisoformat(birthdate_str.replace('Z', '+00:00'))
            except ValueError:
                try:
                    # Try other common formats
                    birthdate = datetime.strptime(birthdate_str, '%m/%d/%Y')
                except ValueError:
                    return Response(
                        {'error': 'Invalid birthdate format. Please use YYYY-MM-DD or MM/DD/YYYY'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Calculate age using relativedelta for accurate years
            today = datetime.now()
            age = relativedelta(today, birthdate).years
            
        except Exception as e:
            return Response(
                {'error': f'Error calculating age: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract parameters for the calculate function
        try:
            # Required parameters with validation
            params = {
                'systolic_pressure': int(request.data.get('systolicBP', 120)),
                'diastolic_pressure': int(request.data.get('diastolicBP', 80)),
                'temperature': float(request.data.get('temperature', 37.0)),
                'heart_rate': int(request.data.get('heartRate', 75)),
                'has_cough': request.data.get('hasCough', 'false').lower() == 'true',
                'has_headache': request.data.get('hasHeadaches', 'false').lower() == 'true',
                'can_smell': request.data.get('canSmellTaste', 'true').lower() == 'true',
                'age': float(age),  # Using calculated age
                'gender': request.data.get('gender', 'female'),
                'has_pneumonia': has_pneumonia
            }
        except (ValueError, TypeError) as e:
            return Response(
                {'error': f'Invalid parameter value: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate disease probabilities
        result = calculate(**params)
        
        # Include age in response for verification
        result['age'] = age
        
        return Response(result, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def transcribe_symptoms(request):
    """
    Transcribe a short voice note and extract symptom keywords.
    """
    try:
        if 'audio' not in request.FILES:
            return Response({'error': 'No audio file provided'}, status=status.HTTP_400_BAD_REQUEST)

        audio_file = request.FILES['audio']
        # Select STT provider via env var
        provider = os.getenv('STT_PROVIDER', 'whisper').lower()
        if provider == 'whisper':
            transcriber = WhisperTranscriber()
        elif provider == 'gemini':
            transcriber = GeminiTranscriber()
        elif provider == 'deepgram':
            transcriber = DeepgramTranscriber()
        else:
            return Response({'error': f'Unknown STT provider: {provider}'}, status=status.HTTP_400_BAD_REQUEST)
        transcript = ""
        if transcriber.is_configured():
            audio_file.seek(0)
            transcript = transcriber.transcribe_file(audio_file.name, audio_file.read(), request.data.get('language'))
        else:
            return Response({'error': 'Speech-to-text not configured on server'}, status=status.HTTP_501_NOT_IMPLEMENTED)

        symptoms = extract_symptoms(transcript)
        return Response({
            'transcript': transcript,
            'symptoms': symptoms
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def multimodal_diagnosis(request):
    """
    Combine X-ray, structured vitals, and optional voice-derived symptoms for a fused diagnosis.
    Accepts multipart (image + form fields) or JSON (if image omitted).
    """
    try:
        # Optional image
        has_pneumonia_flag = False
        if 'image' in request.FILES:
            image_file = request.FILES['image']
            has_pneumonia_flag = predict_pneumonia(image_file)

        # Age handling
        birthdate_str = request.data.get('birthdate') or (request.data.get('patient', {}).get('birthdate') if isinstance(request.data, dict) else None)
        if not birthdate_str:
            return Response({'error': 'Birthdate is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            try:
                birthdate = datetime.fromisoformat(str(birthdate_str).replace('Z', '+00:00'))
            except ValueError:
                birthdate = datetime.strptime(str(birthdate_str), '%m/%d/%Y')
        except Exception:
            return Response({'error': 'Invalid birthdate format. Use YYYY-MM-DD or MM/DD/YYYY'}, status=status.HTTP_400_BAD_REQUEST)
        age = relativedelta(datetime.now(), birthdate).years

        # Structured vitals
        systolic = int(request.data.get('systolicBP', 120))
        diastolic = int(request.data.get('diastolicBP', 80))
        temperature = float(request.data.get('temperature', 37.0))
        heart_rate = int(request.data.get('heartRate', 75))
        gender = request.data.get('gender', 'female')

        # Symptom extraction: either user-provided transcript or server extracts from voice
        transcript_text = request.data.get('transcript', '')
        if transcript_text:
            extracted = extract_symptoms(transcript_text)
        else:
            extracted = {}

        flags = to_vitals_flags(extracted)

        params = {
            'systolic_pressure': systolic,
            'diastolic_pressure': diastolic,
            'temperature': temperature,
            'heart_rate': heart_rate,
            'has_cough': request.data.get('hasCough', str(flags.get('has_cough', False))).lower() == 'true' if isinstance(request.data.get('hasCough', None), str) else (request.data.get('hasCough', flags.get('has_cough', False)) or False),
            'has_headache': request.data.get('hasHeadaches', str(flags.get('has_headache', False))).lower() == 'true' if isinstance(request.data.get('hasHeadaches', None), str) else (request.data.get('hasHeadaches', flags.get('has_headache', False)) or False),
            'can_smell': request.data.get('canSmellTaste', str(flags.get('can_smell', True))).lower() == 'true' if isinstance(request.data.get('canSmellTaste', None), str) else (request.data.get('canSmellTaste', flags.get('can_smell', True)) if request.data.get('canSmellTaste', None) is not None else flags.get('can_smell', True)),
            'age': float(age),
            'gender': gender,
            'has_pneumonia': bool(has_pneumonia_flag)
        }

        fused = calculate(**params)
        fused['age'] = age
        fused['derivedSymptoms'] = extracted
        fused['imaging'] = {'pneumoniaPositive': bool(has_pneumonia_flag)}
        return Response(fused, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)