export interface AgentTestStreamEvent {
  event_type: 'stream_start' | 'message_delta' | 'stream_end' | 'error';
  data: StreamStartData | MessageDeltaData | StreamEndData | ErrorData;
  timestamp: string;
  session_id: string | null;
}

export interface StreamStartData {
  message: string;
  agent_name: string;
}

export interface MessageDeltaData {
  delta: string;
  content: string;
}

export interface StreamEndData {
  message: string;
}

export interface ErrorData {
  message: string;
  details?: unknown;
}

export interface AgentTestMessage {
  conversation_id: string;
  message: string;
}
