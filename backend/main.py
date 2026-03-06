from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.crypto import router as crypto_router
from backend.models.crypto import CryptoData, PredictionResponse

app = FastAPI(
    title="Crypto Forecasting API",
    description="API for crypto price predictions and data",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crypto_router, prefix="/api/v1", tags=["Crypto"])

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Crypto Forecasting API",
        "version": "1.0.0",
        "endpoints": {
            "GET /api/v1/crypto": "Get crypto data",
            "GET /api/v1/crypto/predict": "Get crypto prediction",
        }
    }

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
