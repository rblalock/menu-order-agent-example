import type { AgentContext, AgentRequest, AgentResponse } from '@agentuity/sdk';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { z } from 'zod';
import menuData from '../../data/menu.json';

export const welcome = () => {
  return {
    welcome: "Hi! I'm here to help you order from Lighthouse Cove Mini Golf. Just tell me what you'd like!",
    prompts: [
      {
        data: 'Show me your soft drinks',
        contentType: 'text/plain',
      },
      {
        data: 'I want a burger and fries',
        contentType: 'text/plain',
      },
      {
        data: 'What desserts do you have?',
        contentType: 'text/plain',
      },
    ],
  };
};

const systemPrompt = `You are a helpful restaurant ordering assistant for Lighthouse Cove Mini Golf. 
You have access to the full menu and can help customers:
- Browse menu items and categories
- Get details about specific items including prices
- Add items to their cart
- Answer questions about the menu
- Confirm orders

Be friendly, concise, and helpful. When customers express interest in items, proactively suggest adding them to the cart.
Always confirm quantities when adding items.

Here is the full menu:
${JSON.stringify(menuData, null, 2)}`;

export default async function Agent(
  req: AgentRequest,
  resp: AgentResponse,
  ctx: AgentContext
) {
  try {
    const userMessage = await req.data.text();
    
    if (!userMessage) {
      return resp.text("I didn't receive a message. How can I help you order today?");
    }

    const result = await streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      system: systemPrompt,
      prompt: userMessage,
    });

    // Return the streaming response
    const stream = result.toDataStreamResponse();
    
    // Set appropriate headers
    resp.headers.set('Content-Type', 'text/event-stream');
    resp.headers.set('Cache-Control', 'no-cache');
    resp.headers.set('Connection', 'keep-alive');
    
    return stream;
  } catch (error) {
    ctx.logger.error('Error running agent:', error);
    return resp.text('Sorry, there was an error processing your request. Please try again.');
  }
}