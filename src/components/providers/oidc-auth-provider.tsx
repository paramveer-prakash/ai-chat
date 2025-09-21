"use client";

import React from "react";
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
    onSignoutCallback: () => {
      console.log('User signed out');
    },
    onRemoveUser: () => {
      console.log('User session cleared');
    }
  };

  return (
    <AuthProvider {...enhancedConfig}>
      {children}
    </AuthProvider>
  );
}
