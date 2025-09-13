#!/usr/bin/env python3
"""
Test script to verify the new trained model
"""

import os
import tensorflow as tf
import numpy as np
from tensorflow.keras.models import load_model

def test_model():
    """Test the new model"""
    model_dir = os.path.dirname(__file__)
    new_model_path = os.path.join(model_dir, 'pneumonia_model_new.keras')
    
    print("=" * 60)
    print("TESTING NEW TRAINED MODEL")
    print("=" * 60)
    
    # Check if model file exists
    if not os.path.exists(new_model_path):
        print(f"Model file not found at {new_model_path}")
        return False
    
    print(f"✅ Model file found: {new_model_path}")
    print(f"📁 Model file size: {os.path.getsize(new_model_path) / (1024*1024):.2f} MB")
    
    try:
        # Load the model
        print("\nLoading model...")
        model = load_model(new_model_path)
        
        print("✅ Model loaded successfully!")
        print(f"🧠 Model input shape: {model.input_shape}")
        print(f"📊 Model output shape: {model.output_shape}")
        
        # Test with dummy input
        print("\nTesting with dummy input...")
        dummy_input = np.random.random((1, 150, 150, 1))
        prediction = model.predict(dummy_input)
        
        print(f"✅ Prediction successful!")
        print(f"📈 Prediction result: {prediction[0][0]:.4f}")
        print(f"📊 Prediction shape: {prediction.shape}")
        
        # Model summary
        print("\n" + "=" * 60)
        print("MODEL SUMMARY")
        print("=" * 60)
        model.summary()
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing model: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_model()
    if success:
        print("\n🎉 Model test completed successfully!")
    else:
        print("\n💥 Model test failed!")