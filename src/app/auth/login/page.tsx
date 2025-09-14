'use client'

import { useEffect } from 'react'
import { useAuth } from 'react-oidc-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Bot, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const { signinRedirect, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/chat')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back to home button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to AI Chat
            </h1>
            <p className="text-gray-600">
              Sign in to start your conversation with Amazon Nova Pro
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => signinRedirect()}
              className="w-full"
              size="lg"
            >
              Sign In with AWS Cognito
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              Secure authentication powered by AWS Cognito
            </div>
          </div>

          {/* Features preview */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              What you&apos;ll get:
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Advanced AI conversations
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Conversation history
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Secure and private
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
