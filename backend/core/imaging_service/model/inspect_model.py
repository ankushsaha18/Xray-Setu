import os
import tensorflow as tf

def inspect_existing_model():
    """Quick inspection of the existing model"""
    model_path = os.path.join(os.path.dirname(__file__), 'pneumonia_model.keras')
    
    if not os.path.exists(model_path):
        print(f"Model not found at {model_path}")
        return
    
    try:
        model = tf.keras.models.load_model(model_path)
        
        print("=" * 60)
        print("PNEUMONIA MODEL ARCHITECTURE")
        print("=" * 60)
        model.summary()
        
        print("\n" + "=" * 60)
        print("TRAINING CONFIGURATION")
        print("=" * 60)
        print(f"Optimizer: {model.optimizer}")
        print(f"Loss: {model.loss}")
        print(f"Metrics: {model.metrics_names}")
        
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
        
    except Exception as e:
        print(f"Error loading model: {str(e)}")

if __name__ == "__main__":
    inspect_existing_model()

