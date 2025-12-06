import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project } from '@/lib/types';
import { useAuth } from './AuthContext';
import * as api from '../api/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('token');
      if (isAuthenticated && user?.id && token) {
        try {
          const fetchedProjects = await api.getProjects(token);
          setProjects(fetchedProjects);
        } catch (error) {
          console.error("Failed to fetch projects", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load projects."
          });
        }
      } else {
        setProjects([]);
      }
    };

    fetchProjects();
  }, [isAuthenticated, user, toast]);

  const createProject = async (name: string): Promise<Project | null> => {
    const token = localStorage.getItem('token');
    if (!user?.id || !token) return null;

    try {
      const newProject = await api.createProject(token, name);
      setProjects([...projects, newProject]);
      toast({
        title: "Success",
        description: "Project created successfully."
      });
      return newProject;
    } catch (error) {
      console.error("Failed to create project", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create project."
      });
      return null;
    }
  };

  const renameProject = async (projectId: string, newName: string): Promise<boolean> => {
    const token = localStorage.getItem('token');
    if (!user?.id || !token) return false;

    try {
      const updatedProject = await api.updateProject(token, projectId, newName);
      setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
      toast({
        title: "Success",
        description: "Project renamed successfully."
      });
      return true;
    } catch (error) {
      console.error("Failed to rename project", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to rename project."
      });
      return false;
    }
  };

  const deleteProject = async (projectId: string): Promise<boolean> => {
    const token = localStorage.getItem('token');
    if (!user?.id || !token) return false;

    try {
      await api.deleteProject(token, projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      toast({
        title: "Success",
        description: "Project deleted successfully."
      });
      return true;
    } catch (error) {
      console.error("Failed to delete project", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete project."
      });
      return false;
    }
  };

  const getProjectById = (projectId: string): Project | undefined => {
    return projects.find((p) => p.id === projectId);
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