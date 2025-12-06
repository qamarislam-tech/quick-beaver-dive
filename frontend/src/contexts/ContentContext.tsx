import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LessonPlan, Worksheet, ParentUpdate } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import {
  getLessonPlans, createLessonPlan as apiCreateLessonPlan, deleteLessonPlan as apiDeleteLessonPlan,
  getWorksheets, createWorksheet as apiCreateWorksheet, deleteWorksheet as apiDeleteWorksheet,
  getParentUpdates as apiGetParentUpdates, generateParentUpdates as apiGenerateParentUpdates, deleteParentUpdate as apiDeleteParentUpdate
} from '@/api/client';

interface ContentContextType {
  lessonPlans: LessonPlan[];
  worksheets: Worksheet[];
  parentUpdates: ParentUpdate[];
  createLessonPlan: (projectId: string, subject: string, level: string, topic: string) => Promise<LessonPlan | null>;
  createWorksheet: (projectId: string, subject: string, level: string, topic: string) => Promise<Worksheet | null>;
  createParentUpdate: (projectId: string, studentData: string) => Promise<ParentUpdate[] | null>;
  deleteLessonPlan: (id: string) => Promise<boolean>;
  deleteWorksheet: (id: string) => Promise<boolean>;
  deleteParentUpdate: (id: string) => Promise<boolean>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children, projectId }: { children: ReactNode; projectId: string }) => {
  const { user, isAuthenticated } = useAuth();
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [parentUpdates, setParentUpdates] = useState<ParentUpdate[]>([]);

  // Load content specific to the current project and user
  useEffect(() => {
    const fetchContent = async () => {
      if (isAuthenticated && user?.id && projectId) {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const fetchedLessonPlans = await getLessonPlans(token, projectId);
            setLessonPlans(fetchedLessonPlans);

            const fetchedWorksheets = await getWorksheets(token, projectId);
            setWorksheets(fetchedWorksheets);

            const fetchedParentUpdates = await apiGetParentUpdates(token, projectId);
            setParentUpdates(fetchedParentUpdates);
          }
        } catch (error) {
          console.error("Failed to fetch content:", error);
          toast.error("Failed to load content.");
        }
      } else {
        setLessonPlans([]);
        setWorksheets([]);
        setParentUpdates([]);
      }
    };
    fetchContent();
  }, [isAuthenticated, user, projectId]);

  const saveToLocalStorage = (key: string, data: any[]) => {
    const allItems = JSON.parse(localStorage.getItem(key) || '[]');
    const otherProjectsItems = allItems.filter((item: any) => item.projectId !== projectId);
    localStorage.setItem(key, JSON.stringify([...otherProjectsItems, ...data]));
  };

  const createLessonPlan = async (projectId: string, subject: string, level: string, topic: string): Promise<LessonPlan | null> => {
    if (!user?.id) return null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found");
      const newLessonPlan = await apiCreateLessonPlan(token, projectId, subject, level, topic);
      setLessonPlans([...lessonPlans, newLessonPlan]);
      toast.success('Lesson Plan generated successfully!');
      return newLessonPlan;
    } catch (error) {
      console.error("Failed to create lesson plan:", error);
      toast.error("Failed to generate lesson plan.");
      return null;
    }
  };

  const createWorksheet = async (projectId: string, subject: string, level: string, topic: string): Promise<Worksheet | null> => {
    if (!user?.id) return null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found");
      const newWorksheet = await apiCreateWorksheet(token, projectId, subject, level, topic);
      setWorksheets([...worksheets, newWorksheet]);
      toast.success('Worksheet generated successfully!');
      return newWorksheet;
    } catch (error) {
      console.error("Failed to create worksheet:", error);
      toast.error("Failed to generate worksheet.");
      return null;
    }
  };

  const createParentUpdate = async (projectId: string, studentData: string): Promise<ParentUpdate[] | null> => {
    if (!user?.id) return null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found");

      const generatedUpdates = await apiGenerateParentUpdates(token, projectId, studentData);
      
      if (generatedUpdates && generatedUpdates.length > 0) {
        setParentUpdates([...parentUpdates, ...generatedUpdates]);
        toast.success(`${generatedUpdates.length} Parent Update(s) generated successfully!`);
        return generatedUpdates;
      } else {
        toast.warning('No updates generated. Check input format.');
        return null;
      }
    } catch (error) {
      console.error("Failed to generate parent updates:", error);
      toast.error("Failed to generate parent updates.");
      return null;
    }
  };

  const deleteContentItem = (key: string, id: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
    const allItems = JSON.parse(localStorage.getItem(key) || '[]');
    const updatedItems = allItems.filter((item: any) => item.id !== id);
    localStorage.setItem(key, JSON.stringify(updatedItems));
    setter((prev: any[]) => prev.filter((item) => item.id !== id));
    return true;
  };

  const deleteLessonPlan = async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      await apiDeleteLessonPlan(token, id);
      setLessonPlans(lessonPlans.filter(lp => lp.id !== id));
      return true;
    } catch (error) {
      console.error("Failed to delete lesson plan:", error);
      toast.error("Failed to delete lesson plan.");
      return false;
    }
  };

  const deleteWorksheet = async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      await apiDeleteWorksheet(token, id);
      setWorksheets(worksheets.filter(ws => ws.id !== id));
      return true;
    } catch (error) {
      console.error("Failed to delete worksheet:", error);
      toast.error("Failed to delete worksheet.");
      return false;
    }
  };

  const deleteParentUpdate = async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      await apiDeleteParentUpdate(token, id);
      setParentUpdates(parentUpdates.filter(pu => pu.id !== id));
      return true;
    } catch (error) {
      console.error("Failed to delete parent update:", error);
      toast.error("Failed to delete parent update.");
      return false;
    }
  };

  return (
    <ContentContext.Provider
      value={{
        lessonPlans,
        worksheets,
        parentUpdates,
        createLessonPlan,
        createWorksheet,
        createParentUpdate,
        deleteLessonPlan,
        deleteWorksheet,
        deleteParentUpdate,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};