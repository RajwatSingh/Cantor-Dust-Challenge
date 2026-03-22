import torch
import numpy as np
from sklearn.model_selection import train_test_split
from datetime import datetime
import json
import os

def create_split(image_paths, labels, save_dir='../models'):
    train_val_paths, test_paths, train_val_labels, test_labels = train_test_split(
        image_paths, labels,
        test_size = 0.15,
        random_state = 42,
        stratify = labels
    )

    train_paths, val_paths, train_labels, val_labels = train_test_split(
        train_val_paths, train_val_labels,
        test_size = 0.176,
        random_state = 42,
        stratify = train_val_labels
    )

    print(f"Train: {len(train_paths)} ({len(train_paths)/len(image_paths)*100:.1f}%)")
    print(f"Val: {len(val_paths)} ({len(val_paths)/len(image_paths)*100:.1f}%)")
    print(f"Test: {len(test_paths)} ({len(test_paths)/len(image_paths)*100:.1f}%)")

    print(f"Train distribution: {np.bincount(train_labels)}")
    print(f"Val distribution: {np.bincount(val_labels)}")
    print(f"Test distribution: {np.bincount(test_labels)}")

    split_info = {
        'train_paths': train_paths,
        'val_paths': val_paths,
        'test_paths': test_paths,
        'train_size': len(train_paths),
        'val_size': len(val_paths),
        'test_size': len(test_paths),
        'random_seed': 42,
        'train_distribution': np.bincount(train_labels).tolist(),
        'val_distribution': np.bincount(val_labels).tolist(),
        'test_distribution': np.bincount(test_labels).tolist()
    }

    os.makedirs(save_dir, exist_ok = True)
    with open(os.path.join(save_dir, 'data_splits.json'), 'w') as f:
        json.dump(split_info, f, indent=2)

    return train_paths, val_paths, test_paths, train_labels, val_labels, test_labels
