import requests
import uuid
import os

UPLOAD_DIR = "uploads"

def search_and_download_satellite(query: str):
    # 1. Geocode the query using OSM Nominatim
    headers = {"User-Agent": "VanguardVision/1.0"}
    geocode_url = f"https://nominatim.openstreetmap.org/search?q={query}&format=json&limit=1"
    
    r = requests.get(geocode_url, headers=headers)
    if r.status_code != 200 or not r.json():
        return None
        
    data = r.json()[0]
    lat = float(data["lat"])
    lon = float(data["lon"])
    
    # 2. Create a small bounding box (~500m radius)
    offset = 0.003
    min_lon = lon - offset
    max_lon = lon + offset
    min_lat = lat - offset
    max_lat = lat + offset
    bbox = f"{min_lon},{min_lat},{max_lon},{max_lat}"
    
    # 3. Fetch from ArcGIS World Imagery
    arcgis_url = f"https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox={bbox}&bboxSR=4326&size=800,800&format=png&f=json"
    r2 = requests.get(arcgis_url)
    if r2.status_code != 200 or "href" not in r2.json():
        return None
        
    img_url = r2.json()["href"]
    
    # 4. Download and save to uploads
    r3 = requests.get(img_url)
    if r3.status_code == 200:
        image_id = str(uuid.uuid4())
        file_name = f"{image_id}.png"
        file_path = os.path.join(UPLOAD_DIR, file_name)
        
        with open(file_path, "wb") as f:
            f.write(r3.content)
            
        return {
            "image_id": image_id,
            "file_name": file_name,
            "gps": [lat, lon], "address": data.get("display_name", "")
        }
        
    return None
