// components/chat/MessageInput.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { messageSchema, MessageFormData } from '../../lib/validations/chat';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onReset: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function MessageInput({ 
  onSendMessage, 
  onReset, 
  isLoading, 
  disabled = false 
}: MessageInputProps) {
  const [isResetting, setIsResetting] = useState(false);

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  const handleSubmit = (data: MessageFormData) => {
    if (isLoading || disabled) return;
    
    onSendMessage(data.content);
    form.reset();
  };

  const handleReset = async () => {
    if (isLoading || isResetting) return;
    
    setIsResetting(true);
    try {
      await onReset();
    } finally {
      setIsResetting(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.handleSubmit(handleSubmit)();
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                      className="min-h-[60px] max-h-[200px] resize-none"
                      onKeyDown={handleKeyDown}
                      disabled={isLoading || disabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={isLoading || disabled || !form.watch('content')?.trim()}
                className="px-4 py-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isLoading || isResetting}
                className="px-4 py-2"
                title="Reset conversation"
              >
                {isResetting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {form.formState.errors.content && (
            <p className="text-sm text-red-600">
              {form.formState.errors.content.message}
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}