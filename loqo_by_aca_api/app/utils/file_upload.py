from pathlib import Path
import shutil
from uuid import uuid4
from fastapi import UploadFile, HTTPException, status


def save_uploaded_file(
    file: UploadFile,
    sub_directory: str = "general"
) -> str:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File harus berupa gambar"
        )
    upload_base_dir = Path("uploads")
    target_dir = upload_base_dir / sub_directory
    target_dir.mkdir(parents=True, exist_ok=True)
    file_ext = Path(file.filename).suffix if file.filename else ".jpg"
    unique_filename = f"{uuid4()}{file_ext}"
    file_path = target_dir / unique_filename
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal menyimpan file: {str(e)}"
        )
    # Return URL path
    return f"/uploads/{sub_directory}/{unique_filename}"


def delete_uploaded_file(image_url: str) -> bool:
    if not image_url:
        return False
    file_path = Path(image_url.lstrip("/"))
    if file_path.exists():
        try:
            file_path.unlink()
            return True
        except Exception:
            return False
    return False
