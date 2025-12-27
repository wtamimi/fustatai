'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ApiKeyFormData, 
  apiKeySchema 
} from '@/lib/validations/api-keys-2';
import { useApiKeys } from '@/hooks/use-api-keys-2';
import { ApiKey } from '@/lib/types/api-keys-2';
import { useEffect, useState } from 'react';
import { Loader2, ExternalLink, CheckCircle } from 'lucide-react';

interface ApiKeyDialogProps {
  apiKey?: ApiKey | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const PROVIDER_OPTIONS = [
  { value: 'OpenAI', label: 'OpenAI', baseUrl: 'https://api.openai.com/v1/' },
  { value: 'Anthropic', label: 'Anthropic', baseUrl: 'https://api.anthropic.com/' },
  { value: 'Google', label: 'Google', baseUrl: 'https://generativelanguage.googleapis.com/v1/' },
  { value: 'Groq', label: 'Groq', baseUrl: 'https://api.groq.com/openai/v1' },
  { value: 'Ollama_chat', label: 'Ollama', baseUrl: 'http://localhost:11434/v1' },
];

const MODEL_SUGGESTIONS = {
  OpenAI: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-4o-mini'],
  Anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
  Google: ['gemini-pro', 'gemini-pro-vision', 'gemini-1.5-pro'],
  Cohere: ['command-r-plus', 'command-r', 'command-light'],
  Mistral: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest'],
  Groq: ['llama-3.3-70b-versatile'],
  DeepSeek: ['deepseek-chat'],
  Ollama_chat: ['gemma:2b'],
};

export function ApiKeyFormDialog({
  apiKey: model,
  open,
  onOpenChange,
  onSuccess,
}: ApiKeyDialogProps) {
  const { createApiKey, updateApiKey } = useApiKeys();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const isEditing = !!model;

  const form = useForm<ApiKeyFormData>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      name: '',
      provider_name: '',
      model_name: '',
      base_url: '',
      secret_key: '',
    },
  });

  const watchedProvider = form.watch('provider_name');

  useEffect(() => {
    if (model) {
      form.reset({
        name: model.name,
        provider_name: model.provider_name,
        model_name: model.model_name,
        base_url: model.base_url,
        secret_key: model.secret_key,
      });
      setSelectedProvider(model.provider_name);
    } else {
      form.reset({
      name: '',
      provider_name: '',
      model_name: '',
      base_url: '',
      secret_key: '',
      });
      setSelectedProvider('');
    }
  }, [model, form]);

  useEffect(() => {
    if (watchedProvider && watchedProvider !== selectedProvider) {
      setSelectedProvider(watchedProvider);
      const provider = PROVIDER_OPTIONS.find(p => p.value === watchedProvider);
      if (provider && provider.baseUrl) {
        form.setValue('base_url', provider.baseUrl);
      }
    }
  }, [watchedProvider, selectedProvider, form]);

  const onSubmit = async (data: ApiKeyFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && model) {
        await updateApiKey(model.id, data);
      } else {
        await createApiKey(data);
      }
      onSuccess?.();
      onOpenChange(false);
      form.reset();
      setSelectedProvider('');
    } catch (error) {
      console.error('Failed to save model:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      form.reset();
      setSelectedProvider('');
    }
  };

  const handleProviderChange = (value: string) => {
    form.setValue('provider_name', value);
    const provider = PROVIDER_OPTIONS.find(p => p.value === value);
    if (provider && provider.baseUrl) {
      form.setValue('base_url', provider.baseUrl);
    }
    // Clear model name when provider changes (except when editing)
    if (!isEditing) {
      form.setValue('model_name', '');
    }
  };

  const handleModelSuggestion = (modelName: string) => {
    form.setValue('model_name', modelName);
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? 'Edit Api Key' : 'Add New Api Key'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the Api Key configuration below.' 
              : 'Configure a new Api Key for AI integration.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Production Key" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a unique name for your Api Key.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Provider Selection */}
            <FormField
              control={form.control}
              name="provider_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider *</FormLabel>
                  <Select 
                    onValueChange={handleProviderChange} 
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROVIDER_OPTIONS.map((provider) => (
                        <SelectItem key={provider.value} value={provider.value}>
                          <div className="flex items-center gap-2">
                            <span>{provider.label}</span>
                            {provider.value !== 'Custom' && (
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the AI service provider for this model.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Model Name */}
            <FormField
              control={form.control}
              name="model_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., gpt-4o, claude-3-5-sonnet" 
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  
                  {/* Model Suggestions */}
                  {selectedProvider && 
                   selectedProvider !== 'Custom' && 
                   MODEL_SUGGESTIONS[selectedProvider as keyof typeof MODEL_SUGGESTIONS] && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-2">Popular models:</p>
                      <div className="flex flex-wrap gap-1">
                        {MODEL_SUGGESTIONS[selectedProvider as keyof typeof MODEL_SUGGESTIONS].map((suggestion) => (
                          <Button
                            key={suggestion}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleModelSuggestion(suggestion)}
                            disabled={isSubmitting}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <FormDescription>
                    Enter the exact model identifier as specified by the provider.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Base URL */}
            <FormField
              control={form.control}
              name="base_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base URL *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="https://api.provider.com/v1/" 
                        {...field}
                        disabled={isSubmitting}
                      />
                      {field.value && validateUrl(field.value) && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    The API endpoint URL for this provider. Must be a valid HTTPS URL.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Secret Key */}
            <FormField
              control={form.control}
              name="secret_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter secret key" {...field} />
                  </FormControl>
                  <FormDescription>
                    The secret key for this provider. As provided by the provider.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Model' : 'Create Model'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}