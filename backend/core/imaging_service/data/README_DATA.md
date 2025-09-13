# Data Directory Structure

This directory contains the training and validation data for the pneumonia detection model.

## Directory Structure

```
data/
├── train/
│   ├── normal/          # Normal X-ray images for training
│   └── pneumonia/       # Pneumonia X-ray images for training
├── validation/
│   ├── normal/          # Normal X-ray images for validation
│   └── pneumonia/       # Pneumonia X-ray images for validation
├── organize_data.py     # Helper script to organize your data
└── README_DATA.md       # This file
```

## How to Add Your Data

### Method 1: Manual Organization
1. Copy your **normal X-ray images** to:
   - `train/normal/` (80% of your normal images)
   - `validation/normal/` (20% of your normal images)

2. Copy your **pneumonia X-ray images** to:
   - `train/pneumonia/` (80% of your pneumonia images)
   - `validation/pneumonia/` (20% of your pneumonia images)

### Method 2: Use the Helper Script
```bash
cd backend/core/imaging_service/data
python organize_data.py
```

This will show you:
- Current directory structure
- How many images are in each folder
- Copy commands you can use
- Instructions for organizing your data

## Supported Image Formats

- `.jpg` / `.jpeg`
- `.png`
- `.bmp`
- `.tiff`

## Recommended Data Split

- **Training**: 80% of your total images
- **Validation**: 20% of your total images
- **Balanced**: Try to have roughly equal numbers of normal and pneumonia images

## Example Commands

If you have images in a folder called `my_xray_images`:

```bash
# Copy normal images
cp /path/to/my_xray_images/normal/* backend/core/imaging_service/data/train/normal/
cp /path/to/my_xray_images/normal/* backend/core/imaging_service/data/validation/normal/

# Copy pneumonia images  
cp /path/to/my_xray_images/pneumonia/* backend/core/imaging_service/data/train/pneumonia/
cp /path/to/my_xray_images/pneumonia/* backend/core/imaging_service/data/validation/pneumonia/
```

## After Adding Data

Once you've organized your data:

1. **Check your data**:
   ```bash
   cd backend/core/imaging_service/data
   python organize_data.py
   ```

2. **Start training**:
   ```bash
   cd backend/core/imaging_service/model
   python train_model.py
   # When prompted, enter: backend/core/imaging_service/data
   ```

## Data Requirements

- **Minimum**: At least 100 images per class (normal/pneumonia)
- **Recommended**: 1000+ images per class for better performance
- **Quality**: Clear, high-resolution X-ray images
- **Format**: Images will be automatically resized to 150x150 pixels and converted to grayscale

## Troubleshooting

### "No images found"
- Check that your images are in the correct subdirectories
- Make sure subdirectories are named exactly `normal` and `pneumonia`
- Verify image file extensions are supported

### "Directory not found"
- Make sure you're using the correct path when running the training script
- Use the full path: `backend/core/imaging_service/data`

### "Out of memory"
- Reduce batch size in training script
- Use fewer images for initial testing

