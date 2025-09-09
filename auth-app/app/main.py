import os

import uvicorn
from fastapi import FastAPI, Request
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.models import User
from app.managers import UserManager
from app.routers import get_auth_router, get_user_router
from starlette.middleware.cors import CORSMiddleware


def create_app() -> FastAPI:
    """
    Creates FastAPI application.
    """
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )

    @app.middleware("http")
    async def log_client_ip(request: Request, call_next):
        client_host = request.client.host
        print(f"Incoming request from: {client_host} -> {request.url}")
        response = await call_next(request)
        return response

    return app


app = create_app()
user_manager = UserManager()


@app.on_event("startup")
async def app_init():
    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["users"]
    await init_beanie(database=db, document_models=[User])

    app.include_router(get_auth_router(user_manager))
    app.include_router(get_user_router(user_manager))


def run_dev_server():
    host = os.environ.get("HOST", "localhost")
    print(f"Starting server on {host}:8000")
    uvicorn.run(
        "app.main:app",
        host=host,
        port=8000,
        reload=True,
        workers=2,
    )


if __name__ == '__main__':
    run_dev_server()
