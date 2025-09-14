export const cognitoAuthConfig = {
  authority: process.env.NEXT_PUBLIC_COGNITO_AUTHORITY || "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_KAyuLakQ6",
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "79go35q1c7n3cgcpjimu7koet6",
  redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/auth/callback",
  post_logout_redirect_uri: process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI || "http://localhost:3000",
  response_type: "code",
  scope: "email openid profile",
  loadUserInfo: true,
  cognitoDomain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "https://ap-south-1q9mjw92rh.auth.ap-south-1.amazoncognito.com",
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
