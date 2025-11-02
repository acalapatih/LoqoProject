from fastapi import (
    APIRouter, Depends, HTTPException, status,
    UploadFile, File, Query
)
from typing import Optional

from app.dependencies.auth import get_current_user
from app.utils.file_upload import save_uploaded_file

router = APIRouter(prefix="/uploads", tags=["Uploads"])


@router.post("/image")
async def upload_image(
    image: UploadFile = File(...),
    sub_directory: Optional[str] = Query(
        "general",
        description="example: 'users', 'products', 'general'"
    ),
    current_user=Depends(get_current_user)
):
    try:
        image_url = save_uploaded_file(file=image, sub_directory=sub_directory)
        return {
            "message": "Gambar berhasil diupload",
            "image_url": image_url
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal mengupload gambar: {str(e)}"
        )
