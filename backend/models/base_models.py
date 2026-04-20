# app/models/base_model.py

from abc import ABC, abstractmethod
from typing import Any


class BaseModel(ABC):
    """
    Abstract base class for all perception models.
    Defines a consistent interface for inference.
    """

    @abstractmethod
    def predict(self, input_data: Any):
        pass