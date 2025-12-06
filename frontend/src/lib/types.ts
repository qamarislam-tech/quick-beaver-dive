export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonPlan {
  id: string;
  projectId: string;
  fileName: string;
  content: string;
  exportFormat: 'word' | 'pdf';
  createdAt: string;
}

export interface Worksheet {
  id: string;
  projectId: string;
  fileName: string;
  content: string;
  exportFormat: 'word' | 'pdf';
  createdAt: string;
}

export interface ParentUpdate {
  id: string;
  projectId: string;
  studentName: string;
  fileName: string;
  draftText: string;
  createdAt: string;
}