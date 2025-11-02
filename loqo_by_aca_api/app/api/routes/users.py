from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.models.user import UserResponse, UserUpdate
from app.models.pagination import PaginationParams, PaginatedResponse
from app.services.user_service import UserService
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=PaginatedResponse[UserResponse])
async def get_users(
    page: int = Query(1, ge=1, description="Halaman ke berapa"),
    limit: int = Query(
        10, ge=1, le=100, description="Jumlah data per halaman"
    ),
    sort: str | None = Query(
        None, description="Sorting (format: 'field:asc' atau 'field:desc')"
    ),
    current_user=Depends(get_current_user)
):
    user_service = UserService()
    pagination = PaginationParams(page=page, limit=limit, sort=sort)
    return await user_service.get_users(pagination)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    current_user=Depends(get_current_user)
):
    user_service = UserService()
    try:
        return await user_service.get_user_by_id(user_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_user=Depends(get_current_user)
):
    user_service = UserService()
    try:
        return await user_service.update_user(user_id, user_update)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
