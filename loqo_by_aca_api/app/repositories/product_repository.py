from typing import Optional, List
from app.core.database import get_database
from app.models.product import ProductInDB


class ProductRepository:
    def __init__(self):
        self.db = get_database()
        self.collection = "products"

    async def create_product(self, product_data: dict) -> ProductInDB:
        await self.db[self.collection].insert_one(product_data)
        return ProductInDB(**product_data)

    async def get_product_by_id(
        self, product_id: str
    ) -> Optional[ProductInDB]:
        product = await self.db[self.collection].find_one({"id": product_id})
        if product:
            product.pop("_id", None)
            return ProductInDB(**product)
        return None

    async def get_products(
        self,
        skip: int = 0,
        limit: int = 10,
        search: Optional[str] = None,
        category: Optional[str] = None,
        status: Optional[bool] = None,
        sort_field: Optional[str] = None,
        sort_order: int = 1
    ) -> List[dict]:
        query = {}

        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}}
            ]

        if category and category.lower() != "semua kategori":
            query["category"] = category

        if status is not None:
            query["is_active"] = status

        cursor = self.db[self.collection].find(query).skip(skip).limit(limit)

        if sort_field:
            cursor = cursor.sort(sort_field, sort_order)
        else:
            cursor = cursor.sort("name", 1)

        products = await cursor.to_list(length=limit)

        for product in products:
            product.pop("_id", None)

        return products

    async def count_products(
        self,
        search: Optional[str] = None,
        category: Optional[str] = None,
        status: Optional[bool] = None
    ) -> int:
        query = {}

        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}}
            ]

        if category and category.lower() != "semua kategori":
            query["category"] = category

        if status is not None:
            query["is_active"] = status

        return await self.db[self.collection].count_documents(query)

    async def update_product(self, product_id: str, update_data: dict) -> bool:
        result = await self.db[self.collection].update_one(
            {"id": product_id},
            {"$set": update_data}
        )
        return result.modified_count > 0

    async def delete_product(self, product_id: str) -> bool:
        result = await self.db[self.collection].delete_one({"id": product_id})
        return result.deleted_count > 0

    async def get_all_categories(self) -> List[str]:
        categories = await self.db[self.collection].distinct("category")
        return sorted(categories)
