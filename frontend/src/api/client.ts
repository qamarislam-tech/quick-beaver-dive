export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function checkHealth(): Promise<{ status: string; db: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/healthz`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Health Check Error:", error);
    throw error;
  }
}

export async function register(email: string, password: string, name?: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Registration failed');
  }

  return response.json();
}

// Project API
export async function getProjects(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }

  return response.json();
}

export async function createProject(token: string, name: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error('Failed to create project');
  }

  return response.json();
}

export async function getProject(token: string, projectId: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects/${projectId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch project');
  }

  return response.json();
}

export async function updateProject(token: string, projectId: string, name: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error('Failed to update project');
  }

  return response.json();
}

export async function deleteProject(token: string, projectId: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects/${projectId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete project');
  }

  return true;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed');
  }

  return response.json();
}

export async function getMe(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
     throw new Error('Failed to fetch user');
  }

  return response.json();
}

// Content API

// Lesson Plans
export async function getLessonPlans(token: string, projectId: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/lesson-plans?project_id=${projectId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch lesson plans');
  }

  const data = await response.json();
  return data.map((item: { id: string; project_id: string; file_name: string; content: string; export_format: string; created_at: string }) => ({
    id: item.id,
    projectId: item.project_id,
    fileName: item.file_name,
    content: item.content,
    exportFormat: item.export_format,
    createdAt: item.created_at,
  }));
}

export async function createLessonPlan(token: string, projectId: string, subject: string, level: string, topic: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/lesson-plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ project_id: projectId, subject, level, topic }),
  });

  if (!response.ok) {
    throw new Error('Failed to create lesson plan');
  }

  const item = await response.json();
  return {
    id: item.id,
    projectId: item.project_id,
    fileName: item.file_name,
    content: item.content,
    exportFormat: item.export_format,
    createdAt: item.created_at,
  };
}

export async function deleteLessonPlan(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/lesson-plans/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete lesson plan');
  }

  return true;
}

// Worksheets
export async function getWorksheets(token: string, projectId: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/worksheets?project_id=${projectId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch worksheets');
  }

  const data = await response.json();
  return data.map((item: { id: string; project_id: string; file_name: string; content: string; export_format: string; created_at: string }) => ({
    id: item.id,
    projectId: item.project_id,
    fileName: item.file_name,
    content: item.content,
    exportFormat: item.export_format,
    createdAt: item.created_at,
  }));
}

export async function createWorksheet(token: string, projectId: string, subject: string, level: string, topic: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/worksheets`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ project_id: projectId, subject, level, topic }),
  });

  if (!response.ok) {
    throw new Error('Failed to create worksheet');
  }

  const item = await response.json();
  return {
    id: item.id,
    projectId: item.project_id,
    fileName: item.file_name,
    content: item.content,
    exportFormat: item.export_format,
    createdAt: item.created_at,
  };
}

export async function deleteWorksheet(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/worksheets/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete worksheet');
  }

  return true;
}

// Parent Updates
export async function getParentUpdates(token: string, projectId: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/parent-updates?project_id=${projectId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch parent updates');
  }

  const data = await response.json();
  return data.map((item: { id: string; project_id: string; student_name: string; file_name: string; draft_text: string; created_at: string; marks: number; comments: string }) => ({
    id: item.id,
    projectId: item.project_id,
    studentName: item.student_name,
    fileName: item.file_name,
    draftText: item.draft_text,
    createdAt: item.created_at,
    marks: item.marks,
    comments: item.comments,
  }));
}

export async function generateParentUpdates(token: string, projectId: string, studentData: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/parent-updates/batch-generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ project_id: projectId, student_data: studentData }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate parent updates');
  }

  const data = await response.json();
  return data.map((item: { id: string; project_id: string; student_name: string; file_name: string; draft_text: string; created_at: string; marks: number; comments: string }) => ({
    id: item.id,
    projectId: item.project_id,
    studentName: item.student_name,
    fileName: item.file_name,
    draftText: item.draft_text,
    createdAt: item.created_at,
    marks: item.marks,
    comments: item.comments,
  }));
}

export async function deleteParentUpdate(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/parent-updates/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete parent update');
  }

  return true;
}