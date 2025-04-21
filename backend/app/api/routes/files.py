from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from fastapi.responses import FileResponse
import os
from typing import List
from starlette.requests import Request
from .auth import get_current_username

router = APIRouter(prefix="/files", tags=["Files"])
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), username: str = Depends(get_current_username)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        return {"status": "success", "filename": file.filename}
    except Exception as e:
        raise HTTPException(500, str(e))

@router.get("/")
async def list_files(username: str = Depends(get_current_username)) -> List[str]:
    return os.listdir(UPLOAD_DIR)

@router.get("/{filename}")
async def view_file(filename: str, request: Request, username: str = Depends(get_current_username)):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(404, "File not found")

    ext = filename.lower().split('.')[-1]
    if ext in ['png', 'jpg', 'jpeg', 'gif']:
        return FileResponse(file_path, media_type=f"image/{ext}")
    elif ext == 'pdf':
        return FileResponse(file_path, media_type="application/pdf")
    elif ext in ['txt', 'csv', 'html', 'htm', 'xml', 'json']:
        return FileResponse(file_path, media_type="text/plain")
    elif ext in ['mp4', 'webm']:
        return FileResponse(file_path, media_type=f"video/{ext}")
    elif ext in ['mp3', 'wav', 'ogg']:
        return FileResponse(file_path, media_type=f"audio/{ext}")
    else:
        return FileResponse(
            file_path,
            media_type="application/octet-stream",
            filename=filename,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

@router.get("/download/{filename}")
async def download_file(filename: str, username: str = Depends(get_current_username)):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(404, "File not found")
    return FileResponse(file_path, media_type="application/octet-stream", filename=filename)

@router.delete("/{filename}")
async def delete_file(filename: str, username: str = Depends(get_current_username)):
    safe_filename = os.path.basename(filename)
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    if not os.path.exists(file_path):
        raise HTTPException(404, "File not found")
    os.remove(file_path)
    return {"status": "File deleted successfully"}
