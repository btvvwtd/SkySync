from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "1111"
    DB_HOST: str = "localhost"
    DB_PORT: str = "5432"
    DB_NAME: str = "skysync_db"

    # JWT
    SECRET_KEY: str  # Змінено з secret_key на SECRET_KEY
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    @property
    def database_url(self):
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()