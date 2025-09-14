'use client'

import { useState, useEffect } from 'react'
import { useChatStore } from '@/stores/chat-store'
import { Button } from '@/components/ui/button'
import { Trash2, MessageSquare } from 'lucide-react'
import { Conversation } from '@/types'

interface ConversationManagerProps {
  className?: string
}

export function ConversationManager({ className }: ConversationManagerProps) {
  const { 
    conversations, 
    currentConversation,
    loadConversations, 
    selectConversation,
    deleteConversation,
    isLoading 
  } = useChatStore()
  
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  const handleDeleteConversation = async (conversationId: number) => {
    if (confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      await deleteConversation(conversationId)
      await loadConversations() // Refresh the list
    }
  }

  const activeConversations = conversations.filter(conv => conv.status === 'ACTIVE')

  return (
    <div className={`${className}`}>
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Recent</h3>
          {conversations.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white text-xs h-6"
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
          )}
        </div>
      </div>

      <div className="px-2">
        {activeConversations.length === 0 ? (
          <div className="px-2 py-4 text-center">
            <p className="text-sm text-gray-500">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {(isExpanded ? activeConversations : activeConversations.slice(0, 5)).map((conversation) => (
              <ConversationItemChatGPT
                key={conversation.id}
                conversation={conversation}
                isSelected={currentConversation?.id === conversation.id}
                onSelect={() => selectConversation(conversation)}
                onDelete={() => handleDeleteConversation(conversation.id)}
                isLoading={isLoading}
              />
            ))}
            
            {!isExpanded && activeConversations.length > 5 && (
              <div className="px-3 py-2">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Show {activeConversations.length - 5} more...
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  )
}

interface ConversationItemChatGPTProps {
  conversation: Conversation
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  isLoading: boolean
}

function ConversationItemChatGPT({ 
  conversation, 
  isSelected, 
  onSelect, 
  onDelete, 
  isLoading
}: ConversationItemChatGPTProps) {
  const [showDelete, setShowDelete] = useState(false)

  return (
    <div 
      className={`group relative px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between ${
        isSelected 
          ? 'bg-gray-800 text-white' 
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
      onClick={onSelect}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <MessageSquare className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm truncate">
          {conversation.title}
        </span>
      </div>
      
      {showDelete && !isLoading && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="h-6 w-6 p-0 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      )}
    </div>
  )
}
