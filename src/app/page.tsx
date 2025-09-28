'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from 'react-oidc-context'
import { Button } from '@/components/ui/button'
import { Bot, MessageSquare, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  const { isAuthenticated, isLoading, signinRedirect, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check for existing authentication immediately
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/chat')
      } else {
        // Try to get user if there might be a valid session
        const storedAuth = localStorage.getItem('auth-store');
        if (storedAuth) {
          try {
            const parsedAuth = JSON.parse(storedAuth);
            if (parsedAuth.state?.isAuthenticated && parsedAuth.state?.access_token) {
              // There's stored auth, let's wait a bit for OIDC to potentially restore the session
              const timeout = setTimeout(() => {
                if (!isAuthenticated) {
                  // If still not authenticated after waiting, clear stored auth
                  localStorage.removeItem('auth-store');
                }
              }, 2000);
              return () => clearTimeout(timeout);
            }
          } catch {
            localStorage.removeItem('auth-store');
          }
        }
      }
    }
  }, [isAuthenticated, isLoading, router, user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">AI Chat</span>
            </div>
            <Button 
              onClick={() => signinRedirect()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-xl font-medium transition-all duration-200"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto">
          <div className="mb-12">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mx-auto mb-8">
              <MessageSquare className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-6xl sm:text-7xl font-bold text-foreground mb-8 leading-tight">
              Your AI Assistant
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience the power of Amazon Nova Pro AI model in a beautiful, 
              ChatGPT-like interface. Ask questions, get creative, and explore 
              the possibilities.
            </p>
          </div>

          <div className="mb-16">
            <Button
              onClick={() => signinRedirect()}
              size="lg"
              className="text-lg px-10 py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl font-medium transition-all duration-200"
            >
              Get Started
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="text-center p-8 rounded-2xl hover:bg-muted/30 transition-all duration-200">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Powerful AI
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Powered by Amazon Nova Pro, one of the most advanced AI models available.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl hover:bg-muted/30 transition-all duration-200">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Conversation Memory
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Maintains context throughout your conversations for natural interactions.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl hover:bg-muted/30 transition-all duration-200">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Secure & Private
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Your conversations are protected with enterprise-grade security.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-muted-foreground">
            <p className="font-medium">© 2025 AI Chat. Powered by Amazon Nova Pro.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}