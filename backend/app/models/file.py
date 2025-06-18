from sqlalchemy import Column, Integer, String, DateTime
from ..config.database import Base
from datetime import datetime


class File(Base):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    filepath = Column(String)
    user_id = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
