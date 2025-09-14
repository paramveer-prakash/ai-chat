import axios, { AxiosResponse } from 'axios';
import {
  ChatRequest,
  ChatResponse,
  Conversation,
  ConversationDetail,
  CreateConversationRequest,
  Message,
  RateLimitStatus,
  HealthCheck
} from '@/types';
import { appConfig } from './config';

// Create axios instance
const api = axios.create({
  baseURL: `${appConfig.apiUrl}/api/v1/ai`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage as fallback
    let token: string | null = null;
    try {
      const storedAuth = localStorage.getItem('auth-store');
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        token = authData.state?.access_token;
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - please login');
      // Clear localStorage and redirect to login
      try {
        localStorage.removeItem('auth-store');
      } catch (error) {
        console.error('Error clearing auth storage:', error);
      }
      window.location.href = '/auth/login';
    } else if (error.response?.status === 429) {
      // Handle rate limiting - add more specific error info
      console.error('Rate limit exceeded - too many requests');
      // Add the error details to help with frontend handling
      error.isRateLimit = true;
      error.rateLimitMessage = 'Rate limit exceeded. Please wait before making more requests.';
    }
    return Promise.reject(error);
  }
);

export class ChatAPI {
  // Conversation management
  static async createConversation(request: CreateConversationRequest): Promise<Conversation> {
    const response: AxiosResponse<Conversation> = await api.post('/conversations', request);
    return response.data;
  }

  static async getConversations(page = 0, size = 20, status?: string): Promise<{content: Conversation[], totalElements: number}> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (status) {
      params.append('status', status);
    }
    
    const response: AxiosResponse<{content: Conversation[], totalElements: number}> = await api.get(`/conversations?${params}`);
    return response.data;
  }

  static async getConversation(conversationId: number): Promise<ConversationDetail> {
    const response: AxiosResponse<ConversationDetail> = await api.get(`/conversations/${conversationId}`);
    return response.data;
  }

  static async archiveConversation(conversationId: number): Promise<void> {
    await api.put(`/conversations/${conversationId}/archive`);
  }

  static async deleteConversation(conversationId: number): Promise<void> {
    await api.delete(`/conversations/${conversationId}`);
  }

  // Message management
  static async sendMessage(conversationId: number, request: ChatRequest): Promise<ChatResponse> {
    const response: AxiosResponse<ChatResponse> = await api.post(
      `/conversations/${conversationId}/messages`,
      request
    );
    return response.data;
  }

  static async getMessages(conversationId: number, limit = 50): Promise<Message[]> {
    const response: AxiosResponse<Message[]> = await api.get(
      `/conversations/${conversationId}/messages?limit=${limit}`
    );
    return response.data;
  }

  // Simple inquiry endpoint (for testing without authentication)
  static async inquire(user: string, question: string): Promise<string> {
    const response: AxiosResponse<string> = await api.get(
      `/${user}/inquire?question=${encodeURIComponent(question)}`
    );
    return response.data;
  }

  // Utility endpoints
  static async getRateLimitStatus(): Promise<RateLimitStatus> {
    const response: AxiosResponse<RateLimitStatus> = await api.get('/rate-limit-status');
    return response.data;
  }

  static async getHealthCheck(): Promise<HealthCheck> {
    const response: AxiosResponse<HealthCheck> = await api.get('/health');
    return response.data;
  }
}

export default ChatAPI;
