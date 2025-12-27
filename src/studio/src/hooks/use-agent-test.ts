import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { testAgentStream } from '@/lib/api/agent-test';
import { AgentTestStreamEvent } from '@/lib/types/agent-test';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: unknown;
}

export function useAgentTest(agentId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const handleSendMessage = useCallback(async (inputMessage: string) => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const currentConversationId = conversationId || uuidv4();
    if (!conversationId) {
      setConversationId(currentConversationId);
    }

    let assistantMessage: Message | null = null;

    await testAgentStream(
      agentId,
      { conversation_id: currentConversationId, message: inputMessage },
      (chunk) => {
        const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
        for (const line of lines) {
          const jsonStr = line.replace('data: ', '');
          try {
            const event: AgentTestStreamEvent = JSON.parse(jsonStr);
            if (event.event_type === 'stream_start') {
              setLogs(prev => [...prev, { id: uuidv4(), timestamp: new Date(), level: 'info', message: event.data.message, details: event.data }]);
              assistantMessage = { id: uuidv4(), role: 'assistant', content: '', timestamp: new Date() };
              setMessages(prev => [...prev, assistantMessage!]);
            } else if (event.event_type === 'message_delta' && assistantMessage) {
              const { content } = event.data as { content: string };
              setMessages(prev => prev.map(msg => 
                msg.id === assistantMessage!.id ? { ...msg, content } : msg
              ));
            }
          } catch {
            // Ignore parsing errors
            
          }
        }
      },
      (error) => {
        console.error('Stream error:', error);
        setLogs(prev => [...prev, { id: uuidv4(), timestamp: new Date(), level: 'error', message: 'Error receiving stream data', details: error }]);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );
  }, [agentId, conversationId]);

  return { messages, logs, isLoading, handleSendMessage };
}