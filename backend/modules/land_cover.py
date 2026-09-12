from typing import Dict
from PIL import Image
import os
import torch
import numpy as np
import cv2

_processor = None
_model = None

def get_clipseg():
    global _processor, _model
    if _model is None:
        from transformers import CLIPSegProcessor, CLIPSegForImageSegmentation
        print("Loading CLIPSeg...")
        _processor = CLIPSegProcessor.from_pretrained("CIDAS/clipseg-rd64-refined")
        _model = CLIPSegForImageSegmentation.from_pretrained("CIDAS/clipseg-rd64-refined")
        print("CLIPSeg loaded.")
    return _processor, _model

def run_land_cover(image_id: str) -> Dict:
    image_path = None
    for f in os.listdir("uploads"):
        if f.startswith(image_id):
            image_path = os.path.join("uploads", f)
            break
            
    if not image_path:
        return {"module": "land_cover", "polygons": [], "boxes": []}

    image = Image.open(image_path).convert("RGB")
    width, height = image.size
    
    prompts = ["water", "vegetation", "urban area"]
    colors = ["rgba(59, 130, 246, 0.4)", "rgba(34, 197, 94, 0.4)", "rgba(107, 114, 128, 0.4)"]
    
    processor, model = get_clipseg()
    inputs = processor(text=prompts, images=[image] * len(prompts), padding="max_length", return_tensors="pt")
    
    with torch.no_grad():
        outputs = model(**inputs)
        preds = outputs.logits.unsqueeze(1)
        
    polygons = []
    
    for idx, prompt in enumerate(prompts):
        pred_numpy = torch.sigmoid(preds[idx][0]).numpy()
        mask_small = (pred_numpy > 0.4).astype(np.uint8) * 255
        
        mask = cv2.resize(mask_small, (width, height), interpolation=cv2.INTER_NEAREST)
        pred_resized = cv2.resize(pred_numpy, (width, height), interpolation=cv2.INTER_LINEAR)
        
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        for cnt in contours:
            if cv2.contourArea(cnt) > (width * height * 0.02):
                epsilon = 0.005 * cv2.arcLength(cnt, True)
                approx = cv2.approxPolyDP(cnt, epsilon, True)
                
                points = []
                for p in approx:
                    x = float(p[0][0]) / width
                    y = float(p[0][1]) / height
                    points.append([x, y])
                
                if len(points) >= 3:
                    # Calculate true confidence inside this contour
                    contour_mask = np.zeros((height, width), dtype=np.uint8)
                    cv2.drawContours(contour_mask, [cnt], -1, 255, -1)
                    mean_conf = float(pred_resized[contour_mask == 255].mean())
                    
                    polygons.append({
                        "label": prompt.capitalize(),
                        "confidence": round(mean_conf, 2),
                        "color": colors[idx],
                        "points": points
                    })
                    
    return {
        "module": "land_cover",
        "polygons": polygons,
        "boxes": []
    }
