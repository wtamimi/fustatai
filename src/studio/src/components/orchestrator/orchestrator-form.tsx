'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { createOrchestratorSchema, type CreateOrchestratorFormData } from '@/lib/validations/orchestrator';
import { useAgents } from '@/hooks/use-agents';
import { useApiKeys } from '@/hooks/use-api-keys-2';
import type { Orchestrator } from '@/lib/types/orchestrator';

interface OrchestratorFormProps {
  initialData?: Orchestrator;
  onSubmit: (data: CreateOrchestratorFormData) => void;
  isLoading?: boolean;
  onDirtyChange: (isDirty: boolean) => void;
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

export function OrchestratorForm({ initialData, onSubmit, isLoading, onDirtyChange }: OrchestratorFormProps) {
  const { loading: isLoadingAgents } = useAgents();
  const { ApiKeys, loading: isLoadingApiKeys } = useApiKeys();

  const form = useForm<CreateOrchestratorFormData>({
    resolver: zodResolver(createOrchestratorSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      instructions: initialData?.instructions || '',
      publish_as_app: initialData?.publish_as_app || true,
      app_type: initialData?.app_type || 'Productivity',
      api_key_id: initialData?.api_key_id || '',
      agents: initialData?.agents?.map(a => ({ agent_id: a.agent_id })) || [],
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      onDirtyChange(true);
      onSubmit(value as CreateOrchestratorFormData);
    });
    return () => subscription.unsubscribe();
  }, [form, onDirtyChange, onSubmit]);

  if (isLoadingAgents || isLoadingApiKeys) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit Orchestrator' : 'Create New Orchestrator'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter orchestrator name" {...field} />
                  </FormControl>
                  <FormDescription>
                    A unique name for your orchestrator
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter orchestrator description" 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Brief description of what this orchestrator does
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
                      placeholder="Enter orchestrator instructions" 
                      {...field} 
                      rows={4}
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed instructions for how this orchestrator should coordinate agents
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an API key" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ApiKeys.map((apiKey) => (
                        <SelectItem key={apiKey.id} value={apiKey.id}>
                          {apiKey.name} ({apiKey.provider_name} - {apiKey.model_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the API key this orchestrator will use
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
                    <FormLabel>Publish App</FormLabel>
                    <FormControl>
                      <Checkbox defaultChecked={false} checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Publish as AI Agent App
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
                      Choose the App Type of this agent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}