# Restaurant Menu Ordering System

A modern, AI-powered restaurant menu ordering system that features a conversational interface for quick and frictionless ordering. This project demonstrates how AI agents can enhance the traditional e-commerce experience by allowing customers to order using natural language.

## 🎯 Overview

This project consists of two main components:
- **Restaurant Menu Web App**: A Next.js web application with a traditional menu interface enhanced with AI chat capabilities
- **Restaurant Chat Agent**: An Agentuity AI agent that processes natural language orders and manages the ordering flow

The system allows customers to:
- Browse a traditional menu interface
- Switch to a chat mode for quick ordering
- Use natural language to place orders (e.g., "I want a large pepperoni pizza and 2 cokes")
- Get intelligent recommendations and clarifications
- Review and confirm orders through a streamlined checkout process

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.2.4+
- npm, yarn, pnpm, or bun package manager
- Agentuity CLI (for running the AI agent)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd restaurant-menu
```

2. Install Agentuity CLI (if not already installed):

See here: https://agentuity.dev/Introduction/getting-started

3. Authenticate with Agentuity:
```bash
agentuity login
```

## 🏃 Running Locally

You'll need to run both the web application and the AI agent:

### 1. Start the AI Agent

```bash
cd restaurant-chat
bun install  # or npm install
agentuity dev
```

The agent will start on `http://localhost:3500`. Take note of the agent ID shown in the console.

### 2. Start the Web Application

In a new terminal:

```bash
cd restaurant-menu-web
npm install  # or yarn/pnpm/bun install
npm run dev  # or yarn/pnpm/bun dev
```

The web app will be available at `http://localhost:3000`.

### 3. Configure the Agent Endpoint

If needed, update the agent endpoint in the web application's chat component to match your agent ID:
- Look for the API endpoint in `src/components/chat/ChatInterface.tsx`
- Update the URL to match your agent: `http://127.0.0.1:3500/agent_YOUR_AGENT_ID`

## 💡 How It Works

### Web Application Flow

1. **Menu Display**: Traditional menu interface built with Next.js and Tailwind CSS
2. **Chat Mode**: Users can switch to chat mode for conversational ordering
3. **AI Integration**: Uses Vercel AI SDK's `useChat` hook to communicate with the Agentuity agent
4. **Cart Management**: Custom React context for managing cart state
5. **Voice Input**: Web Speech API integration for voice ordering

### AI Agent Architecture

1. **Menu Expert Agent**: Specialized agent that understands the restaurant menu
2. **Natural Language Processing**: Processes customer requests and extracts order details
3. **Tool Calls**: Returns structured data for UI components (item selection, order confirmation)
4. **Streaming Responses**: Real-time streaming of AI responses for better UX

### Key Features

- **Conversational Ordering**: Natural language interface for placing orders
- **Smart Recommendations**: AI suggests items based on customer preferences
- **Order Clarification**: Agent asks for clarification when needed
- **Visual Feedback**: Special UI components for item display and order confirmation
- **Voice Support**: Optional voice input for hands-free ordering
