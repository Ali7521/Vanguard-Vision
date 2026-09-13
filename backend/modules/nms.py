def calculate_iou(box1, box2):
    x1_min, y1_min, x1_max, y1_max = box1
    x2_min, y2_min, x2_max, y2_max = box2
    
    inter_x_min = max(x1_min, x2_min)
    inter_y_min = max(y1_min, y2_min)
    inter_x_max = min(x1_max, x2_max)
    inter_y_max = min(y1_max, y2_max)
    
    if inter_x_max <= inter_x_min or inter_y_max <= inter_y_min:
        return 0.0
        
    inter_area = (inter_x_max - inter_x_min) * (inter_y_max - inter_y_min)
    box1_area = (x1_max - x1_min) * (y1_max - y1_min)
    box2_area = (x2_max - x2_min) * (y2_max - y2_min)
    
    iou = inter_area / float(box1_area + box2_area - inter_area)
    return iou

def apply_nms(predictions, iou_threshold=0.3):
    # predictions are already sorted by score descending
    kept_predictions = []
    for p in predictions:
        box = [p["box"]["xmin"], p["box"]["ymin"], p["box"]["xmax"], p["box"]["ymax"]]
        overlap = False
        for kept in kept_predictions:
            kept_box = [kept["box"]["xmin"], kept["box"]["ymin"], kept["box"]["xmax"], kept["box"]["ymax"]]
            if calculate_iou(box, kept_box) > iou_threshold:
                overlap = True
                break
        if not overlap:
            kept_predictions.append(p)
    return kept_predictions
