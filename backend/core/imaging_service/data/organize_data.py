#!/usr/bin/env python3
"""
Data Organization Helper Script

This script helps you organize your X-ray images into the correct directory structure
for training the pneumonia detection model.
"""

import os
import shutil
from pathlib import Path

def organize_data():
    """Interactive script to help organize your data"""
    
    print("=" * 60)
    print("PNEUMONIA DATA ORGANIZATION HELPER")
    print("=" * 60)
    
    # Get the data directory
    data_dir = os.path.join(os.path.dirname(__file__))
    
    print(f"Data directory: {data_dir}")
    print("\nDirectory structure:")
    print("data/")
    print("├── train/")
    print("│   ├── normal/          # Put normal X-ray images here")
    print("│   └── pneumonia/       # Put pneumonia X-ray images here")
    print("└── validation/")
    print("    ├── normal/          # Put normal X-ray images here")
    print("    └── pneumonia/       # Put pneumonia X-ray images here")
    
    print("\n" + "=" * 60)
    print("INSTRUCTIONS")
    print("=" * 60)
    
    print("1. Copy your NORMAL X-ray images to:")
    print(f"   {os.path.join(data_dir, 'train', 'normal')}")
    print(f"   {os.path.join(data_dir, 'validation', 'normal')}")
    
    print("\n2. Copy your PNEUMONIA X-ray images to:")
    print(f"   {os.path.join(data_dir, 'train', 'pneumonia')}")
    print(f"   {os.path.join(data_dir, 'validation', 'pneumonia')}")
    
    print("\n3. Recommended split:")
    print("   - 80% of images go to 'train' folder")
    print("   - 20% of images go to 'validation' folder")
    
    print("\n4. Supported image formats:")
    print("   - .jpg, .jpeg, .png, .bmp, .tiff")
    
    print("\n5. After organizing, run training with:")
    print("   python train_model.py")
    print("   And use this path: backend/core/imaging_service/data")
    
    # Check if directories exist
    print("\n" + "=" * 60)
    print("CURRENT STATUS")
    print("=" * 60)
    
    directories = [
        os.path.join(data_dir, 'train', 'normal'),
        os.path.join(data_dir, 'train', 'pneumonia'),
        os.path.join(data_dir, 'validation', 'normal'),
        os.path.join(data_dir, 'validation', 'pneumonia')
    ]
    
    for directory in directories:
        if os.path.exists(directory):
            # Count images in directory
            image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']
            image_count = 0
            for ext in image_extensions:
                image_count += len(list(Path(directory).glob(f'*{ext}')))
                image_count += len(list(Path(directory).glob(f'*{ext.upper()}')))
            
            print(f"✅ {directory}: {image_count} images")
        else:
            print(f"❌ {directory}: Directory not found")
    
    print("\n" + "=" * 60)
    print("QUICK COPY COMMANDS")
    print("=" * 60)
    
    print("If you have images in a folder called 'my_images', you can use these commands:")
    print("\n# Copy normal images (replace 'my_images/normal' with your actual path)")
    print(f"cp /path/to/your/normal/images/* {os.path.join(data_dir, 'train', 'normal')}")
    print(f"cp /path/to/your/normal/images/* {os.path.join(data_dir, 'validation', 'normal')}")
    
    print("\n# Copy pneumonia images (replace 'my_images/pneumonia' with your actual path)")
    print(f"cp /path/to/your/pneumonia/images/* {os.path.join(data_dir, 'train', 'pneumonia')}")
    print(f"cp /path/to/your/pneumonia/images/* {os.path.join(data_dir, 'validation', 'pneumonia')}")

if __name__ == "__main__":
    organize_data()

