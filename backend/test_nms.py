from PIL import Image
from transformers import pipeline
import os

image_path = "uploads/ff083bd5-4b6e-4ee8-8a92-593e7bdccd7d.jpg"
image = Image.open(image_path).convert("RGB")
detector = pipeline(task="zero-shot-object-detection", model="google/owlvit-base-patch32")
predictions = detector(image, candidate_labels=["building", "buildings", "house"], threshold=0.01)
print(f"Total predictions found: {len(predictions)}")
