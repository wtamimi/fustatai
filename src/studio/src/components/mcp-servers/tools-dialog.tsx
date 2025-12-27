import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { McpServerTool as Tool } from '@/lib/types/mcp-servers';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

interface ToolsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tools: Tool[];
  loading: boolean;
  serverName: string;
}

export const ToolsDialog = ({ 
  open, 
  onOpenChange, 
  tools, 
  loading,
  serverName
}: ToolsDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
      <DialogHeader>
        <DialogTitle>{serverName} Tools</DialogTitle>
        <DialogDescription>
          Available tools and their descriptions
        </DialogDescription>
      </DialogHeader>
      
      <div className="overflow-y-auto max-h-[60vh]">
        {loading ? (
          <LoadingSpinner />
        ) : tools.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No tools available for this server</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead className="w-1/4">Tool Name</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tools.map(tool => (
                <TableRow key={tool.tool_name}>
                  <TableCell className="font-medium align-top py-4">
                    {tool.tool_name}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="whitespace-pre-wrap">{tool.tool_description}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </DialogContent>
  </Dialog>
);