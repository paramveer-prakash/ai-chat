import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService } from '@/lib/auth';
import { AuthState } from '@/types';
import { User as OIDCUser } from 'oidc-client-ts';

interface AuthActions {
  // Update state based on OIDC context
  updateAuthState: (oidcUser: OIDCUser | null, isLoading: boolean, error?: Error | null) => void;
  // Get access token
  getAccessToken: (oidcUser: OIDCUser | null) => string | null;
  // Sign out
  signOutRedirect: () => void;
  // Clear auth state
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
      access_token: null,

      updateAuthState: (oidcUser: OIDCUser | null, isLoading: boolean, error?: Error | null) => {
        const isAuthenticated = AuthService.isAuthenticated(oidcUser);
        const user = isAuthenticated ? AuthService.formatUserData(oidcUser) : null;

        set({
          isAuthenticated,
          user,
          isLoading,
          error: error || null,
          access_token: oidcUser?.access_token || null,
        });
      },

      getAccessToken: (oidcUser: OIDCUser | null) => {
        return AuthService.getAccessToken(oidcUser);
      },

      signOutRedirect: () => {
        AuthService.signOutRedirect();
      },

      clearAuth: () => {
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
          access_token: null,
        });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        access_token: state.access_token,
      }),
    }
  )
);
