// lib/api/client.ts
import axios, { AxiosInstance } from 'axios';
import { ChatStreamRequest } from '../types/chat';

const API_BASE_URL = process.env.NEXT_PUBLIC_WEB_API_BASE_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async fetchStream(
    data: ChatStreamRequest,
    onData: (event: any) => void,
    onError: (error: Error) => void,
    onComplete: () => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.client.defaults.baseURL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('ReadableStream not supported');
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          onComplete();
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonData = line.slice(6).trim();
              if (jsonData) {
                const event = JSON.parse(jsonData);
                onData(event);
              }
            } catch (error) {
              console.error('Error parsing SSE data:', error);
            }
          }
        }
      }
    } catch (error) {
      onError(error as Error);
    }
  }

  async resetChat(agentId: string, conversationId: string): Promise<void> {
    await this.client.delete(`/chat/reset/${agentId}/${conversationId}`);
  }
}

export const apiClient = new ApiClient();