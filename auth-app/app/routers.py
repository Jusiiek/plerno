from typing import Optional

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from beanie import PydanticObjectId
from pydantic import BaseModel

from app.models import User
from app.managers import UserManager


class UserLoginCredentials(BaseModel):
    email: str
    password: str


class UserRegisterCredentials(UserLoginCredentials):
    pass


class UserDetails(BaseModel):
    id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserLoginResponse(UserDetails):
    token: str


def get_auth_router(user_manager: UserManager) -> APIRouter:
    router = APIRouter(prefix="/auth/jwt", tags=["auth"])

    @router.post("/login", response_model=UserLoginResponse)
    async def login(credentials: UserLoginCredentials):
        user = await user_manager.authenticate_user(credentials.email, credentials.password)
        if user is None:
            raise HTTPException(status_code=404, detail="Invalid User credentials")

        token = await user_manager.create_access_token(user)
        res = UserLoginResponse(
            token=token,
            email=user.email,
            id=str(user.id),
            first_name=user.first_name,
            last_name=user.last_name
        )
        return res

    @router.post("/register")
    async def register(credentials: UserRegisterCredentials):
        existing = await user_manager.get_user_by_email(credentials.email)
        if existing:
            raise HTTPException(status_code=400, detail="User already exists")
        await user_manager.create_user(credentials.dict())
        return JSONResponse(
            content={"details": "Successfully registered"},
            status_code=201
        )

    @router.post("/logout")
    async def logout(user_and_token: tuple = Depends(user_manager.get_current_user_and_token)):
        _, token = user_and_token
        await user_manager.logout_user(token)
        raise HTTPException(status_code=401, detail="Logout successful")

    return router


def get_user_router(user_manager: UserManager) -> APIRouter:
    router = APIRouter(prefix="/users", tags=["users"], dependencies=[Depends(user_manager.get_current_user)])

    @router.get("/")
    async def get_users():
        users = await User.find_all().to_list()
        users = [
            UserDetails(
                **user.dict(exclude={"id"}),
                id=str(user.id)
            )
            for user in users
        ]
        return users


    @router.get("/me", response_model=UserDetails)
    async def get_user_by_id(
            user=Depends(user_manager.get_current_user)
    ):
        return UserDetails(
            **user.dict(exclude={"id"}),
            id=str(user.id)
        )


    @router.get("/{user_id}")
    async def get_user_by_id(user_id: PydanticObjectId):
        user = await User.get(user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return UserDetails(
            **user.dict(exclude={"id"}),
            id=str(user.id)
        )

    return router
