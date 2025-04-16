from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status
from fastapi.responses import HTMLResponse, FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import os
from typing import List
from starlette.requests import Request
import secrets

app = FastAPI()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

security = HTTPBasic()


def get_current_username(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, "admin")
    correct_password = secrets.compare_digest(credentials.password, "admin")
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


@app.get("/")
async def root():
    return RedirectResponse(url="/web")


@app.post("/upload")
async def upload_file(file: UploadFile = File(...), username: str = Depends(get_current_username)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        return {"status": "success", "filename": file.filename}
    except Exception as e:
        raise HTTPException(500, str(e))


@app.get("/files")
async def list_files(username: str = Depends(get_current_username)) -> List[str]:
    return os.listdir(UPLOAD_DIR)


@app.get("/files/{filename}")
async def view_file(filename: str, request: Request, username: str = Depends(get_current_username)):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(404, "File not found")

    # Determine content type and disposition based on file extension
    if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
        return FileResponse(file_path, media_type=f"image/{filename.split('.')[-1].lower()}")
    elif filename.lower().endswith('.pdf'):
        return FileResponse(file_path, media_type="application/pdf")
    elif filename.lower().endswith(('.txt', '.csv', '.html', '.htm', '.xml', '.json')):
        return FileResponse(file_path, media_type="text/plain")
    elif filename.lower().endswith(('.mp4', '.webm')):
        return FileResponse(file_path, media_type=f"video/{filename.split('.')[-1].lower()}")
    elif filename.lower().endswith(('.mp3', '.wav', '.ogg')):
        return FileResponse(file_path, media_type=f"audio/{filename.split('.')[-1].lower()}")
    else:
        # For unsupported types, force download
        return FileResponse(
            file_path,
            media_type="application/octet-stream",
            filename=filename,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

@app.get("/download/{filename}")
async def download_file(filename: str, username: str = Depends(get_current_username)):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(404, "File not found")
    return FileResponse(file_path, media_type="application/octet-stream", filename=filename)


@app.delete("/files/{filename}")
async def delete_file(filename: str, username: str = Depends(get_current_username)):
    safe_filename = os.path.basename(filename)
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    if not os.path.exists(file_path):
        raise HTTPException(404, "File not found")
    os.remove(file_path)
    return {"status": "File deleted successfully"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="../frontend/public"), name="static")


@app.get("/web", response_class=HTMLResponse)
async def serve_frontend():
    with open("../frontend/public/index.html") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)