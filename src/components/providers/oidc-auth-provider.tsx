"use client";

import React, { useEffect } from "react";
import { AuthProvider } from "react-oidc-context";
import { cognitoAuthConfig } from "@/lib/config";

interface OIDCAuthProviderProps {
  children: React.ReactNode;
}

export function OIDCAuthProvider({ children }: OIDCAuthProviderProps) {
  // Enhanced configuration with proper session monitoring
  const enhancedConfig = {
    ...cognitoAuthConfig,
    onSigninCallback: () => {
      // Clean up URL after successful sign-in
      window.history.replaceState({}, document.title, window.location.pathname);
    },
    onUserLoaded: (user: any) => {
      console.log('User session loaded:', user?.profile?.email);
    },
    onUserUnloaded: () => {
      console.log('User session cleared');
    },
    onAccessTokenExpiring: () => {
      console.log('Access token expiring, attempting silent renewal...');
    },
    onAccessTokenExpired: () => {
      console.log('Access token expired');
    },
    onSilentRenewError: (error: any) => {
      console.log('Silent renewal failed:', error);
    }
  };

  return (
    <AuthProvider {...enhancedConfig}>
      {children}
    </AuthProvider>
  );
}
