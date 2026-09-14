import requests
import uuid
import os

UPLOAD_DIR = "uploads"

def search_and_download_satellite(query: str):
    # 1. Geocode the query using Photon (Komoot) which is much better at fuzzy search than Nominatim
    geocode_url = f"https://photon.komoot.io/api/?q={query}&limit=1"
    
    try:
        r = requests.get(geocode_url, timeout=10)
        if r.status_code != 200: return None
        
        features = r.json().get("features", [])
        if not features: return None
            
        data = features[0]
        lon = float(data["geometry"]["coordinates"][0])
        lat = float(data["geometry"]["coordinates"][1])
        
        props = data.get("properties", {})
        name_parts = [props.get("name"), props.get("city"), props.get("state"), props.get("country")]
        display_name = ", ".join([p for p in name_parts if p])
        
        # 2. Create a small bounding box (~500m radius)
        offset = 0.003
        min_lon = lon - offset
        max_lon = lon + offset
        min_lat = lat - offset
        max_lat = lat + offset
        bbox = f"{min_lon},{min_lat},{max_lon},{max_lat}"
        
        # 3. Fetch from ArcGIS World Imagery
        arcgis_url = f"https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox={bbox}&bboxSR=4326&size=800,800&format=png&f=json"
        r2 = requests.get(arcgis_url, timeout=10)
        if r2.status_code != 200 or "href" not in r2.json():
            return None
            
        img_url = r2.json()["href"]
        
        # 4. Download and save to uploads
        r3 = requests.get(img_url, timeout=10)
        if r3.status_code == 200:
            image_id = str(uuid.uuid4())
            file_name = f"{image_id}.png"
            file_path = os.path.join(UPLOAD_DIR, file_name)
            
            with open(file_path, "wb") as f:
                f.write(r3.content)
                
            return {
                "image_id": image_id,
                "file_name": file_name,
                "gps": [lat, lon],
                "address": display_name
            }
    except Exception as e:
        print(f"Search failed: {e}")
        return None
        
    return None
