import os
import asyncio
import json
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.managers import UserManager
from app.models import User


FIXTURE_PATH = os.path.join(os.path.dirname(__file__), "fixtures.json")


async def load_users():
    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["users"]

    await init_beanie(database=db, document_models=[User])

    user_manager = UserManager()

    with open(FIXTURE_PATH) as f:
        users_data = json.load(f)

    for user_data in users_data:
        existing = await User.find_one(User.email == user_data["email"])
        if existing:
            print(f"User {user_data['email']} already exists, skipping.")
            continue
        user = await user_manager.create_user(user_data)
        print(f"Inserted user: {user.email}")

if __name__ == "__main__":
    asyncio.run(load_users())
