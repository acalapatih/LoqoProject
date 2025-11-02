from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import UserCreate, UserResponse, UserLogin
from app.models.auth import Token
from app.services.auth_service import AuthService
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
async def register(user: UserCreate):
    auth_service = AuthService()
    try:
        new_user = await auth_service.register_user(user)
        return new_user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login", response_model=Token)
async def login(user_login: UserLogin):
    auth_service = AuthService()
    try:
        token = await auth_service.login(user_login.email, user_login.password)
        return token
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user=Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        age=current_user.age,
        phone=current_user.phone,
        created_at=current_user.created_at
    )
