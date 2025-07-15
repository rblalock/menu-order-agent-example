import type { AgentContext, AgentRequest, AgentResponse } from '@agentuity/sdk';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import menuData from '../../data/menu.json';

export const welcome = () => {
  return {
    welcome: "Hi there! Welcome to Lighthouse Cove. What can I get started for you today?",
    prompts: [
      {
        data: 'What drinks do you have?',
        contentType: 'text/plain',
      },
      {
        data: 'I want a burger and fries',
        contentType: 'text/plain',
      },
      {
        data: 'What are your specials?',
        contentType: 'text/plain',
      },
    ],
  };
};

const systemPrompt = `You are a friendly waiter at Lighthouse Cove Mini Golf restaurant. Your job is to take orders naturally and efficiently.

Guidelines:
- Speak like a real waiter would - casual, friendly, and professional
- Use natural phrases like "Got it", "Sure thing", "Coming right up", "Anything else?"
- Don't over-explain or say things like "I'll help you" or "I'll add that" repeatedly
- When someone orders, confirm briefly and ask about sides/drinks naturally
- Be concise but friendly
- Remember customer modifications (like "only lettuce")
- When confirming a final order, include a table number (random 1-20) and calculate tax (7%)

Here is our full menu:
${JSON.stringify(menuData, null, 2)}`;

export default async function Agent(
  req: AgentRequest,
  resp: AgentResponse,
  ctx: AgentContext
) {
  try {
    const userMessage = await req.data.text();
    
    if (!userMessage) {
      return resp.text("What can I get for you today?");
    }

    const result = await streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      system: systemPrompt,
      prompt: userMessage,
    });

    // Return the streaming response
    return result.toDataStreamResponse();
  } catch (error) {
    ctx.logger.error('Error running agent:', error);
    return resp.text('Sorry about that. What were you looking to order?');
  }
}