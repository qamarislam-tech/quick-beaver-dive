from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from backend.api.deps import get_current_user, get_database
from backend.models.content import (
    LessonPlanCreate, LessonPlanResponse, LessonPlanInDB,
    WorksheetCreate, WorksheetResponse, WorksheetInDB,
    ParentUpdateBatchRequest, ParentUpdateResponse, ParentUpdateInDB
)
from backend.models.user import UserResponse
from backend.services.generation import generate_lesson_plan, generate_worksheet, generate_parent_update_text
from bson import ObjectId
from datetime import datetime

router = APIRouter()

async def verify_project_access(project_id: str, user_id: str, db):
    try:
        pid = ObjectId(project_id)
        uid = ObjectId(user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    project = await db.projects.find_one({"_id": pid, "user_id": str(uid)})
    if not project:
        # Fallback check if user_id was stored as ObjectId in projects (legacy check)
        project = await db.projects.find_one({"_id": pid, "user_id": uid})
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or access denied")
    return project

# --- Lesson Plans ---

@router.get("/lesson-plans", response_model=List[LessonPlanResponse])
async def list_lesson_plans(
    project_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_database)
):
    await verify_project_access(project_id, current_user.id, db)
    
    lesson_plans = await db.lesson_plans.find({"project_id": project_id}).to_list(1000)
    return [LessonPlanResponse(**lp, id=str(lp["_id"])) for lp in lesson_plans]

@router.post("/lesson-plans", response_model=LessonPlanResponse)
async def create_lesson_plan(
    data: LessonPlanCreate,
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_database)
):
    await verify_project_access(data.project_id, current_user.id, db)
    
    # Generate content
    content = generate_lesson_plan(data.subject, data.level, data.topic)
    
    new_lp = LessonPlanInDB(
        _id=str(ObjectId()), # Placeholder, actually Mongo generates it but we want to be explicit or let Mongo do it.
                             # Pydantic alias="_id" means we should pass "_id" or rely on default.
                             # Let's construct dict and insert.
        project_id=data.project_id,
        subject=data.subject,
        level=data.level,
        topic=data.topic,
        file_name=f"{data.subject}-{data.level}-{data.topic}-LessonPlan.txt",
        content=content,
        created_at=datetime.utcnow()
    )
    
    # Prepare for insertion (exclude id as we let Mongo or use the one we generated)
    lp_dict = new_lp.model_dump(by_alias=True, exclude={"id"}) 
    # If we excluded id, we need to ensure we don't pass a None _id if Pydantic defaults it. 
    # Actually, simpler to just create dict manually for insertion to ensure control.
    
    lp_doc = {
        "project_id": data.project_id,
        "subject": data.subject,
        "level": data.level,
        "topic": data.topic,
        "file_name": f"{data.subject}-{data.level}-{data.topic}-LessonPlan.txt",
        "content": content,
        "export_format": "pdf",
        "created_at": datetime.utcnow()
    }
    
    result = await db.lesson_plans.insert_one(lp_doc)
    lp_doc["id"] = str(result.inserted_id)
    
    return LessonPlanResponse(**lp_doc)

@router.delete("/lesson-plans/{id}")
async def delete_lesson_plan(
    id: str,
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_database)
):
    try:
        oid = ObjectId(id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID")
        
    lp = await db.lesson_plans.find_one({"_id": oid})
    if not lp:
        raise HTTPException(status_code=404, detail="Lesson Plan not found")
        
    # Verify ownership via project
    await verify_project_access(lp["project_id"], current_user.id, db)
    
    await db.lesson_plans.delete_one({"_id": oid})
    return {"message": "Lesson Plan deleted successfully"}

# --- Worksheets ---

@router.get("/worksheets", response_model=List[WorksheetResponse])
async def list_worksheets(
    project_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_database)
):
    await verify_project_access(project_id, current_user.id, db)
    
    worksheets = await db.worksheets.find({"project_id": project_id}).to_list(1000)
    return [WorksheetResponse(**ws, id=str(ws["_id"])) for ws in worksheets]

@router.post("/worksheets", response_model=WorksheetResponse)
async def create_worksheet(
    data: WorksheetCreate,
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_database)
):
    await verify_project_access(data.project_id, current_user.id, db)
    
    # Generate content
    content = generate_worksheet(data.subject, data.level, data.topic)
    
    ws_doc = {
        "project_id": data.project_id,
        "subject": data.subject,
        "level": data.level,
        "topic": data.topic,
        "file_name": f"{data.subject}-{data.level}-{data.topic}-Worksheet.txt",
        "content": content,
        "export_format": "pdf",
        "created_at": datetime.utcnow()
    }
    
    result = await db.worksheets.insert_one(ws_doc)
    ws_doc["id"] = str(result.inserted_id)
    
    return WorksheetResponse(**ws_doc)

@router.delete("/worksheets/{id}")
async def delete_worksheet(
    id: str,
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_database)
):
    try:
        oid = ObjectId(id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID")
        
    ws = await db.worksheets.find_one({"_id": oid})
    if not ws:
        raise HTTPException(status_code=404, detail="Worksheet not found")
        
    # Verify ownership via project
    await verify_project_access(ws["project_id"], current_user.id, db)
    
    await db.worksheets.delete_one({"_id": oid})
    return {"message": "Worksheet deleted successfully"}

# --- Parent Updates ---

@router.get("/parent-updates", response_model=List[ParentUpdateResponse])
async def list_parent_updates(
    project_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_database)
):
    await verify_project_access(project_id, current_user.id, db)
    
    updates = await db.parent_updates.find({"project_id": project_id}).to_list(1000)
    return [ParentUpdateResponse(**pu, id=str(pu["_id"])) for pu in updates]

@router.post("/parent-updates/batch-generate", response_model=List[ParentUpdateResponse])
async def batch_generate_parent_updates(
    data: ParentUpdateBatchRequest,
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_database)
):
    await verify_project_access(data.project_id, current_user.id, db)
    
    lines = data.student_data.strip().split('\n')
    generated_updates = []
    
    for line in lines:
        if not line.strip():
            continue
            
        parts = [p.strip() for p in line.split(',')]
        if len(parts) >= 3:
            name = parts[0]
            marks = parts[1]
            comments = ", ".join(parts[2:])
            
            draft = generate_parent_update_text(name, marks, comments)
            
            new_update = {
                "project_id": data.project_id,
                "student_name": name,
                "marks": marks,
                "comments": comments,
                "file_name": f"{name}-Update.txt",
                "draft_text": draft,
                "created_at": datetime.utcnow()
            }
            
            result = await db.parent_updates.insert_one(new_update)
            new_update["id"] = str(result.inserted_id)
            generated_updates.append(ParentUpdateResponse(**new_update))
            
    return generated_updates

@router.delete("/parent-updates/{id}")
async def delete_parent_update(
    id: str,
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_database)
):
    try:
        oid = ObjectId(id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID")
        
    pu = await db.parent_updates.find_one({"_id": oid})
    if not pu:
        raise HTTPException(status_code=404, detail="Parent Update not found")
        
    # Verify ownership via project
    await verify_project_access(pu["project_id"], current_user.id, db)
    
    await db.parent_updates.delete_one({"_id": oid})
    return {"message": "Parent Update deleted successfully"}