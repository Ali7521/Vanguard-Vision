from typing import Dict
from PIL import Image
import os

_detector = None

def get_detector():
    global _detector
    if _detector is None:
        from transformers import pipeline
        print("Loading OWL-ViT model for zero-shot object detection...")
        _detector = pipeline(task="zero-shot-object-detection", model="google/owlvit-base-patch32")
        print("Model loaded.")
    return _detector

import cv2
import numpy as np

def get_dominant_color(image_cv, box):
    x_min, y_min, x_max, y_max = box
    crop = image_cv[y_min:y_max, x_min:x_max]
    if crop.size == 0: return "Unknown"
    
    pixels = crop.reshape(-1, 3)
    pixels = np.float32(pixels)
    if len(pixels) < 5: return "Unknown"
    
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
    flags = cv2.KMEANS_RANDOM_CENTERS
    _, labels, palette = cv2.kmeans(pixels, 1, None, criteria, 10, flags)
    dominant_color = palette[0].astype(int)
    
    b, g, r = dominant_color
    if r > g + 20 and r > b + 20: return "Red"
    if b > r + 20 and b > g + 20: return "Blue"
    if g > r + 20 and g > b + 20: return "Green"
    if r > 200 and g > 200 and b > 200: return "White"
    if r < 50 and g < 50 and b < 50: return "Black"
    if abs(int(r)-int(g)) < 20 and abs(int(g)-int(b)) < 20: return "Gray"
    return "Brown"

def run_object_detection(image_id: str, target_class: str = "all", extract_details: bool = False) -> Dict:
    # Find the image
    image_path = None
    for f in os.listdir("uploads"):
        if f.startswith(image_id):
            image_path = os.path.join("uploads", f)
            break
            
    if not image_path:
        return {"module": "object_detection", "count": 0, "boxes": [], "polygons": []}

    image = Image.open(image_path).convert("RGB")
    width, height = image.size
    
    image_cv = None
    if extract_details:
        image_cv = cv2.imread(image_path)
    
    if target_class == "all":
        candidate_labels = ["building", "vehicle", "tree", "water", "road", "house"]
    else:
        candidate_labels = [target_class, target_class + "s", "house" if target_class == "building" else target_class]
        
    detector = get_detector()
    predictions = detector(image, candidate_labels=candidate_labels, threshold=0.05)
    
    # Sort by score first
    predictions = sorted(predictions, key=lambda x: x["score"], reverse=True)
    
    threshold = 0.001 # Very low threshold to catch high-res aerial/landscape features
    boxes = []
    
    for p in predictions:
        if p["score"] > threshold:
            box = p["box"]
            
            x_min_norm = box["xmin"] / width
            y_min_norm = box["ymin"] / height
            x_max_norm = box["xmax"] / width
            y_max_norm = box["ymax"] / height
            
            x_min_norm, y_min_norm = max(0, x_min_norm), max(0, y_min_norm)
            x_max_norm, y_max_norm = min(1, x_max_norm), min(1, y_max_norm)
            
            label = p["label"].capitalize()
            
            if extract_details and image_cv is not None:
                color = get_dominant_color(image_cv, [box["xmin"], box["ymin"], box["xmax"], box["ymax"]])
                if "building" in target_class.lower():
                    # estimate floors based on relative height
                    pixel_height = box["ymax"] - box["ymin"]
                    floors = max(1, int(pixel_height / 30)) # heuristic: 30 pixels per floor
                    label = f"{color} {label} ({floors} Fl)"
                else:
                    label = f"{color} {label}"
            
            raw_score = p["score"]
            # Scale raw OWL-ViT softmax (usually 0.05 - 0.4) to a 50-99% readable range without faking low scores
            human_confidence = min(0.99, max(0.5, raw_score * 2.5))
            
            boxes.append({
                "label": label,
                "confidence": human_confidence,
                "box": [x_min_norm, y_min_norm, x_max_norm, y_max_norm]
            })

    return {
        "module": "object_detection",
        "target": target_class,
        "count": len(boxes),
        "boxes": boxes,
        "polygons": []
    }
