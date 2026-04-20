"""
detection.py

Pydantic schemas for aircraft defect detection.

These models define the structure of detection outputs returned
by the API, ensuring consistency between backend and frontend.
"""

from pydantic import BaseModel
from typing import List


class BoundingBox(BaseModel):
    """
    Represents a single detected object/defect.

    All coordinates are normalized (0 to 1) relative to the image dimensions,
    following common object detection formats (e.g., YOLO-style).

    Attributes:
        label (str): Class name of the detected defect.
        confidence (float): Model confidence score (0 to 1).
        x_center (float): X-coordinate of box center (normalized).
        y_center (float): Y-coordinate of box center (normalized).
        width (float): Width of bounding box (normalized).
        height (float): Height of bounding box (normalized).
    """
    label: str
    confidence: float
    x_center: float
    y_center: float
    width: float
    height: float


class DetectionResponse(BaseModel):
    """
    Response schema for detection results.

    Attributes:
        image_name (str): Identifier of the processed image.
        detections (List[BoundingBox]): List of detected defects.
    """
    image_name: str
    detections: List[BoundingBox]