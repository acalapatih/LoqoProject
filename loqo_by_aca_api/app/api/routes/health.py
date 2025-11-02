from fastapi import APIRouter
from datetime import datetime

router = APIRouter(tags=["Health Check"])


@router.get("/ping")
def ping():
    return {"message": "pong"}


@router.get("/health")
def health():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }
