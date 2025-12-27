// components/agents/agent-form.tsx
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { agentSchema, AgentFormData } from '@/lib/validations/agents';
import { Agent } from '@/lib/types/agents';
import { ApiKey } from '@/lib/types/api-keys-2';

interface AgentFormProps {
  agent?: Agent;
  apiKeys: ApiKey[];
  onSubmit: (data: AgentFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const APP_TYPES = [
  { value: 'Sales', label: 'Sales' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'HR', label: 'HR' },
  { value: 'Communication', label: 'Communication' },
  { value: 'IT', label: 'IT' },
  { value: 'Productivity', label: 'Productivity' },
  { value: 'Developer', label: 'Developer' },
];

export function AgentForm({ agent, apiKeys, onSubmit, isSubmitting }: AgentFormProps) {
  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: agent?.name || '',
      description: agent?.description || '',
      role: agent?.role || '',
      task: agent?.task || '',
      instructions: agent?.instructions || '',
      publish_as_app: agent?.publish_as_app || false,
      app_type: agent?.app_type || 'Productivity',
      api_key_id: agent?.api_key_id || '',
      mcp_servers: agent?.mcp_servers?.map(s => s.mcp_server_id) || [],
    },
  });

  const handleSubmit = async (data: AgentFormData) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter agent name" {...field} />
                </FormControl>
                <FormDescription>
                  A unique name for your agent. It&apos;s recommended to use a descriptive name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="api_key_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an API key" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {apiKeys.map((key) => (
                      <SelectItem key={key.id} value={key.id}>
                        {key.name} ({key.provider_name} - {key.model_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the API key for this agent
                </FormDescription>
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
                <Textarea
                  placeholder="Describe what this agent does"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description of the agent&apos;s purpose
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input placeholder="e.g., You are a data analyst" {...field} />
              </FormControl>
              <FormDescription>
                Define the agent&apos;s role or persona
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="task"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide detailed task for the agent"
                  className="min-h-16 resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Define the primary task for the agent to perform
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide detailed instructions for the agent"
                  className="min-h-32 resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Detailed instructions on how the agent should behave
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="publish_as_app"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publish AI Agent</FormLabel>
                <FormControl>
                  <Checkbox defaultChecked={false} checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  Publish AI Agent to make it available in Agent Hub
                </FormLabel>
                <FormDescription>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="app_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>App Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select App Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {APP_TYPES.map((key) => (
                      <SelectItem key={key.value} value={key.value}>
                        {key.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the Agent Hub area for this agent to be featured
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (agent ? 'Update Agent' : 'Create Agent')}
          </Button>
        </div>
      </form>
    </Form>
  );
}