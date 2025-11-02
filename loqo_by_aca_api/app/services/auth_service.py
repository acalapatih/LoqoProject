from datetime import datetime, timezone
from uuid import uuid4
from typing import Optional
from app.core.security import (
    hash_password, verify_password, create_access_token
)
from app.repositories.user_repository import UserRepository
from app.models.user import UserCreate, UserInDB, UserResponse
from app.models.auth import Token


class AuthService:
    def __init__(self):
        self.user_repo = UserRepository()

    async def register_user(self, user_create: UserCreate) -> UserResponse:
        existing_user = await self.user_repo.get_user_by_email(
            user_create.email
        )
        if existing_user:
            raise ValueError("Email sudah terdaftar")

        hashed_password = hash_password(user_create.password)

        user_data = {
            "id": str(uuid4()),
            "name": user_create.name,
            "email": user_create.email,
            "age": user_create.age,
            "phone": user_create.phone,
            "image_url": user_create.image_url,
            "hashed_password": hashed_password,
            "created_at": datetime.now(timezone.utc),
            "is_active": user_create.is_active
        }

        await self.user_repo.create_user(user_data)

        return UserResponse(
            id=user_data["id"],
            name=user_data["name"],
            email=user_data["email"],
            age=user_data["age"],
            phone=user_data["phone"],
            image_url=user_data["image_url"],
            is_active=user_data["is_active"],
            created_at=user_data["created_at"]
        )

    async def login(self, email: str, password: str) -> Token:
        user = await self.user_repo.get_user_by_email(email)
        if not user:
            raise ValueError("Email atau password salah")

        if not verify_password(password, user.hashed_password):
            raise ValueError("Email atau password salah")

        if not user.is_active:
            raise ValueError("User tidak aktif")

        access_token = create_access_token(data={"sub": user.email})

        return Token(access_token=access_token, token_type="bearer")

    async def get_current_user(self, email: str) -> Optional[UserInDB]:
        return await self.user_repo.get_user_by_email(email)
