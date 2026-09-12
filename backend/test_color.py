import cv2
import numpy as np

def get_dominant_color(image_crop):
    if image_crop.size == 0: return "Unknown"
    # reshape
    pixels = image_crop.reshape(-1, 3)
    # k-means
    pixels = np.float32(pixels)
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
    flags = cv2.KMEANS_RANDOM_CENTERS
    _, labels, palette = cv2.kmeans(pixels, 1, None, criteria, 10, flags)
    dominant_color = palette[0].astype(int)
    
    # Simple color name mapping
    b, g, r = dominant_color
    if r > g + 20 and r > b + 20: return "Red"
    if b > r + 20 and b > g + 20: return "Blue"
    if g > r + 20 and g > b + 20: return "Green"
    if r > 200 and g > 200 and b > 200: return "White"
    if r < 50 and g < 50 and b < 50: return "Black"
    if abs(int(r)-int(g)) < 20 and abs(int(g)-int(b)) < 20: return "Gray"
    return "Brown/Mixed"

image = cv2.imread("uploads/cce60941-6f6b-41f9-8438-cf582940315e.jpg")
crop = image[963:1155, 2289:2523]
print("Color:", get_dominant_color(crop))
