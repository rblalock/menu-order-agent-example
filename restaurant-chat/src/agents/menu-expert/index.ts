import type { AgentContext, AgentRequest, AgentResponse } from "@agentuity/sdk";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText, tool } from "ai";
import { z } from "zod";
import menuData from "../../data/menu.json";

export const welcome = () => {
  return {
    welcome:
      "Hi there! Welcome to Lighthouse Cove. What can I get started for you today?",
    prompts: [
      {
        data: "What drinks do you have?",
        contentType: "text/plain",
      },
      {
        data: "I want a burger and fries",
        contentType: "text/plain",
      },
      {
        data: "What are your specials?",
        contentType: "text/plain",
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
- Use the showItem tool when discussing specific menu items
- Use the confirmOrder tool when finalizing orders
- Remember customer modifications (like "only lettuce")

Here is our full menu:
${JSON.stringify(menuData, null, 2)}`;

export default async function Agent(
  req: AgentRequest,
  resp: AgentResponse,
  ctx: AgentContext,
) {
  try {
    const userMessage = await req.data.text();

    if (!userMessage) {
      return resp.text("What can I get for you today?");
    }

    const result = await streamText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      system: systemPrompt,
      prompt: userMessage,
      tools: {
        showItem: tool({
          description: "Display a menu item with image and details",
          parameters: z.object({
            name: z.string().describe("Item name"),
            price: z.number().describe("Item price"),
            description: z.string().optional().describe("Item description"),
            category: z.string().describe("Menu category"),
            modifications: z
              .array(z.string())
              .optional()
              .describe("Customer requested modifications"),
          }),
          execute: async ({ name, price, description, category, modifications }) => {
            return { name, price, description, category, modifications };
          },
        }),

        confirmOrder: tool({
          description: "Show order confirmation with payment options",
          parameters: z.object({
            items: z.array(
              z.object({
                name: z.string(),
                price: z.number(),
                quantity: z.number().default(1),
                modifications: z.array(z.string()).optional(),
              }),
            ),
            subtotal: z.number(),
            tax: z.number(),
            total: z.number(),
            tableNumber: z.number().default(Math.floor(Math.random() * 20) + 1),
          }),
          execute: async ({ items, subtotal, tax, total, tableNumber }) => {
            return { items, subtotal, tax, total, tableNumber };
          },
        }),

        addToCart: tool({
          description: "Add item to cart (internal use)",
          parameters: z.object({
            name: z.string(),
            price: z.number(),
            quantity: z.number().default(1),
            modifications: z.array(z.string()).optional(),
          }),
          execute: async ({ name, price, quantity, modifications }) => {
            return { name, price, quantity, modifications };
          },
        }),
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    ctx.logger.error("Error running agent:", error);
    return resp.text("Sorry about that. What were you looking to order?");
  }
}
