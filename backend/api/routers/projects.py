from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson import ObjectId
from datetime import datetime

from backend.db.mongodb import get_database
from backend.api.deps import get_current_user
from backend.models.user import UserResponse
from backend.models.project import ProjectCreate, ProjectUpdate, ProjectResponse

router = APIRouter()

@router.get("/", response_model=List[ProjectResponse])
async def list_projects(
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_database)
):
    projects_cursor = db.projects.find({"user_id": ObjectId(current_user.id)})
    projects = await projects_cursor.to_list(length=100)
    
    return [
        ProjectResponse(
            id=str(p["_id"]),
            name=p["name"],
            user_id=str(p["user_id"]),
            created_at=p["created_at"],
            updated_at=p["updated_at"]
        ) for p in projects
    ]

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_in: ProjectCreate,
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_database)
):
    new_project = {
        "name": project_in.name,
        "user_id": ObjectId(current_user.id),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.projects.insert_one(new_project)
    
    return ProjectResponse(
        id=str(result.inserted_id),
        name=new_project["name"],
        user_id=str(new_project["user_id"]),
        created_at=new_project["created_at"],
        updated_at=new_project["updated_at"]
    )

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_database)
):
    try:
        obj_id = ObjectId(project_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid project ID")
        
    project = await db.projects.find_one({"_id": obj_id, "user_id": ObjectId(current_user.id)})
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    return ProjectResponse(
        id=str(project["_id"]),
        name=project["name"],
        user_id=str(project["user_id"]),
        created_at=project["created_at"],
        updated_at=project["updated_at"]
    )

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_in: ProjectUpdate,
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_database)
):
    try:
        obj_id = ObjectId(project_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid project ID")
        
    update_data = {
        "name": project_in.name,
        "updated_at": datetime.utcnow()
    }
    
    result = await db.projects.update_one(
        {"_id": obj_id, "user_id": ObjectId(current_user.id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        # Check if project exists to distinguish between not found and no change
        existing = await db.projects.find_one({"_id": obj_id, "user_id": ObjectId(current_user.id)})
        if not existing:
             raise HTTPException(status_code=404, detail="Project not found")
    
    project = await db.projects.find_one({"_id": obj_id})
    
    return ProjectResponse(
        id=str(project["_id"]),
        name=project["name"],
        user_id=str(project["user_id"]),
        created_at=project["created_at"],
        updated_at=project["updated_at"]
    )

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_database)
):
    try:
        obj_id = ObjectId(project_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid project ID")
        
    result = await db.projects.delete_one({"_id": obj_id, "user_id": ObjectId(current_user.id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")