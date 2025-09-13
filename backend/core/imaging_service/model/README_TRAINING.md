# Pneumonia Model Training Guide

This guide will help you train a new pneumonia detection model with the same architecture as your existing model.

## Files Created

1. **`inspect_model.py`** - Inspects your existing model architecture
2. **`train_model.py`** - Trains a new model with the same architecture
3. **`README_TRAINING.md`** - This guide

## Quick Start

### 1. Inspect Your Existing Model

First, let's see what your current model looks like:

```bash
cd backend/core/imaging_service/model
python inspect_model.py
```

This will show you:
- Model architecture (layers, parameters)
- Optimizer used
- Loss function
- Activation functions
- All layer details

### 2. Prepare Your Data

Organize your new training data in this structure:

```
your_data_directory/
├── train/
│   ├── normal/          # Normal X-ray images
│   └── pneumonia/       # Pneumonia X-ray images
└── validation/
    ├── normal/          # Normal X-ray images
    └── pneumonia/       # Pneumonia X-ray images
```

**Important Notes:**
- Images will be automatically resized to 150x150 pixels
- Images will be converted to grayscale
- Images will be normalized to 0-1 range
- Use common image formats: .jpg, .jpeg, .png, .bmp

### 3. Train the New Model

Run the training script:

```bash
cd backend/core/imaging_service/model
python train_model.py
```

The script will:
- Ask for your training data directory path
- Ask for your validation data directory path
- Ask for number of epochs (default: 50)
- Ask for batch size (default: 32)
- Create a new model with the same architecture as your existing one
- Train the model on your new data
- Save the new model as `pneumonia_model_new.keras`
- Show training progress and create plots

## What the Training Script Does

### Model Creation
1. **First**: Tries to replicate your existing model architecture exactly
2. **Fallback**: If that fails, creates a standard CNN architecture suitable for medical imaging

### Data Processing
- **Training**: Uses data augmentation (rotation, zoom, flip, etc.) to increase dataset diversity
- **Validation**: No augmentation, just normalization
- **Preprocessing**: Resize to 150x150, convert to grayscale, normalize to 0-1

### Training Features
- **Early Stopping**: Stops if validation loss doesn't improve for 10 epochs
- **Learning Rate Reduction**: Reduces learning rate if validation loss plateaus
- **Model Checkpointing**: Saves the best model based on validation accuracy
- **Progress Monitoring**: Shows training progress and creates visualization plots

### Output Files
- **`pneumonia_model_new.keras`**: Your new trained model
- **`training_history.png`**: Training progress plots

## Using Your New Model

After training, you can use your new model by updating the model path in your prediction code:

```python
# In model_loader.py, change:
model_path = os.path.join(os.path.dirname(__file__), 'pneumonia_model_new.keras')
```

## Example Usage

```bash
# 1. Inspect existing model
python inspect_model.py

# 2. Train new model
python train_model.py
# Enter: /path/to/your/train/data
# Enter: /path/to/your/validation/data
# Enter: 50 (epochs)
# Enter: 32 (batch size)

# 3. Your new model will be saved as pneumonia_model_new.keras
```

## Troubleshooting

### Common Issues

1. **"No existing model found"**
   - Make sure `pneumonia_model.keras` exists in the same directory
   - The script will create a standard CNN if the existing model can't be loaded

2. **"Directory not found"**
   - Check your data directory paths
   - Make sure the directory structure matches the required format

3. **"Out of memory"**
   - Reduce batch size (try 16 or 8)
   - Reduce image size if needed

4. **"No images found"**
   - Check that your directories contain image files
   - Make sure subdirectories are named 'normal' and 'pneumonia'

### Performance Tips

- **More data = better model**: The more images you have, the better your model will be
- **Balanced dataset**: Try to have roughly equal numbers of normal and pneumonia images
- **Quality images**: Use clear, high-quality X-ray images
- **Monitor training**: Watch for overfitting (training accuracy much higher than validation accuracy)

## Model Architecture Details

The script will create a model with the same architecture as your existing one, which typically includes:

- **Convolutional Layers**: For feature extraction
- **Pooling Layers**: For dimensionality reduction
- **Dropout Layers**: For preventing overfitting
- **Dense Layers**: For final classification
- **Activation Functions**: ReLU for hidden layers, Sigmoid for output
- **Optimizer**: Same as your existing model (usually Adam)
- **Loss Function**: Binary crossentropy for binary classification

## Next Steps

After training:
1. Test your new model on some sample images
2. Compare performance with your original model
3. If satisfied, replace the old model with the new one
4. Update your application to use the new model

Good luck with your training! 🚀

