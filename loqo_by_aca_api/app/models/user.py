from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr


class UserBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=50,
                      description="Nama user")
    email: EmailStr = Field(..., description="Email user")
    age: int = Field(..., ge=18, le=100, description="Umur (18-100)")
    phone: int = Field(default=81234567890, description="Nomor telepon")
    image_url: Optional[str] = Field(
        None, description="URL gambar profil user"
    )
    is_active: bool = Field(
        True,
    )


class UserCreate(UserBase):
    password: str = Field(
        ...,
        min_length=6,
        max_length=72,
        description="Password minimal 6 karakter, maksimal 72 karakter"
    )


class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="Email user")
    password: str = Field(..., description="Password user")


class UserUpdate(BaseModel):
    name: Optional[str] = Field(
        None, min_length=3, max_length=50,
        description="Nama user"
    )
    email: Optional[EmailStr] = Field(None, description="Email user")
    age: Optional[int] = Field(
        None, ge=18, le=100, description="Umur (18-100)"
    )
    phone: Optional[int] = Field(None, description="Nomor telepon")
    image_url: Optional[str] = Field(
        None, description="URL gambar profil user"
    )
    is_active: Optional[bool] = Field(
        None,
        description="Status akun aktif/nonaktif (true=aktif, false=nonaktif)"
    )


class UserResponse(UserBase):
    id: str = Field(..., description="ID unik user")
    created_at: datetime = Field(..., description="Waktu dibuat")

    class Config:
        from_attributes = True


class UserInDB(UserBase):
    id: str
    hashed_password: str
    created_at: datetime
