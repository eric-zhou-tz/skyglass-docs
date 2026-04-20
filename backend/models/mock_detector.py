# app/models/mock_detector.py

from typing import List, Dict
from pathlib import Path

from .detector import Detector
from app.utils.yolo_parser import parse_yolo_label_file
from app.config import CLASS_NAMES


class MockDetector(Detector):
    """
    Mock detector that simulates model predictions
    using precomputed YOLO label files.
    """

    def predict(self, label_path: Path) -> List[Dict]:
        return parse_yolo_label_file(label_path, CLASS_NAMES)