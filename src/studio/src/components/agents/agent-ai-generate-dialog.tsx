"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { agentsApi } from '@/lib/api/agents';
import { toast } from 'sonner';

interface AgentAiGenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgentAiGenerateDialog({ open, onOpenChange }: AgentAiGenerateDialogProps) {
  const router = useRouter();
  const [userPrompt, setUserPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleManualEntry = () => {
    router.push('/dashboard/settings/agents/new');
  };

  const handleAiGenerate = async () => {
    if (!userPrompt.trim()) {
      toast.error('Please enter a description for the AI to generate an agent.');
      return;
    }
    setIsGenerating(true);
    try {
      const newAgent = await agentsApi.aiGenerate(userPrompt);
      toast.success('Agent generated successfully!');
      router.push(`/dashboard/settings/agents/${newAgent.id}`);
    } catch (error) {
      toast.error('Failed to generate agent.');
      console.error(error);
    } finally {
      setIsGenerating(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Agent</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="ai-description">AI generator description</Label>
            <Textarea
              id="ai-description"
              placeholder="e.g., An IT Assistant that helps users troubleshoot issues"
              className="resize-none"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleManualEntry} disabled={isGenerating}>
            Manual Entry
          </Button>
          <Button onClick={handleAiGenerate} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'AI Generate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}