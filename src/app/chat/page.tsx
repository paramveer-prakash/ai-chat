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
  const [sidebarOpen, setSidebarOpen] = useState(true) // Default open on desktop
  
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

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // On mobile, close sidebar by default
        setSidebarOpen(false)
      } else {
        // On desktop, open sidebar by default
        setSidebarOpen(true)
      }
    }

    // Set initial state based on screen size
    handleResize()
    
    // Listen for resize events
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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



  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600">Please sign in to access the chat.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-chat-bg overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Modern Clean Design */}
      <div 
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed lg:relative lg:translate-x-0
          w-80 h-full bg-chat-sidebar-bg text-foreground flex flex-col
          transition-transform duration-200 ease-out z-50 lg:z-auto
          ${!sidebarOpen && 'lg:hidden'}
          border-r border-transparent
        `}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
          >
            ✕ Close
          </Button>
        </div>

        {/* Sidebar Header */}
        <div className="p-4">
          <Button
            onClick={handleCreateNewConversation}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2 py-3"
            disabled={isLoading}
          >
            <Plus className="w-4 h-4" />
            New chat
          </Button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto sidebar-scroll">
          <ConversationManager />
        </div>

        {/* Sidebar Footer */}
        <div className="p-4">
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={handleOpenSettings}
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Button>
            
            {user?.profile && (
              <div className="text-sm text-muted-foreground truncate">
                {user.profile.email}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar - Clean Design */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-chat-bg flex-shrink-0">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg p-2"
            >
              {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
            </Button>
            
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-medium text-foreground truncate">
                {currentConversation?.title || 'New conversation'}
              </h1>
            </div>
          </div>
          
          {/* User Avatar with Initials */}
          {user?.profile && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-sm">
                  {user.profile.given_name?.charAt(0)?.toUpperCase() || user.profile.email?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-4 sm:mx-6 mt-4 p-4 bg-destructive/10 rounded-xl">
            <p className="text-sm text-destructive font-medium">{error}</p>
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
