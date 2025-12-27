// components/chat/Message.tsx
'use client';

import { Message as MessageType } from '../../lib/types/chat';
import { CopyButton } from './CopyButton';
import { ThumbsUp, ThumbsDown, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const formatContent = (content: string) => {
    // Replace \n with actual line breaks for display
    return content.replace(/\\n/g, '\n');
  };

  return (
    <div className={cn(
      'flex gap-4 p-4',
      isUser ? 'bg-gray-50' : 'bg-white'
    )}>
      {/* Avatar */}
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        isUser ? 'bg-blue-500' : 'bg-gray-200'
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-gray-600" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>

        <div className="prose prose-sm max-w-none">
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">
              {formatContent(message.content)}
            </div>
          ) : (
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0 whitespace-pre-wrap">
                    {children}
                  </p>
                ),
              }}
            >
              {formatContent(message.content)}
            </ReactMarkdown>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton text={message.content} />
          
          {isAssistant && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                title="Thumbs up"
                onClick={() => {
                  // TODO: Implement thumbs up logic
                  console.log('Thumbs up clicked for message:', message.id);
                }}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                title="Thumbs down"
                onClick={() => {
                  // TODO: Implement thumbs down logic
                  console.log('Thumbs down clicked for message:', message.id);
                }}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}