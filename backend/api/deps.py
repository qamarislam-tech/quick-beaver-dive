from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from bson import ObjectId
from backend.core.config import settings
from backend.core.security import ALGORITHM
from backend.db.mongodb import get_database
from backend.models.user import UserResponse

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db = Depends(get_database)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.InvalidTokenError:
        raise credentials_exception
    
    try:
        object_id = ObjectId(user_id)
    except:
        raise credentials_exception
        
    user = await db.users.find_one({"_id": object_id})
    if user is None:
        raise credentials_exception
    
    return UserResponse(
        email=user["email"],
        name=user.get("name"),
        id=str(user["_id"])
    )