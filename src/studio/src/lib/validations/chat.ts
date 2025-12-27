// lib/validations/chat.ts
import { z } from 'zod';
import { ChatType, ChatMode } from '../types/chat';

export const chatStreamRequestSchema = z.object({
  id: z.string().uuid(),
  chat_type: z.nativeEnum(ChatType),
  chat_mode: z.nativeEnum(ChatMode),
  conversation_id: z.string().uuid(),
  message: z.string().min(1, 'Message cannot be empty'),
});

export const messageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
});

export type MessageFormData = z.infer<typeof messageSchema>;