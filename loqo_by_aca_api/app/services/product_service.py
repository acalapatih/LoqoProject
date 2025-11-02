from datetime import datetime, timezone
from uuid import uuid4
from app.repositories.product_repository import ProductRepository
from app.models.product import (
    ProductCreate, ProductUpdate, ProductResponse, ProductInDB
)
from app.models.pagination import (
    PaginationParams, PaginatedResponse, PaginationMetadata
)


class ProductService:
    def __init__(self):
        self.product_repo = ProductRepository()

    async def create_product(self, product: ProductCreate) -> ProductResponse:
        product_id = str(uuid4())
        now = datetime.now(timezone.utc)

        product_data = {
            "id": product_id,
            "name": product.name,
            "category": product.category,
            "description": product.description,
            "price": product.price,
            "stock": product.stock,
            "stock_unit": product.stock_unit,
            "is_active": product.is_active,
            "low_stock_threshold": product.low_stock_threshold,
            "low_stock_unit": product.low_stock_unit,
            "image_url": product.image_url,
            "created_at": now,
            "updated_at": None
        }

        created = await self.product_repo.create_product(product_data)

        return self._to_response(created)

    async def get_products(
        self,
        pagination: PaginationParams,
        search: str | None = None,
        category: str | None = None,
        status: bool | None = None
    ) -> PaginatedResponse[ProductResponse]:
        skip = (pagination.page - 1) * pagination.limit

        sort_field = None
        sort_order = 1
        if pagination.sort:
            parts = pagination.sort.split(":")
            if len(parts) == 2:
                sort_field = parts[0]
                sort_order = 1 if parts[1].lower() == "asc" else -1
        else:
            sort_field = "name"
            sort_order = 1

        sort_mapping = {
            "nama_produk": "name",
            "harga": "price",
            "stok": "stock",
            "kategori": "category"
        }
        if sort_field in sort_mapping:
            sort_field = sort_mapping[sort_field]

        products_data = await self.product_repo.get_products(
            skip=skip,
            limit=pagination.limit,
            search=search,
            category=category,
            status=status,
            sort_field=sort_field,
            sort_order=sort_order
        )

        total = await self.product_repo.count_products(
            search=search,
            category=category,
            status=status
        )

        products = [self._to_response(ProductInDB(**p)) for p in products_data]

        metadata = PaginationMetadata(
            page=pagination.page,
            limit=pagination.limit,
            total=total,
            sort=pagination.sort
        )

        return PaginatedResponse(data=products, metadata=metadata)

    async def get_product_by_id(self, product_id: str) -> ProductResponse:
        product = await self.product_repo.get_product_by_id(product_id)
        if not product:
            raise ValueError("Produk tidak ditemukan")

        return self._to_response(product)

    async def update_product(
        self, product_id: str, product_update: ProductUpdate
    ) -> ProductResponse:
        existing = await self.product_repo.get_product_by_id(product_id)
        if not existing:
            raise ValueError("Produk tidak ditemukan")

        update_data = product_update.model_dump(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.now(timezone.utc)
            await self.product_repo.update_product(product_id, update_data)

        updated = await self.product_repo.get_product_by_id(product_id)
        return self._to_response(updated)

    async def delete_product(self, product_id: str) -> bool:
        product = await self.product_repo.get_product_by_id(product_id)
        if not product:
            raise ValueError("Produk tidak ditemukan")

        return await self.product_repo.delete_product(product_id)

    async def get_categories(self) -> list[str]:
        return await self.product_repo.get_all_categories()

    def _to_response(self, product: ProductInDB) -> ProductResponse:
        is_low_stock = product.stock <= product.low_stock_threshold

        return ProductResponse(
            id=product.id,
            name=product.name,
            category=product.category,
            description=product.description,
            price=product.price,
            stock=product.stock,
            stock_unit=product.stock_unit,
            is_active=product.is_active,
            low_stock_threshold=product.low_stock_threshold,
            low_stock_unit=product.low_stock_unit,
            image_url=product.image_url,
            created_at=product.created_at,
            updated_at=product.updated_at,
            is_low_stock=is_low_stock
        )
