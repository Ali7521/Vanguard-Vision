from transformers import CLIPSegProcessor, CLIPSegForImageSegmentation
try:
    processor = CLIPSegProcessor.from_pretrained("CIDAS/clipseg-rd64-refined")
    print("CLIPSegProcessor success")
except Exception as e:
    print(f"Error: {e}")

from transformers import AutoProcessor
try:
    processor = AutoProcessor.from_pretrained("CIDAS/clipseg-rd64-refined")
    print("AutoProcessor success")
except Exception as e:
    print(f"Error AutoProcessor: {e}")
