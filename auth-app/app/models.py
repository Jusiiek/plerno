from beanie import Document
from typing import Optional


class User(Document):
    email: str
    hashed_password: str
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""

    class Settings:
        name = "users"
