import { User } from "oidc-client-ts";
import { cognitoAuthConfig } from './config';
import { User as AppUser } from '@/types';

export class AuthService {
  // Helper method to get current user from OIDC context
  static formatUserData(oidcUser: User | null): AppUser | null {
    if (!oidcUser) return null;

    return {
      id: oidcUser.profile.sub || '',
      email: oidcUser.profile.email || '',
      name: oidcUser.profile.name || oidcUser.profile.given_name || 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Get ID token for API calls
  static getIdToken(oidcUser: User | null): string | null {
    return oidcUser?.id_token || null;
  }

  // Get access token for API calls
  static getAccessToken(oidcUser: User | null): string | null {
    return oidcUser?.access_token || null;
  }

  // Manual logout with Cognito logout URL
  static signOutRedirect(): void {
    const { client_id, post_logout_redirect_uri, cognitoDomain } = cognitoAuthConfig;
    const logoutUrl = `${cognitoDomain}/logout?client_id=${client_id}&logout_uri=${encodeURIComponent(post_logout_redirect_uri || window.location.origin)}`;
    window.location.href = logoutUrl;
  }

  // Check if user is authenticated
  static isAuthenticated(oidcUser: User | null): boolean {
    return !!oidcUser && !oidcUser.expired;
  }

  // Get user profile information
  static getUserProfile(oidcUser: User | null): Record<string, unknown> | null {
    return oidcUser?.profile || null;
  }
}
