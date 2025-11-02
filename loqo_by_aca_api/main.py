import uvicorn
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware  # <-- 1. IMPORT INI

from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api.routes import auth, users, health, products, uploads


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# <-- 2. TENTUKAN ALAMAT REACT ANDA
origins = [
    "http://localhost:3000",
]

# <-- 3. TAMBAHKAN MIDDLEWARE CORS INI
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Izinkan origin spesifik
    allow_credentials=True,    # Izinkan cookies/token
    allow_methods=["*"],       # Izinkan semua method (GET, POST, etc)
    allow_headers=["*"],       # Izinkan semua header
)


# Router Anda ditaruh setelah middleware
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(products.router)
app.include_router(uploads.router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")


if __name__ == "__main__":
    # Uvicorn tidak akan menggunakan ini saat dijalankan dengan 'uvicorn main:app'
    uvicorn.run(
        "main:app",
        host="10.175.61.73", # <-- Alamat ini tidak terpakai jika Anda run 'uvicorn main:app'
        port=32112,
        reload=True
    )