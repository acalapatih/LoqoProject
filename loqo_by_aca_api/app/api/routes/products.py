from fastapi import (
    APIRouter, Depends, HTTPException, status, Query
)
from typing import Optional

from app.models.product import (
    ProductCreate, ProductUpdate, ProductResponse
)
from app.models.pagination import PaginationParams, PaginatedResponse
from app.services.product_service import ProductService
from app.dependencies.auth import get_current_user
from app.utils.file_upload import delete_uploaded_file

router = APIRouter(prefix="/products", tags=["Products"])


@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_product(
    product: ProductCreate,
    current_user=Depends(get_current_user)
):
    product_service = ProductService()
    return await product_service.create_product(product)


@router.get("", response_model=PaginatedResponse[ProductResponse])
async def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(
        10, ge=1, le=100,
    ),
    search: Optional[str] = Query(
        None
    ),
    category: Optional[str] = Query(
        None,
    ),
    status: Optional[bool] = Query(
        None,
        description="Filter status produk: true=aktif, false=tidak aktif"
    ),
    sort: Optional[str] = Query(
        None,
        description=(
            "Sorting (format: 'field:asc' atau 'field:desc', "
            "contoh: 'nama_produk:asc')"
        )
    ),
    current_user=Depends(get_current_user)
):
    product_service = ProductService()
    pagination = PaginationParams(page=page, limit=limit, sort=sort)
    return await product_service.get_products(
        pagination=pagination,
        search=search,
        category=category,
        status=status
    )


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: str,
    current_user=Depends(get_current_user)
):
    product_service = ProductService()
    try:
        return await product_service.get_product_by_id(product_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    current_user=Depends(get_current_user)
):
    product_service = ProductService()
    try:
        return await product_service.update_product(product_id, product_update)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    current_user=Depends(get_current_user)
):
    product_service = ProductService()
    try:
        product = await product_service.get_product_by_id(product_id)
        if product.image_url:
            delete_uploaded_file(product.image_url)

        deleted = await product_service.delete_product(product_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Produk tidak ditemukan"
            )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
