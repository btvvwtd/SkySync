from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File as FastAPIFile,
)
from sqlalchemy.orm import Session
from ..models.file import File
from ..models.user import User
from ..schemas.file import FileResponse
from ..dependencies.auth import get_current_user
from ..config.database import get_db
import os
import shutil
import uuid

router = APIRouter()


@router.post("/", response_model=FileResponse)
async def create_file(
    file: UploadFile = FastAPIFile(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join("uploads", unique_filename)

    # Save file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save file metadata to database
    db_file = File(filename=file.filename, filepath=file_path, user_id=current_user.id)
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file


@router.get("/", response_model=list[FileResponse])
async def read_files(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    files = db.query(File).filter(File.user_id == current_user.id).all()
    return files


@router.get("/download/{file_id}")
async def download_file(
    file_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_file = (
        db.query(File)
        .filter(File.id == file_id, File.user_id == current_user.id)
        .first()
    )
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")
    return {"filepath": db_file.filepath, "filename": db_file.filename}


@router.delete("/{file_id}")
async def delete_file(
    file_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_file = (
        db.query(File)
        .filter(File.id == file_id, File.user_id == current_user.id)
        .first()
    )
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        os.remove(db_file.filepath)
    except OSError:
        pass
    db.delete(db_file)
    db.commit()
    return {"message": "File deleted successfully"}
