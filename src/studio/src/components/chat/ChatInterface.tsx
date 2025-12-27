// components/chat/ChatInterface.tsx
'use client';

import { useEffect, useRef } from 'react';
import { Message } from './Message';
import { MessageInput } from './MessageInput';
import { TracesPanel } from './TracesPanel';
import { useChat } from '@/hooks/use-chat';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChatType } from '@/lib/types/chat';

interface ChatInterfaceProps {
  agentId: string;
  sessionId: string;
  chatType: ChatType;
}

export function ChatInterface({ agentId, sessionId, chatType }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    traces,
    isLoading,
    error,
    sendMessage,
    resetConversation,
  } = useChat({
    conversationId: sessionId,
    agentId,
    chatType,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="m-4 mb-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Start a conversation
                </h3>
                <p className="text-gray-500 text-sm">
                  Send a message to begin chatting with the AI agent
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`group hover:bg-gray-50 transition-colors ${
                    index === messages.length - 1 ? 'pb-4' : ''
                  }`}
                >
                  <Message message={message} />
                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <MessageInput
          onSendMessage={sendMessage}
          onReset={resetConversation}
          isLoading={isLoading}
        />
      </div>

      {/* Traces Panel */}
      <div className="w-80 border-l bg-gray-50 flex flex-col">
        <div className="p-4 border-b bg-white">
          <h3 className="font-medium text-gray-900">Agent Traces</h3>
          <p className="text-sm text-gray-500 mt-1">
            Real-time agent execution logs
          </p>
        </div>
        <div className="flex-1 overflow-hidden">
          <TracesPanel traces={traces} />
        </div>
      </div>
    </div>
  );
}