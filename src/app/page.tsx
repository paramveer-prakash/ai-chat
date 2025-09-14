'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from 'react-oidc-context'
import { Button } from '@/components/ui/button'
import { Bot, MessageSquare, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  const { isAuthenticated, isLoading, signinRedirect } = useAuth()
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AI Chat</span>
            </div>
            <Button onClick={() => signinRedirect()}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Your AI Assistant
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the power of Amazon Nova Pro AI model in a beautiful, 
              ChatGPT-like interface. Ask questions, get creative, and explore 
              the possibilities.
            </p>
          </div>

          <div className="mb-12">
            <Button
              onClick={() => signinRedirect()}
              size="lg"
              className="text-lg px-8 py-3"
            >
              Get Started
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Powerful AI
              </h3>
              <p className="text-gray-600">
                Powered by Amazon Nova Pro, one of the most advanced AI models available.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Conversation Memory
              </h3>
              <p className="text-gray-600">
                Maintains context throughout your conversations for natural interactions.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600">
                Your conversations are protected with enterprise-grade security.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>© 2025 AI Chat. Powered by Amazon Nova Pro.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}