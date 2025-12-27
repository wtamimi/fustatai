// components/agents/agent-actions.tsx
"use client";

import { useState } from 'react';
import { Edit, Trash2, MoreHorizontal, TestTube } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Agent } from '@/lib/types/agents';
import { v4 as uuidv4 } from 'uuid';

interface AgentActionsProps {
  agent: Agent;
  onDelete: (id: string) => Promise<void>;
}

export function AgentActions({ agent, onDelete }: AgentActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/settings/agents/${agent.id}`);
  };

  const handleTest = () => {
    //const conversationId = uuidv4();
    //router.push(`/dashboard/p/${agent.id}/c/${conversationId}`);
    window.open(`http://localhost:3000/c/${agent.id}`, '_blank');
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(agent.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete agent:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        title="Edit"
        onClick={handleEdit}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        title="Test"
        onClick={handleTest}
      >
        <TestTube className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        title="Delete"
        onClick={() => setShowDeleteDialog(true)}
        className="text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      {/*
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      */}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the agent &quot;{agent.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}