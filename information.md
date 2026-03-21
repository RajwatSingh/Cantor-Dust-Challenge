# Training Split

Train: 70% = ~3,232 images
Validation: 15% = ~692 images  
Test: 15% = ~694 images

I used 70/15/15 because with 4,618 images, this gives enough training data while ensuring robust validation and test sets

## Data Leakage

1. Duplicate image
Problem: Exact same image appears in both train and test
Why it's bad: Model has already seen the answer

2. Near Duplicates
Problem: Very similar images (slightly rotated, cropped, brightness adjusted)
Why it's bad: Model recognizes the specific scan, not the medical features
Example: Same CT scan saved as .jpg and .png

3. Patient Level Leakage
Problem: Multiple scans from same patient split across train/test
Why it's bad: Model learns patient-specific features, not generalizable patterns

4. Temporal Leakage
Problem: Images from same scanning session split across sets
Why it's bad: Scanner settings, patient positioning remain constant

## How we will prevent leakage

1. Stratified Random Split
`
train_val_paths, test_paths, train_val_labels, test_labels = train_test_split(
    image_paths, labels, 
    test_size=0.15,          # 15% for test
    random_state=42,         # Reproducible (same split every time)
    stratify=labels          # Maintains class balance in each split
)
`
What `stratify=labels` does:

Ensures each split has similar proportions of Healthy vs Tumor
Example: If overall dataset is 50/50, each split will also be ~50/50
Why: Prevents one split from being mostly tumors and another mostly healthy

2. Check for Duplicates
`
# Check for duplicate filenames
from collections import Counter
filenames = [os.path.basename(p) for p in image_paths]
duplicates = [name for name, count in Counter(filenames).items() if count > 1]
if duplicates:
    print("Error Message")
`

What split you chose and why
"I used 70/15/15 because with 4,618 images, this gives enough training data while ensuring robust validation and test sets"

How you prevented leakage
"I used stratified random sampling with a fixed random seed (42) for reproducibility"
"I verified no duplicate filenames exist across splits"
"Test set remained completely untouched until final evaluation"

What risks remain
"Potential risk: If multiple scans from same patient exist under different filenames, patient-level leakage could occur"
"Mitigation: In production, would implement patient-ID tracking and patient-level splitting"

