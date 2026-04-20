# app/models/detector.py

from typing import List, Dict
from .base_model import BaseModel


class Detector(BaseModel):
    """
    Abstract interface for object detection models.
    """

    def predict(self, image) -> List[Dict]:
        """
        Returns YOLO-style detections:
        [
          { label, confidence, x_center, y_center, width, height }
        ]
        """
        raise NotImplementedError