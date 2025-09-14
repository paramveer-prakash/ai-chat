'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from 'react-oidc-context'
import { useChatStore } from '@/stores/chat-store'
import { ChatWindow } from '@/components/chat/chat-window'
import { ConversationManager } from '@/components/conversation-manager'
import { Button } from '@/components/ui/button'
import { Settings, Plus, PanelLeftClose, PanelLeft, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ChatPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  const { 
    messages, 
    currentConversation, 
    conversations,
    isLoading, 
    error, 
    sendMessage, 
    loadConversations,
    createConversation
  } = useChatStore()

  // Track if conversations have been loaded to prevent duplicate calls
  const conversationsLoadedRef = useRef(false)
  const initialConversationCreatedRef = useRef(false)

  // Load conversations on mount - only once
  useEffect(() => {
    if (isAuthenticated && !conversationsLoadedRef.current) {
      conversationsLoadedRef.current = true
      loadConversations()
    }
  }, [isAuthenticated, loadConversations])

  // Auto-create first conversation if none exists - only once
  useEffect(() => {
    if (
      isAuthenticated && 
      !currentConversation && 
      !isLoading && 
      conversations.length === 0 &&
      !initialConversationCreatedRef.current
    ) {
      initialConversationCreatedRef.current = true
      createConversation('Welcome Chat')
    }
  }, [isAuthenticated, currentConversation, isLoading, conversations, createConversation])

  const handleSendMessage = async (message: string) => {
    await sendMessage(message)
  }

  const handleCreateNewConversation = async () => {
    await createConversation(`New Chat ${new Date().toLocaleDateString()}`)
  }

  const handleOpenSettings = () => {
    router.push('/settings')
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600">Please sign in to access the chat.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Sidebar - ChatGPT Style */}
      {sidebarOpen && (
        <div className="w-80 bg-gray-900 text-white flex flex-col flex-shrink-0">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-700">
            <Button
              onClick={handleCreateNewConversation}
              className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white flex items-center justify-center gap-2 py-3"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4" />
              New chat
            </Button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            <ConversationManager />
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700">
            <div className="space-y-2">
              <Button
                variant="ghost"
                onClick={handleOpenSettings}
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Button>
              
              {user?.profile && (
                <div className="text-sm text-gray-400 truncate">
                  {user.profile.email}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-gray-900"
            >
              {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
            </Button>
            
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <h1 className="text-lg font-semibold text-gray-900">
                {currentConversation?.title || 'New conversation'}
              </h1>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Nova Pro
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Chat Window */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            error={null}
            conversationTitle={currentConversation?.title}
          />
        </div>
      </div>
    </div>
  )
}
