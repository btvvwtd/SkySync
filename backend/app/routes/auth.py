from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas.user import UserCreate, UserResponse, Token, GoogleLogin
from ..dependencies.auth import (
    get_password_hash,
    create_access_token,
    get_current_user,
    verify_password,
)
from ..config.database import get_db
from google.oauth2 import id_token
from google.auth.transport import requests

router = APIRouter()


@router.get("/check-email/{email}")
def check_email(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    return {"exists": user is not None}


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        hashed_password=hashed_password,
        first_name=user.firstName,
        last_name=user.lastName,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"email": new_user.email}


@router.post("/token", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return {"email": current_user.email}


@router.post("/auth/google", response_model=Token)
async def google_login(google_user: GoogleLogin, db: Session = Depends(get_db)):
    try:
        idinfo = id_token.verify_oauth2_token(
            google_user.id_token,
            requests.Request(),
            "567391164162-4md16qmddhllj6hpe4e818edsnug4fmh.apps.googleusercontent.com",
        )
        email = idinfo["email"]
        first_name = idinfo.get("given_name", "")
        last_name = idinfo.get("family_name", "")

        db_user = db.query(User).filter(User.email == email).first()
        if not db_user:
            new_user = User(
                email=email,
                hashed_password=None,
                first_name=first_name,
                last_name=last_name,
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)

        access_token = create_access_token(data={"sub": email})
        return {"access_token": access_token, "token_type": "bearer"}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Google token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
