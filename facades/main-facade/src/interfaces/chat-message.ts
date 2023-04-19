import {Filter, Where} from '@loopback/repository';

export interface ChatMessage {
  id?: string;
  subject?: string;
  body: string;
  toUserId: string;
  channelId: string;
  channelType: string;
}

export interface ChatMessageRecipit {
  id?: string;
  channelId: string;
  recipientId: string;
  messageId: string;
  isRead?: boolean;
}

export interface ChatMessageRepo {
  sendMessage: (token: string, data: ChatMessage) => Promise<ChatMessage>;
  getMessage: (token: string, filter: Filter<Partial<ChatMessage>>) => Promise<ChatMessage>;
  deleteMessage: (token: string, id: string) => Promise<void>;
  sendMessageRecipients: (token: string, data: ChatMessageRecipit) => Promise<ChatMessageRecipit>;
  updateMessageRecipients: (token: string, id: string, data: Partial<ChatMessageRecipit>, where?: Where<ChatMessageRecipit>) => Promise<ChatMessageRecipit>
}
