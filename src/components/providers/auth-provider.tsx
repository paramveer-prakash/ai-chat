"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { useAuthStore } from "@/stores/auth-store";
import { routes } from "@/lib/config";

// Public routes that don't require authentication
const publicRoutes = [routes.home, routes.login, routes.callback] as string[];

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const { updateAuthState } = useAuthStore();

  // Sync OIDC state with our auth store
  useEffect(() => {
    updateAuthState(auth.user || null, auth.isLoading, auth.error);
  }, [auth.user, auth.isLoading, auth.error, updateAuthState]);

  // Handle authentication routing
  useEffect(() => {
    if (auth.isLoading) return;

    const isPublicRoute = publicRoutes.includes(pathname);

    if (!auth.isAuthenticated && !isPublicRoute) {
      // Check if there's a stored authentication state before redirecting
      const storedAuth = localStorage.getItem('auth-store');
      if (storedAuth) {
        try {
          const parsedAuth = JSON.parse(storedAuth);
          if (parsedAuth.state?.isAuthenticated) {
            // Don't redirect immediately, let OIDC context load the user
            return;
          }
        } catch {
          // Invalid stored auth, clear it
          localStorage.removeItem('auth-store');
        }
      }
      
      // Redirect to home page instead of login to show the landing page
      router.push(routes.home);
    } else if (auth.isAuthenticated && (pathname === routes.login || pathname === routes.home)) {
      // Redirect to chat if user is authenticated and trying to access login/home page
      router.push(routes.chat);
    }
  }, [auth.isAuthenticated, pathname, router, auth.isLoading]);

  // Show loading spinner while auth is loading
  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error if auth failed
  if (auth.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{auth.error.message}</p>
          <button
            onClick={() => auth.signinRedirect()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
