// User types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Auth types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  access_token: string | null;
}

// AI Chat types based on backend DTOs
export interface ChatRequest {
  message: string;
  context?: string;
  ragEnabled?: boolean;
}

export interface ChatResponse {
  message: string;
  conversationId: number;
  timestamp: string;
  model: string;
  processingTimeMs?: number;
  tokensUsed?: number;
  estimatedCost?: string;
}

export interface Message {
  id: number;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM' | 'TOOL';
  content: string;
  tokens?: number;
  modelVersion?: string;
  processingTimeMs?: number;
  createdAt: string;
  metadata?: Record<string, unknown>;
  hasToolCalls?: boolean;
}

export interface Conversation {
  id: number;
  title: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED' | 'DELETED';
  modelUsed: string;
  messageCount: number;
  tokensUsed: number;
  costUsd: number;
  ragEnabled: boolean;
  createdAt: string;
  lastInteractionAt: string;
}

export interface ConversationDetail extends Conversation {
  messages?: Message[];
}

export interface CreateConversationRequest {
  title: string;
}

export interface RateLimitStatus {
  currentRequests: number;
  dailyRequestLimit: number;
  currentTokens: number;
  dailyTokenLimit: number;
  activeConversations: number;
  maxActiveConversations: number;
}

export interface HealthCheck {
  status: string;
  timestamp: string;
  model: string;
  version: string;
}

// Chat state for frontend
export interface ChatState {
  conversations: Conversation[];
  currentConversation: ConversationDetail | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  rateLimitStatus: RateLimitStatus | null;
}
