#!/usr/bin/env python3
"""
Model Evaluation Script

This script evaluates the trained model's performance on the validation dataset.
"""

import os
import sys
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns

# Add the parent directory to the path so we can import the trainer
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from train_model import PneumoniaModelTrainer

def evaluate_model():
    """Evaluate the trained model on validation data"""
    
    print("=" * 60)
    print("MODEL EVALUATION")
    print("=" * 60)
    
    # Initialize trainer
    trainer = PneumoniaModelTrainer()
    
    # Define data directories
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    train_dir = os.path.join(data_dir, 'train')
    validation_dir = os.path.join(data_dir, 'validation')
    
    # Check if directories exist
    if not os.path.exists(train_dir):
        print(f"Training directory not found: {train_dir}")
        return False
    
    if not os.path.exists(validation_dir):
        print(f"Validation directory not found: {validation_dir}")
        return False
    
    print(f"Training directory: {train_dir}")
    print(f"Validation directory: {validation_dir}")
    
    # Check if model exists
    if not os.path.exists(trainer.new_model_path):
        print(f"Model file not found: {trainer.new_model_path}")
        return False
    
    try:
        # Load the trained model
        print("\nLoading trained model...")
        model = load_model(trainer.new_model_path)
        print("✅ Model loaded successfully!")
        
        # Prepare validation data generator
        print("\nPreparing validation data...")
        validation_datagen = ImageDataGenerator(rescale=1./255)
        
        validation_generator = validation_datagen.flow_from_directory(
            validation_dir,
            target_size=(150, 150),
            batch_size=32,
            class_mode='binary',
            color_mode='grayscale',
            shuffle=False  # Important for evaluation
        )
        
        # Evaluate the model
        print("\nEvaluating model on validation data...")
        loss, accuracy = model.evaluate(validation_generator)
        
        print(f"\n{'='*60}")
        print("MODEL PERFORMANCE METRICS")
        print(f"{'='*60}")
        print(f"Validation Loss: {loss:.4f}")
        print(f"Validation Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
        
        # Get predictions
        print("\nGenerating predictions...")
        validation_generator.reset()
        predictions = model.predict(validation_generator, verbose=1)
        predicted_classes = (predictions > 0.5).astype(int).flatten()
        
        # Get true classes
        true_classes = validation_generator.classes
        class_labels = list(validation_generator.class_indices.keys())
        
        # Classification report
        print(f"\n{'='*60}")
        print("CLASSIFICATION REPORT")
        print(f"{'='*60}")
        report = classification_report(true_classes, predicted_classes, 
                                     target_names=class_labels, output_dict=True)
        print(f"Precision (Normal): {report['normal']['precision']:.4f}")
        print(f"Recall (Normal): {report['normal']['recall']:.4f}")
        print(f"F1-Score (Normal): {report['normal']['f1-score']:.4f}")
        print(f"")
        print(f"Precision (Pneumonia): {report['pneumonia']['precision']:.4f}")
        print(f"Recall (Pneumonia): {report['pneumonia']['recall']:.4f}")
        print(f"F1-Score (Pneumonia): {report['pneumonia']['f1-score']:.4f}")
        print(f"")
        print(f"Overall Accuracy: {report['accuracy']:.4f}")
        print(f"Macro Average F1-Score: {report['macro avg']['f1-score']:.4f}")
        
        # Confusion Matrix
        print(f"\n{'='*60}")
        print("CONFUSION MATRIX")
        print(f"{'='*60}")
        cm = confusion_matrix(true_classes, predicted_classes)
        print("Confusion Matrix:")
        print(cm)
        
        # Plot confusion matrix
        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                   xticklabels=class_labels, yticklabels=class_labels)
        plt.title('Confusion Matrix')
        plt.xlabel('Predicted Label')
        plt.ylabel('True Label')
        plt.tight_layout()
        plt.savefig(os.path.join(os.path.dirname(__file__), 'confusion_matrix.png'))
        plt.show()
        
        # Show some sample predictions
        print(f"\n{'='*60}")
        print("SAMPLE PREDICTIONS")
        print(f"{'='*60}")
        # Get a few sample predictions
        for i in range(min(10, len(predictions))):
            true_label = class_labels[true_classes[i]]
            predicted_label = class_labels[predicted_classes[i]]
            confidence = predictions[i][0] if predicted_classes[i] == 1 else 1 - predictions[i][0]
            
            status = "✅" if true_classes[i] == predicted_classes[i] else "❌"
            print(f"{status} Sample {i+1}: True={true_label}, Predicted={predicted_label}, Confidence={confidence:.4f}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error evaluating model: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = evaluate_model()
    if success:
        print("\n🎉 Model evaluation completed successfully!")
    else:
        print("\n💥 Model evaluation failed!")
        sys.exit(1)