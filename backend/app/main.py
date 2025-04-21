from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse

from app.api.routes import auth, files, users
from app.db.database import Base, engine

import os

app = FastAPI()

# Створення таблиць у базі при старті (можна прибрати, якщо будеш робити через Alembic)
Base.metadata.create_all(bind=engine)

# Підключення роутів
app.include_router(auth.router)
app.include_router(files.router)
app.include_router(users.router, prefix="/users", tags=["Users"])  # новий роут

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Редірект з кореня на фронтенд
@app.get("/")
async def root():
    return RedirectResponse(url="/web")

# Статика
app.mount("/static", StaticFiles(directory="../frontend/public"), name="static")

# Віддача index.html
@app.get("/web", response_class=HTMLResponse)
async def serve_frontend():
    with open("../frontend/public/index.html") as f:
        return HTMLResponse(content=f.read())
