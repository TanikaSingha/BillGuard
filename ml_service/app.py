import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from ultralytics import YOLO
import uvicorn
import shutil
import cv2
from ml_service.utils.cloudinary_config import upload_to_cloudinary

app = FastAPI()

# Load your trained model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "best.pt")
model = YOLO(MODEL_PATH)

def draw_bounding_boxes(image, detections):
    """
    Draw bounding boxes and labels on an image.
    Args:
        image: np.array (original image)
        detections: list of dicts with keys {"class": int, "confidence": float, "xyxy": [x1,y1,x2,y2]}
    Returns:
        Annotated image (np.array)
    """
    # Class mapping
    class_names = {
        0: "Billboard",
        1: "Stand"
    }

    for det in detections:
        x1, y1, x2, y2 = map(int, det["xyxy"])
        cls = det["class"]
        conf = det["confidence"]

        # Pick a bright color based on class
        colors = [(0, 255, 0), (0, 0, 255), (255, 0, 0), (0, 255, 255)]
        color = colors[cls % len(colors)]

        # Draw rectangle with thick lines
        cv2.rectangle(image, (x1, y1), (x2, y2), color, 3)

        # Label text with class name instead of just number
        class_label = class_names.get(cls, f"Class {cls}")
        label = f"{class_label} {conf:.2f}"

        # Background rectangle for text
        (tw, th), baseline = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
        cv2.rectangle(image, (x1, y1 - th - 10), (x1 + tw, y1), color, -1)

        # Put text
        cv2.putText(image, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX,
                    0.6, (255, 255, 255), 2, cv2.LINE_AA)

    return image

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        # Save incoming file temporarily
        temp_file = f"temp_{file.filename}"
        with open(temp_file, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Run YOLO model
        results = model.predict(temp_file)

        detections = []
        image = cv2.imread(temp_file)  # read image with OpenCV

        # Collect detections
        for result in results:
            for box in result.boxes:
                xyxy = box.xyxy[0].tolist()  # [x1, y1, x2, y2]
                conf = float(box.conf[0].item())
                cls = int(box.cls[0].item())

                detections.append({
                    "class": cls,
                    "confidence": conf,
                    "xyxy": xyxy
                })

        # Draw bounding boxes
        annotated_image = draw_bounding_boxes(image, detections)

        # Save annotated image
        output_file = f"annotated_{file.filename}"
        cv2.imwrite(output_file, annotated_image)

        # Upload to Cloudinary
        cloudinary_url = upload_to_cloudinary(output_file)

        # Clean up local files
        os.remove(temp_file)
        os.remove(output_file)

        return JSONResponse(content={
            "detections": detections,
            "annotated_image_url": cloudinary_url
        })

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
