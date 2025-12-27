// src/components/orchestrator/test-tab.tsx
'use client';

import { useState } from 'react';
import { Send, Bot, User, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { ChatMessage, TraceMessage } from '@/lib/types/orchestrator';

export function TestTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [traces, setTraces] = useState<TraceMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Add trace for user message
    const userTrace: TraceMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };
    setTraces(prev => [...prev, userTrace]);

    // TODO: Implement actual API call to orchestrator
    // This is a placeholder for the chat functionality
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a placeholder response. The actual chat functionality will be implemented in the next step.',
        timestamp: new Date(),
      };

      const assistantTrace: TraceMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Processing request through orchestrator...',
        timestamp: new Date(),
        agent: 'Orchestrator',
      };

      setMessages(prev => [...prev, assistantMessage]);
      setTraces(prev => [...prev, assistantTrace]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Chat with Orchestrator
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 mb-4 border rounded-md p-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  Start a conversation with your orchestrator
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.role === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                          <span className="text-sm font-medium">
                            {message.role === 'user' ? 'You' : 'Orchestrator'}
                          </span>
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3 max-w-[70%]">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4" />
                          <span className="text-sm font-medium">Orchestrator</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                          <span className="text-sm text-muted-foreground">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traces Panel */}
      <div className="lg:col-span-1">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Execution Traces
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-full">
              {traces.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No traces yet. Start chatting to see execution traces.
                </div>
              ) : (
                <div className="space-y-3">
                  {traces.map((trace, index) => (
                    <div key={trace.id} className="relative">
                      {index > 0 && (
                        <div className="absolute left-4 -top-3 w-0.5 h-3 bg-border"></div>
                      )}
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {trace.role === 'user' ? (
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          ) : trace.role === 'system' ? (
                            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {trace.agent || trace.role}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {trace.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground break-words">
                            {trace.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}