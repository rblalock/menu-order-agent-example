# Restaurant Ordering Application Project Plan

## Project Overview
Building a supercharged restaurant ordering web application that duplicates the Lighthouse Cove Mini Golf menu interface but adds an AI-powered chat interface for frictionless ordering. The goal is to allow customers to quickly order food through natural conversation rather than navigating through traditional UI elements.

## Target Reference
- Original website: https://my.lighthousecoveminigolf.com/venues/6bad29b9-614c-4764-bf4f-967d0ae08800/menu/6e3c014e-cb98-4042-b4e6-0b78da48a6ac/
- Menu data: Available in `menu.json`

## Architecture

### Frontend (NextJS Web App)
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Vercel AI SDK (useChat hook)
- **Location**: Main project directory

### Backend (Agentuity Agent)
- **Runtime**: Bun
- **Framework**: Agentuity JS SDK
- **AI Integration**: Vercel AI SDK for streaming
- **Location**: `restaurant-chat` subdirectory
- **Local endpoint**: `http://localhost:3500/agent_id_here`

## Implementation Phases

### Phase 1: Project Setup
1. **Web App Initialization**
   - Create Next.js project with TypeScript
   - Install and configure Tailwind CSS
   - Install Vercel AI SDK dependencies
   - Set up basic project structure

2. **Agent Project Setup**
   - Create `restaurant-chat` directory
   - Initialize Agentuity project
   - Configure agent with proper authentication
   - Set up development environment

### Phase 2: UI Implementation
1. **Menu Display**
   - Replicate the exact look and navigation of the target website
   - Parse and display menu.json data
   - Implement category navigation
   - Create item cards with images, descriptions, and prices

2. **Cart Interface**
   - Basic cart button/indicator
   - Cart drawer/modal for viewing items
   - Prototype Apple Pay button (non-functional)

### Phase 3: Chat Integration
1. **Frontend Chat Setup**
   - Implement chat UI component
   - Configure useChat hook with agent endpoint
   - Handle streaming responses
   - Session-based conversation tracking (no auth required)

2. **Agent Development**
   - Load menu.json as context
   - Implement natural language understanding for orders
   - Create tool functions for:
     - Item search and display
     - Order clarification
     - Cart management
     - Order confirmation

### Phase 4: Advanced Features
1. **Generative UI Components**
   - Item detail cards (when user asks about items)
   - Order confirmation UI
   - Payment confirmation screen
   - Order success component

2. **Tool Integration**
   - Implement structured data generation
   - Handle tool calls from agent
   - Create custom UI components for each tool response

## Technical Implementation Details

### Frontend Components Structure
```
components/
├── layout/
│   ├── Header.tsx
│   └── Navigation.tsx
├── menu/
│   ├── MenuGrid.tsx
│   ├── MenuItem.tsx
│   └── CategoryFilter.tsx
├── chat/
│   ├── ChatInterface.tsx
│   ├── ChatMessage.tsx
│   └── ChatInput.tsx
├── cart/
│   ├── CartButton.tsx
│   └── CartDrawer.tsx
└── ai-ui/
    ├── ItemDetail.tsx
    ├── OrderConfirmation.tsx
    └── PaymentScreen.tsx
```

### Agent Structure
```
restaurant-chat/
├── agents/menu-expert/index.ts          # Main agent entry
├── tools/
│   ├── searchMenu.ts
│   ├── addToCart.ts
│   └── confirmOrder.ts
├── utils/
│   └── menuParser.ts
└── prompts/
    └── system.ts
```

### Key Integration Points

1. **useChat Configuration**
```typescript
const { messages, input, handleInputChange, handleSubmit } = useChat({
  api: 'http://127.0.0.1:3500/agent_[id]',
  body: { threadId },
  onError: (error) => console.error('Chat error:', error),
});
```

2. **Agent Response Handling**
- Use `streamText` or `streamObject` from Vercel AI SDK
- Return `results.toDataStreamResponse()` for client compatibility
- Include tool calls in the stream for UI updates

## Development Workflow

1. **Start Agent**:
   - Navigate to `restaurant-chat` folder
   - Run `agentuity dev`

2. **Start Web App**:
   - Run `npm run dev` in main directory
   - Access at `http://localhost:3000`

3. **Testing Flow**:
   - Test traditional menu navigation
   - Test chat ordering scenarios
   - Verify tool call UI updates
   - Check cart functionality

## Success Metrics
- Users can browse menu traditionally
- Chat understands natural language orders
- Minimal back-and-forth for order clarification
- Seamless cart updates from chat
- Clear order confirmation flow

## Future Enhancements (Post-Prototype)
- Real payment processing
- User authentication
- Order history
- Multi-location support
- Voice ordering capability
