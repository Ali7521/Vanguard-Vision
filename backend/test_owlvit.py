from PIL import Image
from transformers import pipeline
import os

image_id = "ff083bd5" 
image_path = None
for f in os.listdir("uploads"):
    if f.endswith(".jpg") or f.endswith(".png"):
        image_path = os.path.join("uploads", f)
        break

print(f"Testing on {image_path}")
image = Image.open(image_path).convert("RGB")
detector = pipeline(task="zero-shot-object-detection", model="google/owlvit-base-patch32")
predictions = detector(image, candidate_labels=["building", "house"], threshold=0.0)
print(f"Total predictions found: {len(predictions)}")
for p in sorted(predictions, key=lambda x: x['score'], reverse=True)[:10]:
    print(f"{p['label']}: {p['score']}")
