from datetime import datetime, timezone
from app.repositories.user_repository import UserRepository
from app.models.user import UserResponse, UserUpdate
from app.models.pagination import (
    PaginationParams, PaginatedResponse, PaginationMetadata
)


class UserService:
    def __init__(self):
        self.user_repo = UserRepository()

    async def get_users(
        self,
        pagination: PaginationParams
    ) -> PaginatedResponse[UserResponse]:
        skip = (pagination.page - 1) * pagination.limit

        sort_field = None
        sort_order = 1
        if pagination.sort:
            parts = pagination.sort.split(":")
            if len(parts) == 2:
                sort_field = parts[0]
                sort_order = 1 if parts[1].lower() == "asc" else -1

        users_data = await self.user_repo.get_users(
            skip=skip,
            limit=pagination.limit,
            sort_field=sort_field,
            sort_order=sort_order
        )

        total = await self.user_repo.count_users()

        users = [
            UserResponse(
                id=user["id"],
                name=user["name"],
                email=user["email"],
                age=user["age"],
                phone=user["phone"],
                image_url=user.get("image_url"),
                is_active=user.get("is_active", True),
                created_at=user["created_at"]
            )
            for user in users_data
        ]

        metadata = PaginationMetadata(
            page=pagination.page,
            limit=pagination.limit,
            total=total,
            sort=pagination.sort
        )

        return PaginatedResponse(data=users, metadata=metadata)

    async def get_user_by_id(self, user_id: str) -> UserResponse:
        user = await self.user_repo.get_user_by_id(user_id)
        if not user:
            raise ValueError("User tidak ditemukan")

        return UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            age=user.age,
            phone=user.phone,
            image_url=user.image_url,
            is_active=user.is_active,
            created_at=user.created_at
        )

    async def update_user(
        self, user_id: str, user_update: UserUpdate
    ) -> UserResponse:
        existing = await self.user_repo.get_user_by_id(user_id)
        if not existing:
            raise ValueError("User tidak ditemukan")
        update_data = user_update.model_dump(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.now(timezone.utc)
            await self.user_repo.update_user(user_id, update_data)

        updated = await self.user_repo.get_user_by_id(user_id)
        return UserResponse(
            id=updated.id,
            name=updated.name,
            email=updated.email,
            age=updated.age,
            phone=updated.phone,
            image_url=updated.image_url,
            is_active=updated.is_active,
            created_at=updated.created_at
        )
