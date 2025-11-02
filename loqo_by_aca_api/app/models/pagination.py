from typing import Generic, List, TypeVar
from pydantic import BaseModel, Field

T = TypeVar('T')


class PaginationParams(BaseModel):
    page: int = Field(1, ge=1, description="Halaman ke berapa")
    limit: int = Field(
        10, ge=1, le=100,
        description="Jumlah data per halaman (max 100)"
    )
    sort: str | None = Field(
        None,
        description="Sorting format: 'field:asc' atau 'field:desc'")


class PaginationMetadata(BaseModel):
    page: int
    limit: int
    total: int
    sort: str | None = None


class PaginatedResponse(BaseModel, Generic[T]):
    data: List[T]
    metadata: PaginationMetadata
