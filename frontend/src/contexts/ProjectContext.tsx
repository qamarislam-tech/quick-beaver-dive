import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  projects: Project[];
  createProject: (name: string) => Promise<Project | null>;
  renameProject: (projectId: string, newName: string) => Promise<boolean>;
  deleteProject: (projectId: string) => Promise<boolean>;
  getProjectById: (projectId: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      setProjects(storedProjects.filter((p: Project) => p.userId === user.id));
    } else {
      setProjects([]);
    }
  }, [isAuthenticated, user]);

  const saveProjectsToLocalStorage = (updatedProjects: Project[]) => {
    const allProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    const otherUsersProjects = allProjects.filter((p: Project) => p.userId !== user?.id);
    localStorage.setItem('projects', JSON.stringify([...otherUsersProjects, ...updatedProjects]));
  };

  const createProject = async (name: string): Promise<Project | null> => {
    if (!user?.id) return null;

    const newProject: Project = {
      id: uuidv4(),
      userId: user.id,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveProjectsToLocalStorage(updatedProjects);
    return newProject;
  };

  const renameProject = async (projectId: string, newName: string): Promise<boolean> => {
    if (!user?.id) return false;

    const updatedProjects = projects.map((p) =>
      p.id === projectId && p.userId === user.id
        ? { ...p, name: newName, updatedAt: new Date().toISOString() }
        : p
    );
    if (JSON.stringify(updatedProjects) === JSON.stringify(projects)) {
      return false; // No change or project not found for user
    }
    setProjects(updatedProjects);
    saveProjectsToLocalStorage(updatedProjects);
    return true;
  };

  const deleteProject = async (projectId: string): Promise<boolean> => {
    if (!user?.id) return false;

    const initialLength = projects.length;
    const updatedProjects = projects.filter((p) => p.id !== projectId || p.userId !== user.id);
    
    if (updatedProjects.length === initialLength) {
      return false; // Project not found or not owned by user
    }

    setProjects(updatedProjects);
    saveProjectsToLocalStorage(updatedProjects);
    
    // Also delete associated lesson plans, worksheets, and parent updates
    const allLessonPlans = JSON.parse(localStorage.getItem('lessonPlans') || '[]');
    const updatedLessonPlans = allLessonPlans.filter((lp: LessonPlan) => lp.projectId !== projectId);
    localStorage.setItem('lessonPlans', JSON.stringify(updatedLessonPlans));

    const allWorksheets = JSON.parse(localStorage.getItem('worksheets') || '[]');
    const updatedWorksheets = allWorksheets.filter((ws: Worksheet) => ws.projectId !== projectId);
    localStorage.setItem('worksheets', JSON.stringify(updatedWorksheets));

    const allParentUpdates = JSON.parse(localStorage.getItem('parentUpdates') || '[]');
    const updatedParentUpdates = allParentUpdates.filter((pu: ParentUpdate) => pu.projectId !== projectId);
    localStorage.setItem('parentUpdates', JSON.stringify(updatedParentUpdates));

    return true;
  };

  const getProjectById = (projectId: string): Project | undefined => {
    return projects.find((p) => p.id === projectId && p.userId === user?.id);
  };

  return (
    <ProjectContext.Provider value={{ projects, createProject, renameProject, deleteProject, getProjectById }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};