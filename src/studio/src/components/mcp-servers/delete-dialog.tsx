import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { McpServer } from '@/lib/types/mcp-servers';

interface DeleteMcpServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  server?: McpServer | null;
  isSubmitting: boolean;
}

export const DeleteMcpServerDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm, 
  server, 
  isSubmitting 
}: DeleteMcpServerDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Server Deletion</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete <span className="font-semibold">{server?.name}</span>? 
          This action cannot be undone and may affect running services.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isSubmitting}>
          {isSubmitting ? 'Deleting...' : 'Delete Server'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);