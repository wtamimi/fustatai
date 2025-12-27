// lib/types/chat.ts

export enum ChatType {
  ORCHESTRATOR = 'orchestrator',
  SUB_AGENT = "agent"
}

export enum ChatMode {
  TEST = "test",
  LIVE = 'live'
}

export enum StreamEventType {
  AGENT_UPDATED = 'agent_updated',
  MESSAGE_DELTA = 'message_delta',
  MESSAGE_COMPLETE = 'message_complete',
  TOOL_CALL = 'tool_call',
  TOOL_OUTPUT = 'tool_output',
  HANDOFF = 'handoff',
  ERROR = 'error',
  STREAM_START = 'stream_start',
  STREAM_END = 'stream_end'
}

export interface ChatStreamRequest {
  id: string;
  chat_type: ChatType;
  chat_mode: ChatMode;
  conversation_id: string;
  message: string;
}

export interface StreamResponseEvent {
  event_type: StreamEventType;
  data: Record<string, any>;
  timestamp: string;
  session_id?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface TraceEvent {
  id: string;
  type: StreamEventType;
  data: Record<string, any>;
  timestamp: string;
  session_id?: string;
}