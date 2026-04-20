"""
demo_detection_service.py

Service layer for demo aircraft defect detection.

Instead of running a real model, this service reads pre-generated
YOLO label files and converts them into structured detection outputs.
This allows us to simulate a full inference pipeline without shipping
model weights.
"""

from pathlib import Path
from typing import Optional

from app.config import LABEL_DIRS, CLASS_NAMES
from app.utils.yolo import parse_yolo_label_file


class DemoDetectionService:
    """
    Demo detection service that mimics model inference using stored label files.
    """

    def _find_label_file(self, image_name: str) -> Optional[Path]:
        """
        Locate the corresponding YOLO label file for a given image.

        The method searches through configured label directories and returns
        the first matching file.

        Args:
            image_name (str): Name of the input image.

        Returns:
            Optional[Path]: Path to label file if found, otherwise None.
        """
        label_name = Path(image_name).stem + ".txt"

        for label_dir in LABEL_DIRS:
            candidate = label_dir / label_name
            if candidate.exists():
                return candidate

        return None

    def detect_defects(self, image_name: str):
        """
        Retrieve detections for an image using precomputed labels.

        This simulates a real detection pipeline:
        image -> model -> bounding boxes
        by instead loading bounding boxes from disk.

        Args:
            image_name (str): Name of the input image.

        Returns:
            List[BoundingBox]: Parsed detection results (empty if none found).
        """
        label_path = self._find_label_file(image_name)

        if label_path is None:
            return []

        return parse_yolo_label_file(label_path, CLASS_NAMES)