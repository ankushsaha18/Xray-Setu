#!/usr/bin/env python3
"""
Automated Model Training Script

This script automates the training process with predefined parameters.
"""

import os
import sys

# Add the parent directory to the path so we can import the trainer
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from train_model import PneumoniaModelTrainer

def main():
    """Main function to run the automated training"""
    
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
    
    # Training parameters (reduced for testing)
    epochs = 5  # Reduced from 50 for testing
    batch_size = 16  # Reduced from 32 for memory constraints
    
    print(f"Epochs: {epochs}")
    print(f"Batch size: {batch_size}")
    
    # Train the model
    print("\nStarting training process...")
    result = trainer.train_model(
        train_dir=train_dir,
        validation_dir=validation_dir,
        epochs=epochs,
        batch_size=batch_size
    )
    
    if result is not None:
        model, history = result
        print(f"\nTraining completed! Model saved to: {trainer.new_model_path}")
        print("You can now use this model for predictions.")
        return True
    else:
        print("Training failed. Please check your data and try again.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)