from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class LessonPlanBase(BaseModel):
    subject: str
    level: str
    topic: str

class LessonPlanCreate(LessonPlanBase):
    project_id: str

class LessonPlanInDB(LessonPlanBase):
    id: str = Field(alias="_id")
    project_id: str
    file_name: str
    content: str
    export_format: str = "pdf"
    created_at: datetime

class LessonPlanResponse(LessonPlanBase):
    id: str
    project_id: str
    file_name: str
    content: str
    export_format: str
    created_at: datetime

class ParentUpdateBase(BaseModel):
    student_name: str
    marks: str
    comments: str

class ParentUpdateBatchRequest(BaseModel):
    project_id: str
    student_data: str

class ParentUpdateInDB(ParentUpdateBase):
    id: str = Field(alias="_id")
    project_id: str
    file_name: str
    draft_text: str
    created_at: datetime

class ParentUpdateResponse(ParentUpdateBase):
    id: str
    project_id: str
    file_name: str
    draft_text: str
    created_at: datetime

class WorksheetBase(BaseModel):
    subject: str
    level: str
    topic: str

class WorksheetCreate(WorksheetBase):
    project_id: str

class WorksheetInDB(WorksheetBase):
    id: str = Field(alias="_id")
    project_id: str
    file_name: str
    content: str
    export_format: str = "pdf"
    created_at: datetime

class WorksheetResponse(WorksheetBase):
    id: str
    project_id: str
    file_name: str
    content: str
    export_format: str
    created_at: datetime