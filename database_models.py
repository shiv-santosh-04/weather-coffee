from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):

    __tablename__ = "login"

    username = Column(String, primary_key=True, nullable=False)
    password = Column(String, nullable=False)