'use client'

import { useEffect, useRef } from 'react'
import { Message } from '@/types'
import { MessageBubble } from './message-bubble'
import { ChatInput } from './chat-input'
import { Bot } from 'lucide-react'

interface ChatWindowProps {
  messages: Message[]
  onSendMessage: (message: string) => Promise<void>
  isLoading?: boolean
  error?: string | null
  conversationTitle?: string
}

export function ChatWindow({ 
  messages, 
  onSendMessage, 
  isLoading = false, 
  error = null
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  return (
    <div className="flex flex-col h-full bg-white">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Bot className="w-6 h-6 text-gray-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
              How can I help you today?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-8">
              <div className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <h3 className="font-medium text-gray-900 mb-2">💡 Explain concepts</h3>
                <p className="text-sm text-gray-600">Break down complex topics into simple terms</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <h3 className="font-medium text-gray-900 mb-2">✍️ Write content</h3>
                <p className="text-sm text-gray-600">Create essays, emails, code, or creative writing</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <h3 className="font-medium text-gray-900 mb-2">🔍 Answer questions</h3>
                <p className="text-sm text-gray-600">Get detailed answers on any topic</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <h3 className="font-medium text-gray-900 mb-2">🎯 Solve problems</h3>
                <p className="text-sm text-gray-600">Work through challenges step by step</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isLoading && (
              <MessageBubble 
                message={{
                  id: -1,
                  role: 'ASSISTANT',
                  content: '',
                  createdAt: new Date().toISOString()
                }}
                isLoading={true}
              />
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-3 sm:px-4 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput 
            onSendMessage={onSendMessage}
            disabled={isLoading}
            placeholder={messages.length === 0 ? "Message ChatGPT..." : "Message ChatGPT..."}
          />
        </div>
      </div>
    </div>
  )
}
