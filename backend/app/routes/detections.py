"""
detections.py

API routes for aircraft defect detection.

This module exposes endpoints used by the frontend to request
defect predictions for a given image. It connects the HTTP layer
to the underlying detection service (which may be a demo or real model).
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.schemas.detection import DetectionResponse
from app.services.detection.demo_detection_service import DemoDetectionService

router = APIRouter()

# Service layer abstraction for running detection logic
# In this demo build, this may use mock or lightweight inference
detection_service = DemoDetectionService()


class DetectionRequest(BaseModel):
    image_name: str


@router.post("/detect", response_model=DetectionResponse)
def detect(request: DetectionRequest):
    """
    Run defect detection on a given image.

    This endpoint validates input, delegates detection to the service layer,
    and returns structured detection results for frontend consumption.

    Args:
        request (DetectionRequest): Incoming request containing image name.

    Returns:
        DetectionResponse: Image name and associated defect detections.
    """
    if not request.image_name:
        raise HTTPException(status_code=400, detail="image_name is required")

    detections = detection_service.detect_defects(request.image_name)

    return DetectionResponse(
        image_name=request.image_name,
        detections=detections,
    )