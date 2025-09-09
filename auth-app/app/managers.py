import bcrypt
from bson.errors import InvalidId
from jose import jwt, JWTError
from datetime import datetime, timedelta
from typing import Optional, Tuple
from beanie import PydanticObjectId
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from app.models import User


SECRET_KEY = "secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

blacklisted_tokens = set()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/jwt/login")


class PasswordManager:
    def hash_password(self, plain_password: str) -> str:
        """
        Hash a plain password using bcrypt.
        """
        hashed = bcrypt.hashpw(plain_password.encode(), bcrypt.gensalt())
        return hashed.decode()

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verify a plain password against its hashed version.
        """
        return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())


class UserManager:

    def __init__(self):
        self.password_manager = PasswordManager()

    async def get_user_by_email(self, email: str) -> Optional[User]:
        return await User.find_one(User.email == email)

    async def get_user_by_id(self, user_id: any) -> Optional[User]:
        user_id = await self.parse_id(user_id)
        user = await User.get(user_id)
        return user if user else None

    async def parse_id(self, user_id: any) -> Optional[PydanticObjectId]:
        if isinstance(user_id, PydanticObjectId):
            return user_id
        try:
            return PydanticObjectId(user_id)
        except InvalidId:
            return None

    async def get_current_user_and_token(self, token: str = Depends(oauth2_scheme)) -> Tuple[User, str]:
        if await self.is_token_blacklisted(token):
            raise HTTPException(status_code=401, detail="Token has been revoked")

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_data: str = payload.get("user")
            user_id: str = user_data["id"]
            if user_id is None:
                raise HTTPException(status_code=401, detail="Invalid token")
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = await self.get_user_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user, token

    async def get_current_user(self, token: str = Depends(oauth2_scheme)) -> User:
        user, _ = await self.get_current_user_and_token(token)
        return user

    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        user = await self.get_user_by_email(email)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        is_password_valid = self.password_manager.verify_password(password, user.hashed_password)
        if not is_password_valid:
            raise HTTPException(status_code=401, detail="Invalid password")

        return user

    async def create_user(self, user_data: dict) -> User:
        user_data["hashed_password"] = self.password_manager.hash_password(user_data["password"])
        del user_data["password"]
        user = User(**user_data)
        await user.insert()
        return user

    async def update_user(self, user_id: PydanticObjectId, update_data: dict) -> Optional[User]:
        user = await User.get(user_id)
        if user is None:
            return None
        for key, value in update_data.items():
            setattr(user, key, value)
        await user.save()
        return user

    async def delete_user(self, user_id: PydanticObjectId) -> bool:
        user = await User.get(user_id)
        if user is None:
            return False
        await user.delete()
        return True

    async def create_access_token(self, user_data: User):
        expire = datetime.utcnow() + timedelta(minutes=60)
        to_encode = {
            "user": {"email": user_data.email, "id": str(user_data.id)},
            "exp": expire
        }
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    async def logout_user(self, token: str):
        blacklisted_tokens.add(token)

    async def is_token_blacklisted(self, token: str) -> bool:
        return token in blacklisted_tokens
