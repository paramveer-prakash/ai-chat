'use client'

import { useAuth } from 'react-oidc-context'
import { Button } from '@/components/ui/button'
import { RateLimitStatusComponent } from '@/components/rate-limit-status'
import { ArrowLeft, User, Shield, Zap, Info, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    const authStore = await import('@/stores/auth-store')
    authStore.useAuthStore.getState().signOutRedirect()
  }

  const handleBack = () => {
    router.push('/chat')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/')
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Chat</span>
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Account Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Account</h2>
                <p className="text-sm text-gray-500">Manage your account settings and preferences</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-500">{user?.profile?.email || 'Not available'}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Name</p>
                  <p className="text-sm text-gray-500">{user?.profile?.name || user?.profile?.given_name || 'Not available'}</p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Usage & Rate Limits */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Usage & Rate Limits</h2>
                <p className="text-sm text-gray-500">Monitor your API usage and rate limit status</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <RateLimitStatusComponent />
            </div>
          </div>

          {/* AI Model Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Info className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">AI Model</h2>
                <p className="text-sm text-gray-500">Information about the AI model powering your conversations</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Model</p>
                  <p className="text-sm text-gray-500">Amazon Nova Pro</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Provider</p>
                  <p className="text-sm text-gray-500">AWS Bedrock</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Capabilities</p>
                  <p className="text-sm text-gray-500">Text generation, conversation memory, context awareness</p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Privacy & Security</h2>
                <p className="text-sm text-gray-500">Your data protection and security settings</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Authentication</p>
                  <p className="text-sm text-gray-500">AWS Cognito OIDC</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Secure</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Data Encryption</p>
                  <p className="text-sm text-gray-500">End-to-end encryption in transit</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Conversation Storage</p>
                  <p className="text-sm text-gray-500">Stored securely with automatic cleanup</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Protected</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

