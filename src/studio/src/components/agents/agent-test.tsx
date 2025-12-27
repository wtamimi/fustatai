"use client";

import { useState } from 'react';
import { Send, Bot, User, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Agent } from '@/lib/types/agents';
import { useAgentTest } from '@/hooks/use-agent-test';

interface AgentTestProps {
  agent: Agent;
}

export function AgentTest({ agent }: AgentTestProps) {
  const [inputMessage, setInputMessage] = useState('');
  const { messages, logs, isLoading, handleSendMessage: sendMessage } = useAgentTest(agent.id);

  const handleSendMessage = () => {
    sendMessage(inputMessage);
    setInputMessage('');
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
              Chat with {agent.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4 mb-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    Start a conversation with your agent
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.role === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Logs and Traces */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <Tabs defaultValue="logs" className="h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="logs">Logs</TabsTrigger>
                <TabsTrigger value="traces">Traces</TabsTrigger>
              </TabsList>
              
              <TabsContent value="logs" className="h-full">
                <ScrollArea className="h-[450px]">
                  <div className="space-y-2">
                    {logs.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No logs yet
                      </p>
                    ) : (
                      logs.map((log) => (
                        <div
                          key={log.id}
                          className="p-2 rounded border text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Badge
                              variant={
                                log.level === 'error'
                                  ? 'destructive'
                                  : log.level === 'warning'
                                  ? 'default'
                                  : 'secondary'
                              }
                              className="text-xs"
                            >
                              {log.level}
                            </Badge>
                            <span className="text-muted-foreground">
                              {log.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm">{log.message}</p>
                          {log.details && (
                            <pre className="text-xs text-muted-foreground mt-1 overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="traces" className="h-full">
                <ScrollArea className="h-[450px]">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Trace information will appear here during agent execution
                    </p>
                    {/* Placeholder for trace data */}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}