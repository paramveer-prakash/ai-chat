'use client'

import { Message } from '@/types'
import { cn, formatDate, formatTokens } from '@/lib/utils'
import { User, Bot, Clock, Zap, Copy, Check } from 'lucide-react'
import { MarkdownRenderer } from './markdown-renderer'
import { useState } from 'react'

interface MessageBubbleProps {
  message: Message
  isLoading?: boolean
}

export function MessageBubble({ message, isLoading = false }: MessageBubbleProps) {
  const isUser = message.role === 'USER'
  const isAssistant = message.role === 'ASSISTANT'
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className={cn(
      "py-3 px-4 sm:px-6",
      isAssistant ? "bg-chat-assistant-bg" : ""
    )}>
      <div className="max-w-6xl mx-auto">
        <div className={cn(
          "flex gap-3 items-start",
          isUser ? "flex-row-reverse" : ""
        )}>
          {/* Avatar */}
          <div className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            isUser 
              ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-sm" 
              : "bg-gradient-to-br from-gray-600 to-gray-700 text-white shadow-sm"
          )}>
            {isUser ? (
              <User className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </div>

          {/* Message Content */}
          <div className={cn(
            "flex-1 min-w-0 space-y-2",
            isUser ? "flex flex-col items-end" : ""
          )}>
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
                {/* WhatsApp-style message bubble */}
                <div className={cn(
                  "relative max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl group",
                  isUser ? "flex flex-col items-end" : ""
                )}>
                  <div className={cn(
                    "px-4 py-2 chat-message",
                    isUser 
                      ? "rounded-l-2xl rounded-tr-2xl rounded-br-sm bg-[#333537] rounded-[15px] rounded-tr-none py-[12px] px-[16px]" 
                      : "rounded-r-2xl rounded-tl-2xl rounded-bl-sm pr-12"
                  )}>
                    {isAssistant ? (
                      <MarkdownRenderer content={message.content} />
                    ) : (
                      <div className="whitespace-pre-wrap break-words font-sans">
                        {message.content}
                      </div>
                    )}
                  </div>
                  
                  {/* Copy button - positioned differently for user vs AI messages */}
                  {isUser ? (
                    // For user messages, position outside the bubble
                    <button
                      onClick={handleCopy}
                      className={cn(
                        "mt-2 p-1.5 rounded-md transition-all duration-500 ease-in-out",
                        "opacity-0 group-hover:opacity-100",
                        "bg-white/80 hover:bg-white/90 text-gray-500 hover:text-gray-700",
                        "dark:bg-gray-800/60 dark:hover:bg-gray-800/90 dark:text-gray-400 dark:hover:text-gray-200",
                        "shadow-sm hover:shadow-md border border-gray-200/50 dark:border-gray-600/50"
                      )}
                      title={copied ? "Copied!" : "Copy message"}
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  ) : (
                    // For AI messages, position inside the bubble
                    <button
                      onClick={handleCopy}
                      className={cn(
                        "absolute top-2 right-2 p-1.5 rounded-md transition-all duration-500 ease-in-out",
                        "opacity-0 group-hover:opacity-100 z-10",
                        "bg-white/80 hover:bg-white/90 text-gray-500 hover:text-gray-700",
                        "dark:bg-gray-800/60 dark:hover:bg-gray-800/90 dark:text-gray-400 dark:hover:text-gray-200",
                        "shadow-sm hover:shadow-md border border-gray-200/50 dark:border-gray-600/50"
                      )}
                      title={copied ? "Copied!" : "Copy message"}
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
                
                {/* Message metadata */}
                <div className={cn(
                  "flex items-center gap-3 chat-message-small text-muted-foreground flex-wrap",
                  isUser ? "justify-end" : "justify-start"
                )}>
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
