import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { projects, createProject, renameProject, deleteProject } = useProjects();
  const navigate = useNavigate();
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false);
  const [isRenameProjectDialogOpen, setIsRenameProjectDialogOpen] = useState(false);
  const [currentProjectToRename, setCurrentProjectToRename] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      const project = await createProject(newProjectName.trim());
      if (project) {
        toast.success(`Project "${project.name}" created!`);
        setNewProjectName('');
        setIsCreateProjectDialogOpen(false);
      } else {
        toast.error('Failed to create project.');
      }
    }
  };

  const handleRenameProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProjectToRename && renameInput.trim()) {
      const success = await renameProject(currentProjectToRename, renameInput.trim());
      if (success) {
        toast.success(`Project renamed to "${renameInput.trim()}"`);
        setIsRenameProjectDialogOpen(false);
        setCurrentProjectToRename(null);
        setRenameInput('');
      } else {
        toast.error('Failed to rename project.');
      }
    }
  };

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (window.confirm(`Are you sure you want to delete project "${projectName}"? This action cannot be undone.`)) {
      const success = await deleteProject(projectId);
      if (success) {
        toast.success(`Project "${projectName}" deleted.`);
      } else {
        toast.error(`Failed to delete project "${projectName}".`);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.info('You have been logged out.');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.name || user?.email}!
        </h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      <div className="mb-8">
        <Dialog open={isCreateProjectDialogOpen} onOpenChange={setIsCreateProjectDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Create New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Give your new teaching project a name.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="e.g., PSLE Math - Fractions"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit">Create Project</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No projects yet. Create one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>Created: {new Date(project.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setCurrentProjectToRename(project.id);
                    setRenameInput(project.name);
                    setIsRenameProjectDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteProject(project.id, project.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button onClick={() => navigate(`/project/${project.id}`)}>Open Project</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rename Project Dialog */}
      <Dialog open={isRenameProjectDialogOpen} onOpenChange={setIsRenameProjectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Enter a new name for your project.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRenameProject} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="renameProjectName">New Project Name</Label>
              <Input
                id="renameProjectName"
                placeholder="e.g., PSLE Math - Algebra"
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">Rename</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPage;