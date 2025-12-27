import { AgentTestMessage } from '../types/agent-test';

export const testAgentStream = async (
  agentId: string,
  message: AgentTestMessage,
  onData: (chunk: string) => void,
  onError: (error: unknown) => void,
  onEnd: () => void
) => {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_WEB_API_BASE_URL || 'http://localhost:8000/api/v1';
    const response = await fetch(`${API_BASE_URL}/chat/stream/test/${agentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok || !response.body) {
      const errorText = await response.text();
      onError(new Error(`HTTP error! status: ${response.status} ${errorText}`));
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            onEnd();
            break;
          }
          const chunk = decoder.decode(value, { stream: true });
          onData(chunk);
        }
      } catch (error) {
        onError(error);
      }
    };

    processStream();

  } catch (error) {
    onError(error);
  }
};