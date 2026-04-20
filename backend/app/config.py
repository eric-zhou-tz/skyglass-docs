from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATASET_DIR = DATA_DIR / "dataset"

IMAGE_DIRS = [
    DATASET_DIR / "images" / "train",
    DATASET_DIR / "images" / "validate",
]

LABEL_DIRS = [
    DATASET_DIR / "labels" / "train",
    DATASET_DIR / "labels" / "validate",
]

CLASS_NAMES = ["defect"]

