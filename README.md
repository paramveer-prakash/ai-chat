# AI Chat - ChatGPT-like Interface

A modern, responsive ChatGPT-like interface built with Next.js that connects to the AI module backend powered by Amazon Nova Pro.

## Features

✨ **Modern Chat Interface**
- Real-time messaging with AI assistant
- Beautiful message bubbles with metadata
- Typing indicators and loading states
- Responsive design for all devices

🔐 **Secure Authentication**
- AWS Cognito OAuth2 integration
- Secure token-based authentication
- Automatic session management
- Protected routes

🤖 **AI Integration**
- Full integration with backend AI module
- Amazon Nova Pro model
- Conversation persistence
- Message history
- Token usage tracking

## Backend Integration

This frontend integrates with the AI module located at:
`backend/master-apis/src/main/java/com/param/masterapis/ai`

### Supported API Endpoints

- `POST /api/v1/ai/conversations` - Create new conversation
- `POST /api/v1/ai/conversations/{id}/messages` - Send messages
- `GET /api/v1/ai/conversations` - List conversations
- `GET /api/v1/ai/conversations/{id}/messages` - Get message history
- `PUT /api/v1/ai/conversations/{id}/archive` - Archive conversation
- `DELETE /api/v1/ai/conversations/{id}` - Delete conversation
- `GET /api/v1/ai/rate-limit-status` - Get rate limit status

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend AI API running (see backend README)

### Installation

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure environment:**
   \`\`\`bash
   cp env.example .env.local
   \`\`\`
   
   Edit \`.env.local\` with your configuration:
   \`\`\`env
   NEXT_PUBLIC_COGNITO_AUTHORITY=https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_KAyuLakQ6
   NEXT_PUBLIC_COGNITO_CLIENT_ID=79go35q1c7n3cgcpjimu7koet6
   NEXT_PUBLIC_API_URL=http://localhost:8080
   \`\`\`

3. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Authentication Setup

This app uses AWS Cognito for authentication, following the same pattern as the invoicing-day app:

1. **OIDC Client**: Uses \`react-oidc-context\` for OAuth2 flow
2. **State Management**: Zustand store for auth state
3. **Protected Routes**: Automatic redirect to login for unauthenticated users
4. **Token Management**: Automatic token refresh and storage

## Usage

### Getting Started

1. Visit the homepage
2. Click "Sign In" to authenticate with AWS Cognito
3. After successful authentication, you'll be redirected to the chat interface
4. Start chatting with the AI assistant

### Chat Features

- **Send Messages**: Type your message and press Enter
- **View History**: All messages are saved and displayed
- **Conversation Context**: AI maintains context throughout the conversation
- **Real-time**: Instant response display with loading indicators

## Architecture

### Component Structure

\`\`\`
src/
├── components/
│   ├── chat/                  # Chat-specific components
│   │   ├── chat-window.tsx    # Main chat interface
│   │   ├── chat-input.tsx     # Message input form
│   │   └── message-bubble.tsx # Individual message display
│   ├── providers/             # Context providers
│   │   ├── oidc-auth-provider.tsx # OIDC authentication
│   │   └── auth-provider.tsx  # Auth state management
│   └── ui/                    # Reusable UI components
├── stores/
│   ├── auth-store.ts          # Authentication state
│   └── chat-store.ts          # Chat state management
├── lib/
│   ├── config.ts              # App configuration
│   ├── auth.ts                # Auth utilities
│   ├── api.ts                 # API client
│   └── utils.ts               # Utility functions
├── types/
│   └── index.ts               # TypeScript definitions
└── app/
    ├── page.tsx               # Homepage
    ├── chat/page.tsx          # Chat interface
    └── auth/
        ├── login/page.tsx     # Login page
        └── callback/page.tsx  # Auth callback
\`\`\`

### State Management

- **Auth Store**: Manages authentication state using Zustand
- **Chat Store**: Handles conversation and message state
- **OIDC Context**: Provides OAuth2 authentication flow

### API Integration

- **Axios Client**: HTTP client with automatic auth headers
- **Error Handling**: Automatic retry and error display
- **Type Safety**: Full TypeScript integration with backend DTOs

## Development

### Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint

### Key Technologies

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **react-oidc-context** - OAuth2 authentication
- **Zustand** - State management
- **Axios** - HTTP client
- **Lucide React** - Icons

## Deployment

### Environment Variables

For production deployment:

\`\`\`env
NEXT_PUBLIC_COGNITO_AUTHORITY=https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_KAyuLakQ6
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-cognito-client-id
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_REDIRECT_URI=https://your-domain.com/auth/callback
\`\`\`

### Build and Deploy

\`\`\`bash
npm run build
npm run start
\`\`\`

## Backend Requirements

Ensure your backend is running with:

1. **AI Module**: Spring Boot AI API at \`/api/v1/ai/*\`
2. **CORS**: Enabled for your frontend domain
3. **Authentication**: AWS Cognito JWT validation
4. **Amazon Nova Pro**: AI model configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## License

This project is part of the master-system and follows the same license terms.