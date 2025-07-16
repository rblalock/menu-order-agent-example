import type { AgentContext, AgentRequest, AgentResponse } from "@agentuity/sdk";
import { openai } from "@ai-sdk/openai";
import { streamText, jsonSchema, tool } from "ai";
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
- Remember customer modifications (like "only lettuce")
- When confirming a final order, include a table number (random 1-20) and calculate tax (7%)

Tool Usage Guidelines:
- When showing menu categories (like desserts, drinks, etc), use the showCategory tool to display items visually
- When showing specific items someone ordered, use the showItem tool
- When adding items to cart, use the addToCart tool
- For final order confirmation, use the confirmOrder tool
- Always prefer using tools over just describing items in text

Here is our full menu:
${JSON.stringify(menuData, null, 2)}`;

// Define tools with jsonSchema and execute functions
const tools = {
  showItem: tool({
    description: "Display a menu item with image and details",
    parameters: jsonSchema<{
      name: string;
      price: number;
      description?: string;
      modifications?: string[];
    }>({
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the menu item",
        },
        price: {
          type: "number",
          description: "The price of the item",
        },
        description: {
          type: "string",
          description: "Description of the item",
          default: "",
        },
        modifications: {
          type: "array",
          items: { type: "string" },
          description: "Any modifications requested",
          default: [],
        },
      },
      required: ["name", "price"],
      additionalProperties: false,
    }),
    execute: async ({ name, price, description, modifications }) => {
      return {
        name,
        price,
        description: description || "",
        modifications: modifications || [],
      };
    },
  }),

  addToCart: tool({
    description: "Add an item to the customer's cart",
    parameters: jsonSchema<{
      name: string;
      price: number;
      quantity: number;
    }>({
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the menu item",
        },
        price: {
          type: "number",
          description: "The price of the item",
        },
        quantity: {
          type: "number",
          description: "How many to add",
        },
      },
      required: ["name", "price", "quantity"],
      additionalProperties: false,
    }),
    execute: async ({ name, price, quantity }) => {
      return {
        name,
        price,
        quantity,
      };
    },
  }),

  showCategory: tool({
    description: "Display menu items from a specific category",
    parameters: jsonSchema<{
      category: string;
      items: Array<{
        name: string;
        price: number;
        description?: string;
      }>;
    }>({
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "The category name",
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              price: { type: "number" },
              description: { type: "string", default: "" },
            },
            required: ["name", "price"],
            additionalProperties: false,
          },
        },
      },
      required: ["category", "items"],
      additionalProperties: false,
    }),
    execute: async ({ category, items }) => {
      return {
        category,
        items: items.map((item) => ({
          ...item,
          description: item.description || "",
        })),
      };
    },
  }),

  confirmOrder: tool({
    description: "Show order confirmation with payment options",
    parameters: jsonSchema<{
      items: Array<{
        name: string;
        price: number;
        quantity: number;
        modifications?: string[];
      }>;
      tableNumber: number;
      subtotal: number;
      tax: number;
      total: number;
    }>({
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              price: { type: "number" },
              quantity: { type: "number" },
              modifications: {
                type: "array",
                items: { type: "string" },
                default: [],
              },
            },
            required: ["name", "price", "quantity"],
            additionalProperties: false,
          },
        },
        tableNumber: {
          type: "number",
          description: "Table number for the order",
        },
        subtotal: {
          type: "number",
          description: "Subtotal before tax",
        },
        tax: {
          type: "number",
          description: "Tax amount",
        },
        total: {
          type: "number",
          description: "Total including tax",
        },
      },
      required: ["items", "tableNumber", "subtotal", "tax", "total"],
      additionalProperties: false,
    }),
    execute: async ({ items, tableNumber, subtotal, tax, total }) => {
      return {
        items: items.map((item) => ({
          ...item,
          modifications: item.modifications || [],
        })),
        tableNumber,
        subtotal,
        tax,
        total,
      };
    },
  }),
};

export default async function Agent(
  req: AgentRequest,
  resp: AgentResponse,
  ctx: AgentContext,
) {
  try {
    // Handle JSON request from useChat
    const body = (await req.data.json()) as { messages?: any[] };
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return resp.text("What can I get for you today?");
    }

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages,
      tools,
      maxSteps: 5,
    });

    // Return the streaming response
    return result.toDataStreamResponse();
  } catch (error) {
    ctx.logger.error("Error running agent:", error);
    return resp.text("Sorry about that. What were you looking to order?");
  }
}
