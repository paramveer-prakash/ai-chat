'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from 'react-oidc-context'

export default function AuthCallbackPage() {
  const { isAuthenticated, isLoading, error } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/chat')
      } else if (error) {
        router.push('/')
      }
    }
  }, [isAuthenticated, isLoading, error, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completing sign in...
            </h2>
            <p className="text-gray-600">
              Please wait while we finish setting up your session.
            </p>
          </>
        ) : error ? (
          <>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-4">
              {error.message}
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Return Home
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Redirecting...
            </h2>
          </>
        )}
      </div>
    </div>
  )
}
