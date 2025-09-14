'use client'

import { useEffect, useState } from 'react'
import { RateLimitStatus } from '@/types'
import { ChatAPI } from '@/lib/api'
import { AlertTriangle, Clock, MessageSquare, Zap } from 'lucide-react'

interface RateLimitStatusComponentProps {
  className?: string
}

export function RateLimitStatusComponent({ className }: RateLimitStatusComponentProps) {
  const [status, setStatus] = useState<RateLimitStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadStatus = async () => {
    try {
      setIsLoading(true)
      const rateLimitStatus = await ChatAPI.getRateLimitStatus()
      setStatus(rateLimitStatus)
    } catch (error) {
      console.error('Failed to load rate limit status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStatus()
    // Refresh every 30 seconds
    const interval = setInterval(loadStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading && !status) {
    return (
      <div className={`p-3 bg-gray-50 rounded-lg ${className}`}>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 animate-spin" />
          Loading usage stats...
        </div>
      </div>
    )
  }

  if (!status) {
    return null
  }

  const requestsPercentage = Math.min((status.currentRequests / status.dailyRequestLimit) * 100, 100)
  const tokensPercentage = Math.min((status.currentTokens / status.dailyTokenLimit) * 100, 100)
  const conversationsPercentage = Math.min((status.activeConversations / status.maxActiveConversations) * 100, 100)

  const isNearLimit = requestsPercentage > 80 || tokensPercentage > 80 || conversationsPercentage > 80

  return (
    <div className={`p-3 bg-gray-50 rounded-lg border ${isNearLimit ? 'border-orange-200 bg-orange-50' : 'border-gray-200'} ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        {isNearLimit && <AlertTriangle className="w-4 h-4 text-orange-500" />}
        <h3 className="text-sm font-medium text-gray-900">
          {isNearLimit ? 'Usage Limits Warning' : 'Usage Status'}
        </h3>
      </div>

      <div className="space-y-3">
        {/* Daily Requests */}
        <div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>Daily Requests</span>
            </div>
            <span>{status.currentRequests}/{status.dailyRequestLimit}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all ${
                requestsPercentage > 90 ? 'bg-red-500' : 
                requestsPercentage > 80 ? 'bg-orange-500' : 'bg-blue-500'
              }`}
              style={{ width: `${requestsPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Active Conversations */}
        <div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>Active Conversations</span>
            </div>
            <span>{status.activeConversations}/{status.maxActiveConversations}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all ${
                conversationsPercentage > 90 ? 'bg-red-500' : 
                conversationsPercentage > 80 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${conversationsPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Daily Tokens */}
        <div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Daily Tokens</span>
            </div>
            <span>{status.currentTokens.toLocaleString()}/{status.dailyTokenLimit.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all ${
                tokensPercentage > 90 ? 'bg-red-500' : 
                tokensPercentage > 80 ? 'bg-orange-500' : 'bg-purple-500'
              }`}
              style={{ width: `${tokensPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {isNearLimit && (
        <div className="mt-3 text-xs text-orange-700">
          You&apos;re approaching your usage limits. Consider archiving some conversations to free up space.
        </div>
      )}
    </div>
  )
}
