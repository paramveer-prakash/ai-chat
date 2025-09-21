'use client'

import { Message } from '@/types'
import { cn, formatDate, formatTokens } from '@/lib/utils'
import { User, Bot, Clock, Zap } from 'lucide-react'
import { MarkdownRenderer } from './markdown-renderer'

interface MessageBubbleProps {
  message: Message
  isLoading?: boolean
}

export function MessageBubble({ message, isLoading = false }: MessageBubbleProps) {
  const isUser = message.role === 'USER'
  const isAssistant = message.role === 'ASSISTANT'

  return (
    <div className={cn(
      "py-4 sm:py-6 px-3 sm:px-4",
      isAssistant ? "bg-gray-50" : "bg-white"
    )}>
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-3 sm:gap-4 items-start">
          {/* Avatar */}
          <div className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            isUser 
              ? "bg-blue-500 text-white" 
              : "bg-green-500 text-white"
          )}>
            {isUser ? (
              <User className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0 space-y-3">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-500">AI is thinking...</span>
              </div>
            ) : (
              <>
                <div className="text-gray-900 leading-7">
                  {isAssistant ? (
                    <MarkdownRenderer content={message.content} />
                  ) : (
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                  )}
                </div>
                
                {/* Message metadata */}
                <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(message.createdAt)}
                  </span>
                  
                  {message.tokens && (
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {formatTokens(message.tokens)} tokens
                    </span>
                  )}
                  
                  {message.processingTimeMs && isAssistant && (
                    <span>
                      {(message.processingTimeMs / 1000).toFixed(1)}s
                    </span>
                  )}
                  
                  {message.modelVersion && isAssistant && (
                    <span className="font-mono">
                      {message.modelVersion.split(':')[0].split('.').pop()}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
