from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
from app.core.config import settings

mongodb_client: Optional[AsyncIOMotorClient] = None
database = None


async def connect_to_mongo():
    global mongodb_client, database
    try:
        mongodb_client = AsyncIOMotorClient(settings.MONGODB_URL)
        database = mongodb_client[settings.DATABASE_NAME]

        await mongodb_client.admin.command('ping')
    except Exception as e:
        print(f"Error koneksi MongoDB: {e}")
        raise


async def close_mongo_connection():
    global mongodb_client
    if mongodb_client:
        mongodb_client.close()


def get_database():
    return database
