# Restaurant Menu Web Application

A modern Next.js web application that provides a traditional restaurant menu interface enhanced with AI-powered conversational ordering capabilities.

## 🎯 Overview

This web application offers:
- **Traditional Menu Browsing**: Clean, intuitive interface for browsing menu categories and items
- **AI Chat Integration**: Seamless switch to conversational ordering mode
- **Voice Input Support**: Web Speech API integration for hands-free ordering
- **Real-time Cart Management**: Dynamic shopping cart with instant updates
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun 1.0+
- npm, yarn, pnpm, or bun package manager
- The Restaurant Chat Agent running locally (see [agent documentation](../restaurant-chat/README.md))

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

2. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💡 Key Features

### 1. Menu Display System

The application displays menu items organized by categories:
- **Category Cards**: Visual cards for each menu category
- **Item Details**: Name, description, price, and options
- **Responsive Grid**: Adapts to different screen sizes

### 2. AI Chat Integration

Powered by Vercel AI SDK's `useChat` hook:
- **Natural Language Input**: Type or speak your order
- **Real-time Streaming**: See AI responses as they're generated
- **Tool Call Handling**: Special UI components for order actions
- **Context Preservation**: Maintains conversation history

### 3. Voice Ordering

Web Speech API integration allows:
- **Voice Input**: Click the microphone to speak orders
- **Language Support**: Works with browser's default language
- **Fallback Handling**: Graceful degradation if not supported

### 4. Cart Management

Custom React Context for cart state:
- **Add/Remove Items**: Simple cart operations
- **Quantity Management**: Adjust item quantities
- **Price Calculation**: Automatic total calculation
- **Persistent State**: Cart survives page refreshes

## 🔧 Configuration

### Agent Endpoint

Update the AI agent endpoint in `src/components/chat/ChatInterface.tsx`:

```typescript
const { messages, input, handleSubmit } = useChat({
  api: 'http://127.0.0.1:3500/agent_YOUR_AGENT_ID',
  // ... other options
});
```

### Menu Data

The menu is loaded from `src/data/menu.json`. Structure:

```json
{
  "categories": [
    {
      "id": "appetizers",
      "name": "Appetizers",
      "items": [
        {
          "id": "item-1",
          "name": "Mozzarella Sticks",
          "description": "Golden fried mozzarella",
          "price": 8.99
        }
      ]
    }
  ]
}
```
