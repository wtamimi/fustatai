'use client';

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { McpServersDataTable } from '@/components/mcp-servers/data-table';
import { McpServerFormDialog } from '@/components/mcp-servers/form-dialog';
import { DeleteMcpServerDialog } from '@/components/mcp-servers/delete-dialog';
import { ToolsDialog } from '@/components/mcp-servers/tools-dialog';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { useMcpServers } from '@/hooks/use-mcp-servers';
import { McpServerFormValues } from '@/lib/validations/mcp-servers';
import { Plus } from 'lucide-react';
import { McpServer, McpServerTool as Tool } from '@/lib/types/mcp-servers';
import { fetchToolsByServerId } from '@/lib/api/mcp-servers'; // Add import
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function McpServersPage() {
  const {
    servers,
    loading,
    error,
    addServer,
    updateServer,
    removeServer,
    reload
  } = useMcpServers();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false); // New state
  const [currentServer, setCurrentServer] = useState<McpServer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tools state
  const [tools, setTools] = useState<Tool[]>([]);
  const [loadingTools, setLoadingTools] = useState(false);
  const [toolsError, setToolsError] = useState<string | null>(null);

  // Handle tools button click
  const handleTools = async (server: McpServer) => {
    setCurrentServer(server);
    setIsToolsOpen(true);
    setLoadingTools(true);
    setToolsError(null);
    
    try {
      const toolsData = await fetchToolsByServerId(server.id);
      setTools(toolsData);
    } catch (error) {
      console.error('Error loading tools:', error);
      setToolsError('Failed to load tools for this server');
    } finally {
      setLoadingTools(false);
    }
  };

  const handleCreate = () => {
    setCurrentServer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (server: McpServer) => {
    setCurrentServer(server);
    setIsFormOpen(true);
  };

  const handleDelete = (server: McpServer) => {
    setCurrentServer(server);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (values: McpServerFormValues) => {
    try {
      setIsSubmitting(true);
      if (currentServer) {
        await updateServer(currentServer.id, values);
      } else {
        await addServer(values);
      }
      setIsFormOpen(false);
      reload();
    } catch (error) {
      console.error('Error saving server:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentServer) return;
    try {
      setIsSubmitting(true);
      await removeServer(currentServer.id);
      setIsDeleteOpen(false);
      reload();
    } catch (error) {
      console.error('Error deleting server:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (


    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">MCP Servers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your MCP Servers and related tools.
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New MCP Server
        </Button>
      </div>
    
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MCP Servers</h1>
          <p className="text-muted-foreground">
            Manage your MCP Servers and related tools.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div> */}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : servers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No MCP servers configured</p>
          <Button className="mt-4" onClick={handleCreate}>
            Create Your First Server
          </Button>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Orchestrators</CardTitle>
          </CardHeader>
          <CardContent>

        <McpServersDataTable 
          servers={servers} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onTools={handleTools}
        />
        </CardContent>
        </Card>
      )}

      <McpServerFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        server={currentServer}
        isSubmitting={isSubmitting}
      />

      <DeleteMcpServerDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteConfirm}
        server={currentServer}
        isSubmitting={isSubmitting}
      />

      <ToolsDialog
        open={isToolsOpen}
        onOpenChange={setIsToolsOpen}
        tools={tools}
        loading={loadingTools}
        serverName={
          currentServer 
            ? `${currentServer.name}`
            : "MCP Server"
        }
      />
    </div>
  );
}