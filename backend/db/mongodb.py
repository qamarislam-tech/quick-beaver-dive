from motor.motor_asyncio import AsyncIOMotorClient
from ..core.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    db_name: str = "quick-beaver-dive"

    async def connect_to_database(self):
        self.client = AsyncIOMotorClient(settings.MONGODB_URI)
        print("Connected to MongoDB.")

    async def close_database_connection(self):
        if self.client:
            self.client.close()
            print("MongoDB connection closed.")

db = MongoDB()

async def get_database():
    return db.client[db.db_name]