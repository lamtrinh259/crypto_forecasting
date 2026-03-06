from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CryptoPrice(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int

class CryptoData(BaseModel):
    symbol: str
    name: str
    currency: str
    prices: List[CryptoPrice]

class PredictionPoint(BaseModel):
    date: str
    predicted_price: float
    confidence: float

class PredictionResponse(BaseModel):
    symbol: str
    current_price: float
    predictions: List[dict]
    model_used: str
    generated_at: str
