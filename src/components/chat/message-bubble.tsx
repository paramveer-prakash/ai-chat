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
      "py-4 px-4 sm:px-6",
      isAssistant ? "bg-chat-assistant-bg" : "bg-chat-user-bg"
    )}>
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-start">
          {/* Avatar */}
          <div className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            isUser 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground"
          )}>
            {isUser ? (
              <User className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0 space-y-4">
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-muted-foreground font-medium">AI is thinking...</span>
              </div>
            ) : (
              <>
                <div className="text-foreground leading-relaxed prose prose-sm max-w-none">
                  {isAssistant ? (
                    <MarkdownRenderer content={message.content} />
                  ) : (
                    <div className="whitespace-pre-wrap break-words font-sans">
                      {message.content}
                    </div>
                  )}
                </div>
                
                {/* Message metadata */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {formatDate(message.createdAt)}
                  </span>
                  
                  {message.tokens && (
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3 h-3" />
                      {formatTokens(message.tokens)} tokens
                    </span>
                  )}
                  
                  {message.processingTimeMs && isAssistant && (
                    <span className="font-mono">
                      {(message.processingTimeMs / 1000).toFixed(1)}s
                    </span>
                  )}
                  
                  {message.modelVersion && isAssistant && (
                    <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
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
