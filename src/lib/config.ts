import { WebStorageStateStore } from 'oidc-client-ts';

export const cognitoAuthConfig = {
  authority: process.env.NEXT_PUBLIC_COGNITO_AUTHORITY || "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_KAyuLakQ6",
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "79go35q1c7n3cgcpjimu7koet6",
  redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/auth/callback",
  post_logout_redirect_uri: process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI || "http://localhost:3000",
  response_type: "code",
  scope: "email openid profile",
  loadUserInfo: true,
  cognitoDomain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "https://ap-south-1kayulakq6.auth.ap-south-1.amazoncognito.com",
  
  // Session management settings for cross-tab authentication
  automaticSilentRenew: true,
  includeIdTokenInSilentRenew: true,
  silent_redirect_uri: process.env.NEXT_PUBLIC_SILENT_REDIRECT_URI || "http://localhost:3000/auth/silent-callback",
  
  // User store settings to persist authentication across tabs
  userStore: typeof window !== 'undefined' ? new WebStorageStateStore({
    store: window.localStorage
  }) : undefined,
  
  // Timing settings
  silentRequestTimeout: 10000,
  accessTokenExpiringNotificationTime: 60,
  checkSessionInterval: 2000,
  
  // Enable session monitoring
  monitorSession: true,
  
  // Stale state cleanup
  staleStateAge: 900, // 15 minutes
};

export const appConfig = {
  name: "AI Chat",
  description: "ChatGPT-like interface powered by Amazon Nova Pro",
  version: "1.0.0",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
};

export const routes = {
  home: "/",
  login: "/auth/login",
  callback: "/auth/callback",
  chat: "/chat",
} as const;
