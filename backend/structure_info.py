import os
import pandas as pd
import matplotlib.pyplot as plt
from PIL import Image
import numpy as np
from collections import Counter
import seaborn as sns

# Dataset paths - note the spaces in folder names
CT_PATH = "data/Brain Tumor CT scan Images"
MRI_PATH = "data/Brain Tumor MRI images"

# Let's analyze CT dataset
DATA_PATH = CT_PATH

print("="*60)
print("DATASET ANALYSIS: CT Brain Tumor Images")
print("="*60)

classes = ['Healthy', 'Tumor']
class_counts = {}

for class_name in classes:
    class_path = os.path.join(DATA_PATH, class_name)
    print(f"\nChecking: {class_path}")
    
    if os.path.exists(class_path):
        all_files = os.listdir(class_path)
        images = [f for f in all_files 
                 if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        class_counts[class_name] = len(images)
        print(f"Found {len(images)} images (out of {len(all_files)} total files)")
    else:
        print(f"   Directory not found: {class_path}")
        class_counts[class_name] = 0

total = sum(class_counts.values())
print(f"\n{'='*60}")
print(f"SUMMARY")
print(f"{'='*60}")
print(f"Total images: {total}")

if total > 0:
    print(f"\nClass distribution:")
    for class_name, count in class_counts.items():
        percentage = (count / total) * 100
        print(f"  {class_name}: {count} images ({percentage:.1f}%)")
    
else:
    print("\nNo images found! Please check:")
    print("1. Dataset path is correct")
    print("2. Images are in 'Healthy' and 'Tumor' subdirectories")
    print("3. Image files have .jpg, .jpeg, or .png extensions")
