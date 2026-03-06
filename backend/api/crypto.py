from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from backend.models.crypto import CryptoData, PredictionResponse, CryptoPrice

router = APIRouter()

# Supported crypto symbols
SUPPORTED_CRYPTOS = {
    "BTC": "BTC-USD",
    "ETH": "ETH-USD",
    "BNB": "BNB-USD",
    "SOL": "SOL-USD",
    "ADA": "ADA-USD",
    "DOT": "DOT-USD",
    "AVAX": "AVAX-USD",
    "MATIC": "MATIC-USD"
}

@router.get("/crypto", response_model=CryptoData)
async def get_crypto_data(
    symbol: str = Query("BTC", description="Crypto symbol (e.g., BTC, ETH)"),
    period: str = Query("1y", description="Time period (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)"),
    interval: str = Query("1d", description="Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)")
):
    """Get historical crypto data"""
    try:
        ticker = SUPPORTED_CRYPTOS.get(symbol.upper(), f"{symbol.upper()}-USD")
        stock = yf.Ticker(ticker)
        hist = stock.history(period=period, interval=interval)
        
        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No data found for {symbol}")
        
        prices = []
        for date, row in hist.iterrows():
            prices.append(CryptoPrice(
                date=date.strftime("%Y-%m-%d"),
                open=round(row["Open"], 2),
                high=round(row["High"], 2),
                low=round(row["Low"], 2),
                close=round(row["Close"], 2),
                volume=int(row["Volume"])
            ))
        
        return CryptoData(
            symbol=symbol.upper(),
            name=stock.info.get("name", symbol.upper()),
            currency="USD",
            prices=prices
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/crypto/predict", response_model=PredictionResponse)
async def get_crypto_prediction(
    symbol: str = Query("BTC", description="Crypto symbol (e.g., BTC, ETH)"),
    days: int = Query(30, description="Number of days to predict", ge=1, le=365)
):
    """Get crypto price prediction using simple moving average"""
    try:
        ticker = SUPPORTED_CRYPTOS.get(symbol.upper(), f"{symbol.upper()}-USD")
        stock = yf.Ticker(ticker)
        hist = stock.history(period="1y", interval="1d")
        
        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No data found for {symbol}")
        
        # Simple prediction using moving average trend
        current_price = hist["Close"].iloc[-1]
        ma_30 = hist["Close"].rolling(window=30).mean().iloc[-1]
        ma_90 = hist["Close"].rolling(window=90).mean().iloc[-1]
        
        # Calculate trend
        trend = (ma_30 - ma_90) / ma_90 if ma_90 != 0 else 0
        
        # Generate predictions
        predictions = []
        last_date = hist.index[-1]
        
        for i in range(1, days + 1):
            predicted_date = last_date + timedelta(days=i)
            # Simple linear projection with some randomness
            predicted_price = current_price * (1 + trend * (i / 30))
            confidence = max(0.5, 1 - (i / 60))  # Confidence decreases over time
            
            predictions.append({
                "date": predicted_date.strftime("%Y-%m-%d"),
                "predicted_price": round(predicted_price, 2),
                "confidence": round(confidence, 2)
            })
        
        return PredictionResponse(
            symbol=symbol.upper(),
            current_price=round(current_price, 2),
            predictions=predictions,
            model_used="Moving Average Trend",
            generated_at=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/crypto/symbols")
async def get_supported_symbols():
    """Get list of supported crypto symbols"""
    return {
        "symbols": [
            {"symbol": k, "ticker": v, "name": k} 
            for k, v in SUPPORTED_CRYPTOS.items()
        ]
    }
