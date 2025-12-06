import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LessonPlan, Worksheet, ParentUpdate } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

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
    if (isAuthenticated && user?.id && projectId) {
      const allLessonPlans = JSON.parse(localStorage.getItem('lessonPlans') || '[]');
      setLessonPlans(allLessonPlans.filter((lp: LessonPlan) => lp.projectId === projectId));

      const allWorksheets = JSON.parse(localStorage.getItem('worksheets') || '[]');
      setWorksheets(allWorksheets.filter((ws: Worksheet) => ws.projectId === projectId));

      const allParentUpdates = JSON.parse(localStorage.getItem('parentUpdates') || '[]');
      setParentUpdates(allParentUpdates.filter((pu: ParentUpdate) => pu.projectId === projectId));
    } else {
      setLessonPlans([]);
      setWorksheets([]);
      setParentUpdates([]);
    }
  }, [isAuthenticated, user, projectId]);

  const saveToLocalStorage = (key: string, data: any[]) => {
    const allItems = JSON.parse(localStorage.getItem(key) || '[]');
    const otherProjectsItems = allItems.filter((item: any) => item.projectId !== projectId);
    localStorage.setItem(key, JSON.stringify([...otherProjectsItems, ...data]));
  };

  const createLessonPlan = async (projectId: string, subject: string, level: string, topic: string): Promise<LessonPlan | null> => {
    if (!user?.id) return null;

    // Simulate AI generation
    const content = `
      ## Lesson Plan: ${subject} - ${level} - ${topic}

      **Objectives:**
      1. Students will be able to define key concepts related to ${topic}.
      2. Students will be able to apply formulas/principles of ${topic} to solve problems.
      3. Students will demonstrate understanding through practice questions.

      **Materials:** Whiteboard, markers, worksheets, textbooks.

      **Lesson Flow:**
      1. **Introduction (10 min):**
         - Review previous topic.
         - Introduce ${topic} with real-world examples.
         - Discuss learning objectives.
      2. **Concept Explanation (20 min):**
         - Explain core theories and definitions.
         - Work through example problems.
      3. **Guided Practice (15 min):**
         - Students attempt questions with teacher guidance.
      4. **Independent Practice (15 min):**
         - Students work on worksheet questions.
      5. **Conclusion & Q&A (10 min):**
         - Summarize key takeaways.
         - Address student questions.
         - Assign homework.

      **Assessment:** Observation, worksheet completion, Q&A.
    `;

    const newLessonPlan: LessonPlan = {
      id: uuidv4(),
      projectId,
      fileName: `${subject}-${level}-${topic}-LessonPlan.txt`,
      content,
      exportFormat: 'pdf', // Default for simulation
      createdAt: new Date().toISOString(),
    };
    const updatedLessonPlans = [...lessonPlans, newLessonPlan];
    setLessonPlans(updatedLessonPlans);
    saveToLocalStorage('lessonPlans', updatedLessonPlans);
    toast.success('Lesson Plan generated successfully!');
    return newLessonPlan;
  };

  const createWorksheet = async (projectId: string, subject: string, level: string, topic: string): Promise<Worksheet | null> => {
    if (!user?.id) return null;

    // Simulate AI generation
    const content = `
      ## Worksheet: ${subject} - ${level} - ${topic}

      **Instructions:** Answer all questions. Show your working clearly.

      **Section A: Multiple Choice Questions**
      1. Which of the following best describes ${topic}?
         a) Option A
         b) Option B
         c) Option C
         d) Option D
         *Suggested Answer: c)*

      2. What is the primary function of [concept related to topic]?
         a) Option A
         b) Option B
         c) Option C
         d) Option D
         *Suggested Answer: a)*

      **Section B: Structured Questions**
      3. Explain in your own words the concept of ${topic}. (3 marks)
         *Suggested Answer: [Detailed explanation of topic]*

      4. A problem involves [scenario related to topic]. Calculate [value]. (4 marks)
         *Suggested Answer: [Step-by-step solution]*

      5. Discuss two real-world applications of ${topic}. (4 marks)
         *Suggested Answer: [Application 1 with explanation, Application 2 with explanation]*
    `;

    const newWorksheet: Worksheet = {
      id: uuidv4(),
      projectId,
      fileName: `${subject}-${level}-${topic}-Worksheet.txt`,
      content,
      exportFormat: 'pdf', // Default for simulation
      createdAt: new Date().toISOString(),
    };
    const updatedWorksheets = [...worksheets, newWorksheet];
    setWorksheets(updatedWorksheets);
    saveToLocalStorage('worksheets', updatedWorksheets);
    toast.success('Worksheet generated successfully!');
    return newWorksheet;
  };

  const createParentUpdate = async (projectId: string, studentData: string): Promise<ParentUpdate[] | null> => {
    if (!user?.id) return null;

    const updates: ParentUpdate[] = [];
    const lines = studentData.trim().split('\n');
    if (lines.length === 0) {
      toast.error('No student data provided.');
      return null;
    }

    // Assuming studentData is a simple CSV-like string: StudentName,Marks,Comments
    for (const line of lines) {
      const parts = line.split(',');
      if (parts.length < 3) {
        console.warn('Skipping malformed student data line:', line);
        continue;
      }
      const studentName = parts[0].trim();
      const marks = parts[1].trim();
      const comments = parts[2].trim();

      const draftText = `
        Dear Parent of ${studentName},

        I hope this message finds you well.

        Here is a quick update on ${studentName}'s progress in class this week.
        ${studentName} scored ${marks} on the recent assessment.

        **Strengths:** ${studentName} has shown good understanding in [mention a strength based on comments or mock data].
        **Areas for Improvement:** We will be focusing on [mention an area for improvement based on comments or mock data].

        Please encourage ${studentName} to review [specific topic/area] at home.
        If you have any questions, please feel free to reach out.

        Best regards,
        [Teacher's Name - e.g., Mr. Lee]
      `;

      updates.push({
        id: uuidv4(),
        projectId,
        studentName,
        fileName: `${studentName}-ParentUpdate.txt`,
        draftText,
        createdAt: new Date().toISOString(),
      });
    }

    if (updates.length > 0) {
      const updatedParentUpdates = [...parentUpdates, ...updates];
      setParentUpdates(updatedParentUpdates);
      saveToLocalStorage('parentUpdates', updatedParentUpdates);
      toast.success(`${updates.length} Parent Update(s) generated successfully!`);
      return updates;
    }
    toast.error('Failed to generate any parent updates. Check student data format.');
    return null;
  };

  const deleteContentItem = (key: string, id: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
    const allItems = JSON.parse(localStorage.getItem(key) || '[]');
    const updatedItems = allItems.filter((item: any) => item.id !== id);
    localStorage.setItem(key, JSON.stringify(updatedItems));
    setter((prev: any[]) => prev.filter((item) => item.id !== id));
    return true;
  };

  const deleteLessonPlan = async (id: string): Promise<boolean> => {
    return deleteContentItem('lessonPlans', id, setLessonPlans);
  };

  const deleteWorksheet = async (id: string): Promise<boolean> => {
    return deleteContentItem('worksheets', id, setWorksheets);
  };

  const deleteParentUpdate = async (id: string): Promise<boolean> => {
    return deleteContentItem('parentUpdates', id, setParentUpdates);
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