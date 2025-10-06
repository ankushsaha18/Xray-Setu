import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
import numpy as np
import matplotlib.pyplot as plt
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Enable eager execution
tf.config.run_functions_eagerly(True)

class PneumoniaModelTrainer:
    def __init__(self, model_dir=None):
        self.model_dir = model_dir or os.path.dirname(__file__)
        self.existing_model_path = os.path.join(self.model_dir, 'pneumonia_model.keras')
        self.new_model_path = os.path.join(self.model_dir, 'pneumonia_model_new.keras')
        
    def inspect_existing_model(self):
        """Inspect the existing model to understand its architecture"""
        try:
            if not os.path.exists(self.existing_model_path):
                logger.error(f"Existing model not found at {self.existing_model_path}")
                return None
                
            model = tf.keras.models.load_model(self.existing_model_path)
            
            print("=" * 60)
            print("EXISTING MODEL ARCHITECTURE")
            print("=" * 60)
            model.summary()
            
            print("\n" + "=" * 60)
            print("TRAINING CONFIGURATION")
            print("=" * 60)
            print(f"Optimizer: {model.optimizer}")
            print(f"Loss: {model.loss}")
            print(f"Metrics: {model.metrics_names}")
            
            # Get layer configuration
            config = model.get_config()
            self.model_config = config
            
            print("\n" + "=" * 60)
            print("LAYER DETAILS")
            print("=" * 60)
            
            for i, layer in enumerate(model.layers):
                print(f"\nLayer {i}: {layer.name}")
                print(f"  Type: {type(layer).__name__}")
                if hasattr(layer, 'activation') and layer.activation is not None:
                    print(f"  Activation: {layer.activation}")
                if hasattr(layer, 'units'):
                    print(f"  Units: {layer.units}")
                if hasattr(layer, 'filters'):
                    print(f"  Filters: {layer.filters}")
                if hasattr(layer, 'kernel_size'):
                    print(f"  Kernel Size: {layer.kernel_size}")
                if hasattr(layer, 'pool_size'):
                    print(f"  Pool Size: {layer.pool_size}")
                if hasattr(layer, 'dropout_rate'):
                    print(f"  Dropout Rate: {layer.dropout_rate}")
            
            return model
            
        except Exception as e:
            logger.error(f"Error inspecting existing model: {str(e)}")
            return None
    
    def create_model_from_existing(self):
        """Create a new model with the same architecture as the existing one"""
        try:
            # Load existing model to get architecture
            existing_model = tf.keras.models.load_model(self.existing_model_path)
            config = existing_model.get_config()
            
            # Create new model with same architecture
            new_model = tf.keras.models.Sequential.from_config(config)
            
            # Compile with fresh optimizer settings
            new_model.compile(
                optimizer=Adam(learning_rate=0.001),
                loss='binary_crossentropy',
                metrics=['accuracy']
            )
            
            print("=" * 60)
            print("NEW MODEL CREATED WITH SAME ARCHITECTURE")
            print("=" * 60)
            new_model.summary()
            
            return new_model
            
        except Exception as e:
            logger.error(f"Error creating model from existing: {str(e)}")
            return None
    
    def create_standard_cnn_model(self):
        """Create a standard CNN model for pneumonia detection (if existing model fails)"""
        model = Sequential([
            # First Convolutional Block
            Conv2D(32, (3, 3), activation='relu', input_shape=(150, 150, 1)),
            BatchNormalization(),
            MaxPooling2D(2, 2),
            Dropout(0.25),
            
            # Second Convolutional Block
            Conv2D(64, (3, 3), activation='relu'),
            BatchNormalization(),
            MaxPooling2D(2, 2),
            Dropout(0.25),
            
            # Third Convolutional Block
            Conv2D(128, (3, 3), activation='relu'),
            BatchNormalization(),
            MaxPooling2D(2, 2),
            Dropout(0.25),
            
            # Fourth Convolutional Block
            Conv2D(256, (3, 3), activation='relu'),
            BatchNormalization(),
            MaxPooling2D(2, 2),
            Dropout(0.25),
            
            # Flatten and Dense layers
            Flatten(),
            Dense(512, activation='relu'),
            BatchNormalization(),
            Dropout(0.5),
            Dense(256, activation='relu'),
            Dropout(0.5),
            Dense(1, activation='sigmoid')  # Binary classification
        ])
        
        # Compile the model
        model.compile(
            optimizer=Adam(learning_rate=0.001),
            loss='binary_crossentropy',
            metrics=['accuracy', 'precision', 'recall']
        )
        
        print("=" * 60)
        print("STANDARD CNN MODEL CREATED")
        print("=" * 60)
        model.summary()
        
        return model
    
    def prepare_data_generators(self, train_dir, validation_dir, batch_size=32):
        """Prepare data generators for training and validation"""
        
        # Data augmentation for training
        train_datagen = ImageDataGenerator(
            rescale=1./255,
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2,
            horizontal_flip=True,
            zoom_range=0.2,
            shear_range=0.2,
            fill_mode='nearest'
        )
        
        # No augmentation for validation
        validation_datagen = ImageDataGenerator(rescale=1./255)
        
        # Create generators
        train_generator = train_datagen.flow_from_directory(
            train_dir,
            target_size=(150, 150),
            batch_size=batch_size,
            class_mode='binary',
            color_mode='grayscale'
        )
        
        validation_generator = validation_datagen.flow_from_directory(
            validation_dir,
            target_size=(150, 150),
            batch_size=batch_size,
            class_mode='binary',
            color_mode='grayscale'
        )
        
        return train_generator, validation_generator
    
    def train_model(self, train_dir, validation_dir, epochs=50, batch_size=32):
        """Train the model on new data"""
        
        # Always create standard CNN model to avoid optimizer issues
        logger.info("Creating standard CNN model...")
        model = self.create_standard_cnn_model()
        
        if model is None:
            logger.error("Failed to create model")
            return None
        
        # Prepare data generators
        train_generator, validation_generator = self.prepare_data_generators(
            train_dir, validation_dir, batch_size
        )
        
        # Callbacks
        callbacks = [
            EarlyStopping(
                monitor='val_loss',
                patience=10,
                restore_best_weights=True
            ),
            ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=5,
                min_lr=1e-7
            ),
            ModelCheckpoint(
                self.new_model_path,
                monitor='val_accuracy',
                save_best_only=True,
                save_weights_only=False
            )
        ]
        
        # Train the model
        print("=" * 60)
        print("STARTING TRAINING")
        print("=" * 60)
        
        history = model.fit(
            train_generator,
            steps_per_epoch=train_generator.samples // batch_size,
            epochs=epochs,
            validation_data=validation_generator,
            validation_steps=validation_generator.samples // batch_size,
            callbacks=callbacks,
            verbose=1
        )
        
        # Plot training history
        self.plot_training_history(history)
        
        # Save final model
        model.save(self.new_model_path)
        logger.info(f"Model saved to {self.new_model_path}")
        
        return model, history
    
    def plot_training_history(self, history):
        """Plot training history"""
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        
        # Accuracy
        axes[0, 0].plot(history.history['accuracy'], label='Training Accuracy')
        axes[0, 0].plot(history.history['val_accuracy'], label='Validation Accuracy')
        axes[0, 0].set_title('Model Accuracy')
        axes[0, 0].set_xlabel('Epoch')
        axes[0, 0].set_ylabel('Accuracy')
        axes[0, 0].legend()
        
        # Loss
        axes[0, 1].plot(history.history['loss'], label='Training Loss')
        axes[0, 1].plot(history.history['val_loss'], label='Validation Loss')
        axes[0, 1].set_title('Model Loss')
        axes[0, 1].set_xlabel('Epoch')
        axes[0, 1].set_ylabel('Loss')
        axes[0, 1].legend()
        
        # Precision
        if 'precision' in history.history:
            axes[1, 0].plot(history.history['precision'], label='Training Precision')
            axes[1, 0].plot(history.history['val_precision'], label='Validation Precision')
            axes[1, 0].set_title('Model Precision')
            axes[1, 0].set_xlabel('Epoch')
            axes[1, 0].set_ylabel('Precision')
            axes[1, 0].legend()
        
        # Recall
        if 'recall' in history.history:
            axes[1, 1].plot(history.history['recall'], label='Training Recall')
            axes[1, 1].plot(history.history['val_recall'], label='Validation Recall')
            axes[1, 1].set_title('Model Recall')
            axes[1, 1].set_xlabel('Epoch')
            axes[1, 1].set_ylabel('Recall')
            axes[1, 1].legend()
        
        plt.tight_layout()
        plt.savefig(os.path.join(self.model_dir, 'training_history.png'))
        plt.show()

def main():
    """Main function to run the training"""
    
    # Initialize trainer
    trainer = PneumoniaModelTrainer()
    
    # First, inspect the existing model
    print("Inspecting existing model...")
    existing_model = trainer.inspect_existing_model()
    
    if existing_model is None:
        print("No existing model found. Will create a standard CNN model.")
    
    # Define your data directories
    # Update these paths to your actual data directories
    train_dir = input("Enter path to training data directory: ").strip()
    validation_dir = input("Enter path to validation data directory: ").strip()
    
    # Check if directories exist
    if not os.path.exists(train_dir):
        print(f"Training directory not found: {train_dir}")
        return
    
    if not os.path.exists(validation_dir):
        print(f"Validation directory not found: {validation_dir}")
        return
    
    # Training parameters
    epochs = int(input("Enter number of epochs (default 50): ") or "50")
    batch_size = int(input("Enter batch size (default 32): ") or "32")
    
    # Train the model
    print("\nStarting training process...")
    model, history = trainer.train_model(
        train_dir=train_dir,
        validation_dir=validation_dir,
        epochs=epochs,
        batch_size=batch_size
    )
    
    if model is not None:
        print(f"\nTraining completed! Model saved to: {trainer.new_model_path}")
        print("You can now use this model for predictions.")
    else:
        print("Training failed. Please check your data and try again.")

if __name__ == "__main__":
    main()
