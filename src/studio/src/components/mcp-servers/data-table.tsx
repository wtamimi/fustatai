import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { McpServer } from '@/lib/types/mcp-servers';
import { Edit, Trash2, Terminal, Wrench } from 'lucide-react';

interface McpServersDataTableProps {
  servers: McpServer[];
  onEdit: (server: McpServer) => void;
  onDelete: (server: McpServer) => void;
  onTools: (server: McpServer) => void;
}

export const McpServersDataTable = ({ 
  servers, 
  onEdit, 
  onDelete,
  onTools 
}: McpServersDataTableProps) => (
  <div className="rounded-md border">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Description</TableHead>
        <TableHead>Command</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {servers.map((server) => (
        <TableRow key={server.id}>
          <TableCell className="font-medium">{server.name}</TableCell>
          <TableCell className="max-w-xs truncate">{server.description || '-'}</TableCell>
          <TableCell>
            <div className="flex items-center">
              <Terminal className="h-4 w-4 mr-2 text-muted-foreground" />
              {server.config_json.command}
            </div>
          </TableCell>
          <TableCell className="text-right">
            <Button
        variant="ghost"
        size="icon"
        title="Edit"
        onClick={() => onEdit(server)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        title="List Tools"
        onClick={() => onTools(server)}
      >
        <Wrench className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        title="Delete"
        onClick={() => onDelete(server)}
        className="text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  </div>
);