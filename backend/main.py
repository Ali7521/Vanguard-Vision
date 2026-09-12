from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import os
import uuid
import shutil
import time

from modules.object_detection import run_object_detection
from modules.land_cover import run_land_cover
from modules.spectral import run_spectral_analysis

app = FastAPI(title="SatQuery AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

class ChatRequest(BaseModel):
    image_id: str
    question: str

class BoundingBox(BaseModel):
    label: str
    confidence: float
    box: list[float]

class Polygon(BaseModel):
    label: str
    confidence: float
    color: str
    points: list[list[float]]

class ChatResponse(BaseModel):
    answer: str
    confidence: float
    boxes: list[BoundingBox] = []
    polygons: list[Polygon] = []

class AnalyzeRequest(BaseModel):
    image_id: str
    module: str # "object_detection", "land_cover", "ndvi", "ndwi"
    target: Optional[str] = "all"

import exifread

def get_gps_coordinates(file_path: str):
    try:
        with open(file_path, 'rb') as f:
            tags = exifread.process_file(f, details=False)
            
            def _convert_to_degrees(value):
                d = float(value.values[0].num) / float(value.values[0].den)
                m = float(value.values[1].num) / float(value.values[1].den)
                s = float(value.values[2].num) / float(value.values[2].den)
                return d + (m / 60.0) + (s / 3600.0)
                
            if 'GPS GPSLatitude' in tags and 'GPS GPSLongitude' in tags:
                lat = _convert_to_degrees(tags['GPS GPSLatitude'])
                lat_ref = str(tags.get('GPS GPSLatitudeRef', 'N'))
                if lat_ref != 'N': lat = -lat
                
                lon = _convert_to_degrees(tags['GPS GPSLongitude'])
                lon_ref = str(tags.get('GPS GPSLongitudeRef', 'E'))
                if lon_ref != 'E': lon = -lon
                
                return [lat, lon]
    except Exception:
        pass
    return None

@app.post("/api/upload")
def upload_image(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    file_extension = file.filename.split(".")[-1]
    image_id = str(uuid.uuid4())
    file_name = f"{image_id}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    gps = get_gps_coordinates(file_path)
    has_exif = True
    if not gps:
        has_exif = False
        gps = [46.5198, 6.6323] # Lausanne, Switzerland area
        
    return {
        "image_id": image_id, 
        "url": f"http://localhost:8765/uploads/{file_name}",
        "location": gps,
        "has_exif": has_exif
    }

@app.post("/api/analyze", response_model=ChatResponse)
def analyze(request: AnalyzeRequest):
    if request.module == "object_detection":
        res = run_object_detection(request.image_id, request.target or "all")
        return ChatResponse(
            answer=f"Found {res['count']} {request.target or 'objects'} in the image.",
            confidence=0.9,
            boxes=[BoundingBox(**b) for b in res["boxes"]]
        )
    elif request.module == "land_cover":
        res = run_land_cover(request.image_id)
        return ChatResponse(
            answer="Generated land cover classification mask.",
            confidence=0.92,
            polygons=[Polygon(**p) for p in res["polygons"]]
        )
    elif request.module in ["ndvi", "ndwi"]:
        res = run_spectral_analysis(request.image_id, request.module)
        return ChatResponse(
            answer=res["answer"],
            confidence=0.95
        )
    else:
        raise HTTPException(status_code=400, detail="Unknown module")


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    time.sleep(1.5)
    question_lower = request.question.lower()
    
    # Router logic
    keywords = ["building", "vehicle", "car", "truck", "floor", "color", "colour", "human", "person", "people"]
    if any(k in question_lower for k in keywords):
        target = "building"
        if "vehicle" in question_lower or "car" in question_lower or "truck" in question_lower: target = "vehicle"
        if "human" in question_lower or "person" in question_lower or "people" in question_lower: target = "person"
        
        extract_details = "floor" in question_lower or "color" in question_lower or "colour" in question_lower
        
        res = run_object_detection(request.image_id, target, extract_details=extract_details)
        
        answer = f"I detected {res['count']} {target}s based on your query."
        if extract_details and res['count'] > 0:
            answer += " I've also extracted their dominant colors and estimated the number of floors based on structure height. Check the overlay boxes!"
            
        return ChatResponse(
            answer=answer,
            confidence=0.88,
            boxes=[BoundingBox(**b) for b in res["boxes"]]
        )
    elif "land cover" in question_lower or "segment" in question_lower or "classify" in question_lower or "land" in question_lower:
        res = run_land_cover(request.image_id)
        return ChatResponse(
            answer="Here is the land cover segmentation.",
            confidence=0.9,
            polygons=[Polygon(**p) for p in res["polygons"]]
        )
    elif "ndvi" in question_lower or "health" in question_lower or "vegetation" in question_lower:
        res = run_spectral_analysis(request.image_id, "ndvi")
        return ChatResponse(answer=res["answer"], confidence=0.95)
    elif "ndwi" in question_lower or "water" in question_lower or "moisture" in question_lower:
        res = run_spectral_analysis(request.image_id, "ndwi")
        return ChatResponse(answer=res["answer"], confidence=0.95)
    else:
        # Open vocabulary zero-shot detection
        stopwords = ["find", "detect", "locate", "where", "are", "the", "a", "an", "all", "any", "is", "show", "me", "how", "many", "color", "colour", "of", "and", "in", "this", "image", "picture", "can", "you", "please", "some", "every", "everything", "thing", "that", "exist", "world", "like"]
        words = [w.strip("?.,!") for w in question_lower.split() if w.strip("?.,!") not in stopwords]
        
        if words:
            target = " ".join(words)
            res = run_object_detection(request.image_id, target, extract_details=False)
            
            if res['count'] > 0:
                answer = f"I detected {res['count']} {target}(s) based on your open-vocabulary query."
            else:
                answer = f"I scanned the image for '{target}' but couldn't find any clear matches with high confidence."
                
            return ChatResponse(
                answer=answer,
                confidence=0.8,
                boxes=[BoundingBox(**b) for b in res["boxes"]]
            )
            
        return ChatResponse(
            answer="I see various features here. You can ask me to find anything, like 'find aeroplanes' or 'detect animals'.",
            confidence=0.6
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8765, reload=True)
