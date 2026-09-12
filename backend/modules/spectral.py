from typing import Dict

def run_spectral_analysis(image_id: str, index_type: str = "ndvi") -> Dict:
    """Mock spectral index calculation."""
    # In a real app, this reads multispectral bands using rasterio
    # and computes (NIR - Red) / (NIR + Red)
    
    # We will simulate returning a pseudo-color heatmap overlay 
    # represented as a large polygon covering the image with a generic label,
    # or just a summary. For MVP, we'll return a generic answer.
    
    if index_type.lower() == "ndvi":
        answer = "Calculated NDVI (Normalized Difference Vegetation Index). Average value is 0.45, indicating moderate vegetation health."
    elif index_type.lower() == "ndwi":
        answer = "Calculated NDWI (Normalized Difference Water Index). The result highlights the water body in the lower left."
    else:
        answer = f"Calculated {index_type.upper()} index."
        
    return {
        "module": "spectral",
        "index": index_type,
        "answer": answer,
        "boxes": [],
        "polygons": []
    }
