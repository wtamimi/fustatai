import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { McpServerFormValues, mcpServerSchema } from '@/lib/validations/mcp-servers';
import { McpServer } from '@/lib/types/mcp-servers';
import { useEffect } from 'react'; // ADD IMPORT

interface McpServerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: McpServerFormValues) => void;
  server?: McpServer | null;
  isSubmitting: boolean;
}

export const McpServerFormDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  server, 
  isSubmitting 
}: McpServerFormDialogProps) => {
  const form = useForm<McpServerFormValues>({
    resolver: zodResolver(mcpServerSchema),
    defaultValues: {
      name: '',
      description: '',
      transport: 'stdio',
      mode: 'autonomous',
      config_json: JSON.stringify({ command: "", args: [] }, null, 2),
    }
  });

  // RESET FORM WHEN SERVER CHANGES OR DIALOG OPENS
  useEffect(() => {
    if (open) {
      const defaultConfigJson = server 
        ? JSON.stringify(server.config_json, null, 2) 
        : JSON.stringify({ command: "", args: [] }, null, 2);
      
      form.reset({
        name: server?.name || '',
        description: server?.description || '',
        transport: server?.transport || 'stdio',
        mode: server?.mode || 'autonomous',
        config_json: defaultConfigJson,
      });
    }
  }, [open, server, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{server ? 'Edit MCP Server' : 'Add New MCP Server'}</DialogTitle>
          <DialogDescription>
            {server ? 'Update the server configuration' : 'Add a new MCP server to the system'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., File System Server" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Transport Selection */}
            <FormField
              control={form.control}
              name="transport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transport *</FormLabel>
                  <Select
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a transport" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem key='stdio' value='stdio'>Stdio transport</SelectItem>
                        <SelectItem key='streamable-http' value='streamable-http'>Streamable HTTP transport</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Mode Selection */}
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem key='autonomous' value='autonomous'>Autonomous</SelectItem>
                        <SelectItem key='supervised' value='supervised'>Supervised</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Short description" 
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="config_json"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Configuration JSON *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={`Example:\n{\n  "command": "npx",\n  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]\n}`}
                      className="font-mono text-sm h-48"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be valid JSON with &quot;command&quot; and &quot;args&quot; properties
                  </p>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : server ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};