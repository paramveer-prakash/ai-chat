'use client'

import { useEffect } from 'react'
import { useAuth } from 'react-oidc-context'

export default function SilentCallbackPage() {
  const auth = useAuth()

  useEffect(() => {
    // The silent callback is handled automatically by react-oidc-context
    // This page is just needed as the target URL for silent token renewal
    
    // Optional: Handle any silent callback completion
    if (auth.activeNavigator && auth.activeNavigator === "signinSilent") {
      // Silent renewal completed
      console.log('Silent token renewal completed')
    }
  }, [auth.activeNavigator])

  // This page should be minimal as it's used for iframe-based silent renewal
  return (
    <div style={{ display: 'none' }}>
      Silent authentication callback
    </div>
  )
}
