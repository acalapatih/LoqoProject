from typing import Optional, List
from app.core.database import get_database
from app.models.user import UserInDB


class UserRepository:
    def __init__(self):
        self.db = get_database()
        self.collection = "users"

    async def create_user(self, user_data: dict) -> UserInDB:
        await self.db[self.collection].insert_one(user_data)
        return UserInDB(**user_data)

    async def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        user = await self.db[self.collection].find_one({"email": email})
        if user:
            user.pop("_id", None)
            return UserInDB(**user)
        return None

    async def get_user_by_id(self, user_id: str) -> Optional[UserInDB]:
        user = await self.db[self.collection].find_one({"id": user_id})
        if user:
            user.pop("_id", None)
            return UserInDB(**user)
        return None

    async def get_users(
        self,
        skip: int = 0,
        limit: int = 10,
        sort_field: str | None = None,
        sort_order: int = 1
    ) -> List[dict]:

        cursor = self.db[self.collection].find({}).skip(skip).limit(limit)

        if sort_field:
            cursor = cursor.sort(sort_field, sort_order)

        users = await cursor.to_list(length=limit)

        for user in users:
            user.pop("_id", None)

        return users

    async def count_users(self) -> int:
        return await self.db[self.collection].count_documents({})

    async def update_user(self, user_id: str, update_data: dict) -> bool:
        result = await self.db[self.collection].update_one(
            {"id": user_id},
            {"$set": update_data}
        )
        return result.modified_count > 0

    async def delete_user(self, user_id: str) -> bool:
        result = await self.db[self.collection].delete_one({"id": user_id})
        return result.deleted_count > 0
