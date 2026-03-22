# Cantor-Dust-Challenge
## Overview
End-to-end AI application for brain tumor image classification using fine-tuned vision models.


## Architecture
_(To be completed)_

## Setup Instructions
_(To be completed)_

## Model Information
- Base Model: _(TBD)_
- Version: v0.1.0
- Dataset: Kaggle Brain Tumor Multimodal Images

## Model Performance

**Architecture:** EfficientNet-B0 (pretrained on ImageNet)
**Training Details:**
- Epochs: 15 (best model saved at epoch 13)
- Optimizer: Adam (lr=0.0001)
- Loss: CrossEntropyLoss
- Training time: ~3.5 hours

**Results:**
- Best Validation Accuracy: 98.55%
- Final Training Accuracy: 99.78%
- Training Loss: 0.0179
- Validation Loss: 0.0513

**Observations:**
- Strong transfer learning from pretrained weights (90% acc in epoch 1)
- Minimal overfitting (~1.5% train-val gap)
- Saved best model at epoch 13 for deployment

## Evaluation Metrics
_(To be completed)_

## Assumptions and Limitations
_(To be documented during development)_

## Tradeoffs
_(To be documented during development)_

## Demo
_(Link to video will be added)_
