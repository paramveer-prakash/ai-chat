import { create } from 'zustand';
import { ChatState, Conversation, Message } from '@/types';
import { ChatAPI } from '@/lib/api';

interface APIError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  isRateLimit?: boolean;
  rateLimitMessage?: string;
  message?: string;
}

interface ChatActions {
  // Conversation actions
  createConversation: (title?: string) => Promise<Conversation | null>;
  loadConversations: () => Promise<void>;
  selectConversation: (conversation: Conversation) => Promise<void>;
  archiveConversation: (conversationId: number) => Promise<void>;
  deleteConversation: (conversationId: number) => Promise<void>;
  
  // Message actions
  sendMessage: (message: string) => Promise<void>;
  loadMessages: (conversationId: number) => Promise<void>;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,
  rateLimitStatus: null,

  // Actions
  createConversation: async (title?: string) => {
    const currentState = get();
    
    // Prevent multiple simultaneous calls
    if (currentState.isLoading) {
      return null;
    }
    
    try {
      set({ isLoading: true, error: null });
      
      const newConversation = await ChatAPI.createConversation({
        title: title || `New Conversation ${new Date().toLocaleDateString()}`
      });
      
      // Add to conversations list
      const currentConversations = get().conversations;
      set({
        conversations: [newConversation, ...currentConversations],
        currentConversation: { ...newConversation, messages: [] },
        messages: [],
        isLoading: false
      });
      
      return newConversation;
    } catch (error: unknown) {
      console.error('Failed to create conversation:', error);
      
      let errorMessage = 'Failed to create conversation';
      
      if (error && typeof error === 'object') {
        const apiError = error as APIError;
        if (apiError.response?.status === 429) {
          errorMessage = 'Rate limit exceeded. You have reached the maximum number of conversations allowed. Please try again later or delete some existing conversations.';
        } else if (apiError.isRateLimit) {
          errorMessage = apiError.rateLimitMessage || 'Rate limit exceeded. Please try again later.';
        } else if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      }
      
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  loadConversations: async () => {
    const currentState = get();
    
    // Prevent multiple simultaneous calls
    if (currentState.isLoading) {
      return;
    }
    
    try {
      set({ isLoading: true, error: null });
      const result = await ChatAPI.getConversations();
      set({ conversations: result.content, isLoading: false });
    } catch (error) {
      console.error('Failed to load conversations:', error);
      set({ error: 'Failed to load conversations', isLoading: false });
    }
  },

  selectConversation: async (conversation: Conversation) => {
    try {
      set({ isLoading: true, error: null });
      
      // Load conversation details and messages
      const [conversationDetail, messages] = await Promise.all([
        ChatAPI.getConversation(conversation.id),
        ChatAPI.getMessages(conversation.id)
      ]);
      
      set({
        currentConversation: conversationDetail,
        messages: messages,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to load conversation:', error);
      set({ error: 'Failed to load conversation', isLoading: false });
    }
  },

  archiveConversation: async (conversationId: number) => {
    try {
      await ChatAPI.archiveConversation(conversationId);
      
      // Update conversations list
      const conversations = get().conversations.map(conv =>
        conv.id === conversationId 
          ? { ...conv, status: 'ARCHIVED' as const }
          : conv
      );
      
      // Clear current conversation if it was archived
      const currentConversation = get().currentConversation;
      const updatedState: Partial<ChatState> = { conversations };
      
      if (currentConversation?.id === conversationId) {
        updatedState.currentConversation = null;
        updatedState.messages = [];
      }
      
      set(updatedState);
    } catch (error) {
      console.error('Failed to archive conversation:', error);
      set({ error: 'Failed to archive conversation' });
    }
  },

  deleteConversation: async (conversationId: number) => {
    try {
      await ChatAPI.deleteConversation(conversationId);
      
      // Remove from conversations list
      const conversations = get().conversations.filter(conv => conv.id !== conversationId);
      
      // Clear current conversation if it was deleted
      const currentConversation = get().currentConversation;
      const updatedState: Partial<ChatState> = { conversations };
      
      if (currentConversation?.id === conversationId) {
        updatedState.currentConversation = null;
        updatedState.messages = [];
      }
      
      set(updatedState);
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      set({ error: 'Failed to delete conversation' });
    }
  },

  sendMessage: async (messageContent: string) => {
    const currentConversation = get().currentConversation;
    
    // Create conversation if none exists
    if (!currentConversation) {
      const newConversation = await get().createConversation();
      if (!newConversation) return;
    }

    const conversation = get().currentConversation;
    if (!conversation) {
      set({ error: 'No active conversation' });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      // Add user message to UI immediately
      const userMessage: Message = {
        id: Date.now(),
        role: 'USER',
        content: messageContent,
        createdAt: new Date().toISOString()
      };

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, userMessage] });

      // Send message to API
      const response = await ChatAPI.sendMessage(conversation.id, {
        message: messageContent
      });

      // Add AI response to UI
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'ASSISTANT',
        content: response.message,
        createdAt: response.timestamp,
        modelVersion: response.model,
        processingTimeMs: response.processingTimeMs,
        tokens: response.tokensUsed
      };

      set({
        messages: [...get().messages, aiMessage],
        isLoading: false
      });

      // Refresh conversations to update counts
      await get().loadConversations();

    } catch (error: unknown) {
      console.error('Failed to send message:', error);
      
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (error && typeof error === 'object') {
        const apiError = error as APIError;
        if (apiError.response?.status === 429) {
          errorMessage = 'Rate limit exceeded. You are sending messages too quickly. Please wait a moment before trying again.';
        } else if (apiError.isRateLimit) {
          errorMessage = apiError.rateLimitMessage || 'Rate limit exceeded. Please try again later.';
        } else if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      }
      
      set({ error: errorMessage, isLoading: false });
    }
  },

  loadMessages: async (conversationId: number) => {
    try {
      set({ isLoading: true, error: null });
      const messages = await ChatAPI.getMessages(conversationId);
      set({ messages, isLoading: false });
    } catch (error) {
      console.error('Failed to load messages:', error);
      set({ error: 'Failed to load messages', isLoading: false });
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
}));
