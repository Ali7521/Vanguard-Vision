from PIL import Image
from transformers import pipeline
import os

image_path = "uploads/cce60941-6f6b-41f9-8438-cf582940315e.jpg"
image = Image.open(image_path).convert("RGB")
detector = pipeline(task="zero-shot-object-detection", model="google/owlvit-base-patch32")
predictions = detector(image, candidate_labels=["building", "buildings", "house"], threshold=0.001)
print(f"Total predictions found: {len(predictions)}")
for p in sorted(predictions, key=lambda x: x['score'], reverse=True)[:10]:
    print(f"{p['label']}: {p['score']}")
