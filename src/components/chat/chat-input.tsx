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
      <div className="flex items-end bg-gray-50 border border-gray-200 rounded-2xl p-2.5 sm:p-3 focus-within:border-gray-300 transition-colors">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className="flex-1 resize-none bg-transparent text-gray-900 placeholder-gray-500 border-0 focus:outline-none min-h-[24px] max-h-32 sm:max-h-40 text-sm sm:text-base leading-6"
          rows={1}
          style={{
            height: 'auto',
            minHeight: '24px',
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
            "ml-2 h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-lg transition-all",
            isDisabled 
              ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
              : "bg-gray-900 text-white hover:bg-gray-700"
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
        <div className="absolute -top-6 right-0 text-xs text-gray-500">
          <span className={cn(
            message.length > 3500 && "text-orange-500",
            message.length > 3800 && "text-red-500"
          )}>
            {message.length}/4000
          </span>
        </div>
      )}
    </div>
  )
}
