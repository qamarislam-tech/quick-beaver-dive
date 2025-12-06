import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '@/contexts/ProjectContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { ContentProvider } from '@/contexts/ContentContext'; // Import ContentProvider
import LessonPlanWorksheetGenerator from '@/components/LessonPlanWorksheetGenerator'; // Import new component
import ParentUpdateGeneratorComponent from '@/components/ParentUpdateGeneratorComponent'; // Import new component

const ProjectWorkspacePage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { getProjectById } = useProjects();
  const project = projectId ? getProjectById(projectId) : undefined;

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Project Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">The project you are looking for does not exist or you do not have access.</p>
            <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Project: {project.name}
        </h1>
      </div>

      <ContentProvider projectId={project.id}> {/* Wrap with ContentProvider */}
        <Tabs defaultValue="lesson-plans" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lesson-plans">Lesson Plans</TabsTrigger>
            <TabsTrigger value="worksheets">Worksheets</TabsTrigger>
            <TabsTrigger value="parent-updates">Parent Updates</TabsTrigger>
          </TabsList>
          <TabsContent value="lesson-plans" className="mt-4">
            <LessonPlanWorksheetGenerator projectId={project.id} />
          </TabsContent>
          <TabsContent value="worksheets" className="mt-4">
            <LessonPlanWorksheetGenerator projectId={project.id} />
          </TabsContent>
          <TabsContent value="parent-updates" className="mt-4">
            <ParentUpdateGeneratorComponent projectId={project.id} />
          </TabsContent>
        </Tabs>
      </ContentProvider>
    </div>
  );
};

export default ProjectWorkspacePage;