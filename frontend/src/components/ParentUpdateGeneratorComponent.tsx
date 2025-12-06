import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useContent } from '@/contexts/ContentContext';
import { toast } from 'sonner';
import { MessageSquareText, Copy, Trash2 } from 'lucide-react';

interface ParentUpdateGeneratorComponentProps {
  projectId: string;
}

const ParentUpdateGeneratorComponent: React.FC<ParentUpdateGeneratorComponentProps> = ({ projectId }) => {
  const { parentUpdates, createParentUpdate, deleteParentUpdate } = useContent();
  const [studentDataInput, setStudentDataInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [viewingContent, setViewingContent] = useState<{ content: string; title: string } | null>(null);

  const handleGenerate = async () => {
    if (!studentDataInput.trim()) {
      toast.error('Please provide student performance data.');
      return;
    }

    setGenerating(true);
    try {
      await createParentUpdate(projectId, studentDataInput);
      setStudentDataInput('');
    } catch (error) {
      toast.error('Failed to generate parent updates.');
      console.error('Generation error:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`"${title}" copied to clipboard!`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the update for "${name}"?`)) {
      const success = await deleteParentUpdate(id);
      if (success) {
        toast.success(`Update for "${name}" deleted.`);
      } else {
        toast.error(`Failed to delete update for "${name}".`);
      }
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Parent Updates</CardTitle>
          <CardDescription>
            Upload student performance data (CSV format) to generate personalized parent communication drafts.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="studentData">Student Performance Data (CSV)</Label>
            <Textarea
              id="studentData"
              placeholder="e.g., John Doe,85,Good progress in algebra&#10;Jane Smith,72,Needs more practice in fractions"
              value={studentDataInput}
              onChange={(e) => setStudentDataInput(e.target.value)}
              rows={5}
              required
            />
            <p className="text-sm text-muted-foreground">
              Format: `Student Name,Marks,Comments` (one student per line)
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={generating} className="w-full">
            {generating ? 'Generating...' : 'Generate Parent Updates'}
          </Button>
        </CardFooter>
      </Card>

      {viewingContent && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">{viewingContent.title}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setViewingContent(null)}>
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              value={viewingContent.content}
              readOnly
              rows={15}
              className="font-mono text-sm resize-none"
            />
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handleCopyToClipboard(viewingContent.content, viewingContent.title)}
              className="w-full"
            >
              <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
            </Button>
          </CardFooter>
        </Card>
      )}

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4">Generated Parent Updates</h3>
      {parentUpdates.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No parent updates generated yet.</p>
      ) : (
        <div className="grid gap-4">
          {parentUpdates.map((pu) => (
            <Card key={pu.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">Update for {pu.studentName}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => setViewingContent({ content: pu.draftText, title: `Update for ${pu.studentName}` })}>
                    <MessageSquareText className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(pu.id, pu.studentName)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Generated: {new Date(pu.createdAt).toLocaleDateString()}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleCopyToClipboard(pu.draftText, `Update for ${pu.studentName}`)} className="w-full">
                  <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentUpdateGeneratorComponent;