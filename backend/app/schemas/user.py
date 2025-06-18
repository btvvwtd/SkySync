from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    password: str
    firstName: str
    lastName: str


class UserResponse(BaseModel):
    email: str

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class GoogleLogin(BaseModel):
    id_token: str
