'use client'

import { useState, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Type your message..." 
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!message.trim() || isLoading) return

    const messageToSend = message.trim()
    setMessage('')
    setIsLoading(true)

    try {
      await onSendMessage(messageToSend)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isDisabled = disabled || isLoading || !message.trim()

  return (
    <div className="relative">
      <div className="flex items-end bg-chat-input-bg border border-chat-input-border rounded-2xl p-3 sm:p-4 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all duration-200">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className="flex-1 resize-none bg-transparent text-foreground placeholder-muted-foreground border-0 focus:outline-none min-h-[28px] max-h-40 sm:max-h-48 text-sm sm:text-base leading-relaxed"
          rows={1}
          style={{
            height: 'auto',
            minHeight: '28px',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
        />
        
        <Button
          onClick={handleSend}
          disabled={isDisabled}
          size="sm"
          className={cn(
            "ml-3 h-9 w-9 p-0 rounded-xl transition-all duration-200",
            isDisabled 
              ? "bg-muted text-muted-foreground cursor-not-allowed" 
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Character count - only show when approaching limit */}
      {message.length > 3000 && (
        <div className="absolute -top-6 right-0 text-xs text-muted-foreground">
          <span className={cn(
            "font-mono",
            message.length > 3500 && "text-orange-500",
            message.length > 3800 && "text-destructive"
          )}>
            {message.length}/4000
          </span>
        </div>
      )}
    </div>
  )
}
