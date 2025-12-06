import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useContent } from '@/contexts/ContentContext';
import { toast } from 'sonner';
import { FileText, Download, Trash2, Copy } from 'lucide-react';
import { Textarea } from './ui/textarea';

interface LessonPlanWorksheetGeneratorProps {
  projectId: string;
}

const LessonPlanWorksheetGenerator: React.FC<LessonPlanWorksheetGeneratorProps> = ({ projectId }) => {
  const { lessonPlans, worksheets, createLessonPlan, createWorksheet, deleteLessonPlan, deleteWorksheet } = useContent();
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('');
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [viewingContent, setViewingContent] = useState<{ type: 'lessonPlan' | 'worksheet'; content: string; title: string } | null>(null);

  const handleGenerate = async () => {
    if (!subject || !level || !topic) {
      toast.error('Please fill in all fields (Subject, Level, Topic).');
      return;
    }

    setGenerating(true);
    try {
      await createLessonPlan(projectId, subject, level, topic);
      await createWorksheet(projectId, subject, level, topic);
      setSubject('');
      setLevel('');
      setTopic('');
    } catch (error) {
      toast.error('Failed to generate content.');
      console.error('Generation error:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = (content: string, fileName: string) => {
    // Simulate Word/PDF download by creating a Blob and a temporary URL
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace('.txt', '.doc'); // Simulate Word document
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`"${fileName}" downloaded as a Word document.`);
  };

  const handleDelete = async (id: string, type: 'lessonPlan' | 'worksheet', name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      let success = false;
      if (type === 'lessonPlan') {
        success = await deleteLessonPlan(id);
      } else {
        success = await deleteWorksheet(id);
      }
      if (success) {
        toast.success(`"${name}" deleted.`);
      } else {
        toast.error(`Failed to delete "${name}".`);
      }
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Lesson Plan & Worksheet</CardTitle>
          <CardDescription>
            Input details to generate MOE-style lesson plans and practice worksheets.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g., Mathematics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="level">Level</Label>
            <Select value={level} onValueChange={setLevel} required>
              <SelectTrigger id="level">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Primary 1">Primary 1</SelectItem>
                <SelectItem value="Primary 2">Primary 2</SelectItem>
                <SelectItem value="Primary 3">Primary 3</SelectItem>
                <SelectItem value="Primary 4">Primary 4</SelectItem>
                <SelectItem value="Primary 5">Primary 5</SelectItem>
                <SelectItem value="Primary 6">Primary 6</SelectItem>
                <SelectItem value="Secondary 1">Secondary 1</SelectItem>
                <SelectItem value="Secondary 2">Secondary 2</SelectItem>
                <SelectItem value="Secondary 3">Secondary 3</SelectItem>
                <SelectItem value="Secondary 4">Secondary 4</SelectItem>
                <SelectItem value="JC 1">JC 1</SelectItem>
                <SelectItem value="JC 2">JC 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., Fractions"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={generating} className="w-full">
            {generating ? 'Generating...' : 'Generate Lesson Plan & Worksheet'}
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
              onClick={() => handleExport(viewingContent.content, viewingContent.title)}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" /> Export as Word
            </Button>
          </CardFooter>
        </Card>
      )}

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4">Generated Lesson Plans</h3>
      {lessonPlans.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No lesson plans generated yet.</p>
      ) : (
        <div className="grid gap-4">
          {lessonPlans.map((lp) => (
            <Card key={lp.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">{lp.fileName.replace('.txt', '')}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => setViewingContent({ type: 'lessonPlan', content: lp.content, title: lp.fileName })}>
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(lp.id, 'lessonPlan', lp.fileName)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Generated: {new Date(lp.createdAt).toLocaleDateString()}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleExport(lp.content, lp.fileName)} className="w-full">
                  <Download className="mr-2 h-4 w-4" /> Export as Word
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6">Generated Worksheets</h3>
      {worksheets.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No worksheets generated yet.</p>
      ) : (
        <div className="grid gap-4">
          {worksheets.map((ws) => (
            <Card key={ws.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">{ws.fileName.replace('.txt', '')}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => setViewingContent({ type: 'worksheet', content: ws.content, title: ws.fileName })}>
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(ws.id, 'worksheet', ws.fileName)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Generated: {new Date(ws.createdAt).toLocaleDateString()}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleExport(ws.content, ws.fileName)} className="w-full">
                  <Download className="mr-2 h-4 w-4" /> Export as Word
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonPlanWorksheetGenerator;