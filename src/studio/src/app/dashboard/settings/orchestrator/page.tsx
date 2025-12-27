// src/app/dashboard/orchestrator/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Users, Bot, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useOrchestrators } from '@/hooks/use-orchestrators';
import { toast  } from 'sonner';
import type { Orchestrator } from '@/lib/types/orchestrator';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

export default function OrchestratorPage() {
  const router = useRouter();
  const { orchestrators, loading, error, deleteOrchestrator } = useOrchestrators();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const handleDelete = async (orchestrator: Orchestrator) => {
    try {
      setDeleteLoading(orchestrator.id);
      await deleteOrchestrator(orchestrator.id);
      toast.success('Orchestrator deleted successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete orchestrator');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (orchestrator: Orchestrator) => {
    router.push(`/dashboard/settings/orchestrator/${orchestrator.id}`);
  };

  const handleNew = () => {
    router.push('/dashboard/settings/orchestrator/new');
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Orchestrators</h1>
          <p className="text-muted-foreground mt-1">
            Manage your AI orchestrators and agent coordination
          </p>
        </div>
        <Button onClick={handleNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Orchestrator
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : orchestrators.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orchestrators yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Create your first orchestrator to start coordinating AI agents
            </p>
            <Button onClick={handleNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Orchestrator
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Orchestrators</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Agents</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orchestrators.map((orchestrator) => (
                  <TableRow key={orchestrator.id}>
                    <TableCell>
                      <div className="font-medium">{orchestrator.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-muted-foreground">
                        {orchestrator.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {orchestrator.api_key.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {orchestrator.agents.length} agent{orchestrator.agents.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(orchestrator)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              disabled={deleteLoading === orchestrator.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Orchestrator</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;{orchestrator.name}&quot;? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(orchestrator)}
                                className="bg-destructive hover:bg-destructive/90"
                                disabled={deleteLoading === orchestrator.id}
                              >
                                {deleteLoading === orchestrator.id ? 'Deleting...' : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}