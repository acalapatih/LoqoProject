from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    name: str = Field(
        ...,
        min_length=1, max_length=200, description="Nama produk")
    category: str = Field(
        ...,
        description="Kategori produk")
    description: Optional[str] = Field(
        None,
        description="Deskripsi produk")
    price: int = Field(
        ...,
        ge=0,
        description="Harga satuan (Rupiah)")
    stock: int = Field(
        ...,
        ge=0,
        description="Stok awal")
    stock_unit: str = Field(
        default="pcs",
        description="Unit stok (pcs, kg, liter, dll)")
    is_active: bool = Field(
        default=True,
        description="Status produk aktif/tidak")
    low_stock_threshold: int = Field(
        ...,
        ge=0,
        description="Threshold untuk menandai produk menipis")
    low_stock_unit: str = Field(
        default="pcs",
        description="Unit untuk low stock threshold")


class ProductCreate(ProductBase):
    image_url: Optional[str] = Field(None, description="URL gambar produk")


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = Field(None, ge=0)
    stock: Optional[int] = Field(None, ge=0)
    stock_unit: Optional[str] = None
    is_active: Optional[bool] = None
    low_stock_threshold: Optional[int] = Field(None, ge=0)
    low_stock_unit: Optional[str] = None
    image_url: Optional[str] = None


class ProductResponse(ProductBase):
    id: str = Field(
        ...,
        description="ID unik produk")
    image_url: Optional[str] = Field(
        None,
        description="URL gambar produk")
    created_at: datetime = Field(
        ...,
        description="Waktu dibuat")
    updated_at: Optional[datetime] = Field(
        None,
        description="Waktu terakhir diupdate")
    is_low_stock: bool = Field(
        ...,
        description="Apakah produk menipis (stok <= threshold)")

    class Config:
        from_attributes = True


class ProductInDB(ProductBase):
    id: str
    image_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
