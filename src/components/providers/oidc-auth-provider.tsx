"use client";

import React from "react";
import { AuthProvider } from "react-oidc-context";
import { cognitoAuthConfig } from "@/lib/config";

interface OIDCAuthProviderProps {
  children: React.ReactNode;
}

export function OIDCAuthProvider({ children }: OIDCAuthProviderProps) {
  return (
    <AuthProvider {...cognitoAuthConfig}>
      {children}
    </AuthProvider>
  );
}
