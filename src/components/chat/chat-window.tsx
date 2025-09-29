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
    <div className="flex flex-col h-full bg-chat-bg">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-8 shadow-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-foreground mb-6">
              How can I help you today?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mb-12">
              <div className="p-6 rounded-2xl hover:bg-muted/30 transition-all duration-200 cursor-pointer group">
                <h3 className="font-medium text-foreground mb-3 group-hover:text-primary transition-colors">💡 Explain concepts</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Break down complex topics into simple terms</p>
              </div>
              <div className="p-6 rounded-2xl hover:bg-muted/30 transition-all duration-200 cursor-pointer group">
                <h3 className="font-medium text-foreground mb-3 group-hover:text-primary transition-colors">✍️ Write content</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Create essays, emails, code, or creative writing</p>
              </div>
              <div className="p-6 rounded-2xl hover:bg-muted/30 transition-all duration-200 cursor-pointer group">
                <h3 className="font-medium text-foreground mb-3 group-hover:text-primary transition-colors">🔍 Answer questions</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Get detailed answers on any topic</p>
              </div>
              <div className="p-6 rounded-2xl hover:bg-muted/30 transition-all duration-200 cursor-pointer group">
                <h3 className="font-medium text-foreground mb-3 group-hover:text-primary transition-colors">🎯 Solve problems</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Work through challenges step by step</p>
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
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-chat-bg px-3 sm:px-4 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput 
            onSendMessage={onSendMessage}
            disabled={isLoading}
            placeholder={messages.length === 0 ? "Message AskSamay..." : "Message AskSamay..."}
          />
        </div>
      </div>
    </div>
  )
}
