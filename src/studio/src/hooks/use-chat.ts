// hooks/useChat.ts
import { useState, useRef, useCallback } from 'react';
import { apiClient } from '../lib/api/chat';
import { 
  Message, 
  TraceEvent, 
  ChatStreamRequest, 
  StreamResponseEvent, 
  StreamEventType,
  ChatType,
  ChatMode 
} from '../lib/types/chat';
import { v4 as uuidv4 } from 'uuid';

interface UseChatOptions {
  conversationId: string;
  agentId: string;
  chatType: ChatType;
}

export function useChat({ conversationId, agentId, chatType }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [traces, setTraces] = useState<TraceEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currentAssistantMessageRef = useRef<string>('');
  const currentMessageIdRef = useRef<string>('');

  const addUserMessage = useCallback((content: string) => {
    const message: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const addAssistantMessage = useCallback((content: string) => {
    const message: Message = {
      id: currentMessageIdRef.current,
      role: 'assistant',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, message]);
  }, []);

  const updateAssistantMessage = useCallback((delta: string, fullContent: string) => {
    setMessages(prev => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage?.role === 'assistant' && lastMessage.id === currentMessageIdRef.current) {
        return [
          ...prev.slice(0, -1),
          { ...lastMessage, content: fullContent }
        ];
      } else {
        // Create new assistant message if it doesn't exist
        const newMessage: Message = {
          id: currentMessageIdRef.current,
          role: 'assistant',
          content: fullContent,
          timestamp: new Date().toISOString(),
        };
        return [...prev, newMessage];
      }
    });
  }, []);

  const addTrace = useCallback((event: StreamResponseEvent) => {
    if (event.event_type === StreamEventType.MESSAGE_DELTA || 
        event.event_type === StreamEventType.MESSAGE_COMPLETE) {
      return; // Don't add message events to traces
    }

    const trace: TraceEvent = {
      id: uuidv4(),
      type: event.event_type,
      data: event.data,
      timestamp: event.timestamp,
      session_id: event.session_id,
    };
    setTraces(prev => [...prev, trace]);
  }, []);

  const handleStreamEvent = useCallback((event: StreamResponseEvent) => {
    addTrace(event);

    switch (event.event_type) {
      case StreamEventType.STREAM_START:
        currentMessageIdRef.current = uuidv4();
        currentAssistantMessageRef.current = '';
        break;

      case StreamEventType.MESSAGE_DELTA:
        const delta = event.data.delta || '';
        currentAssistantMessageRef.current += delta;
        updateAssistantMessage(delta, currentAssistantMessageRef.current);
        break;

      case StreamEventType.MESSAGE_COMPLETE:
        const finalContent = event.data.content || currentAssistantMessageRef.current;
        currentAssistantMessageRef.current = finalContent;
        updateAssistantMessage('', finalContent);
        break;

      case StreamEventType.ERROR:
        setError(event.data.message || 'An error occurred');
        break;

      case StreamEventType.STREAM_END:
        setIsLoading(false);
        break;
    }
  }, [addTrace, updateAssistantMessage]);

  const sendMessage = useCallback(async (content: string) => {
    if (isLoading) return;

    setError(null);
    setIsLoading(true);
    
    // Add user message immediately
    addUserMessage(content);

    const request: ChatStreamRequest = {
      id: agentId,
      chat_type: chatType,
      chat_mode: ChatMode.LIVE,
      conversation_id: conversationId,
      message: content,
    };

    try {
      await apiClient.fetchStream(
        request,
        handleStreamEvent,
        (error: Error) => {
          setError(error.message);
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
        }
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setIsLoading(false);
    }
  }, [isLoading, conversationId, addUserMessage, handleStreamEvent]);

  const resetConversation = useCallback(async () => {
    try {
      setIsLoading(true);
      await apiClient.resetChat(agentId, conversationId);
      setMessages([]);
      setTraces([]);
      setError(null);
      currentAssistantMessageRef.current = '';
      currentMessageIdRef.current = '';
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to reset conversation');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  return {
    messages,
    traces,
    isLoading,
    error,
    sendMessage,
    resetConversation,
  };
}