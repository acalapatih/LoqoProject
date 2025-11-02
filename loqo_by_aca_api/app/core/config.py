from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    APP_NAME: str = "My FastAPI App"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    MONGODB_URL: str = "mongodb://localhost:27017/"
    DATABASE_NAME: str = "fastapi_db"

    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"


settings = Settings()
