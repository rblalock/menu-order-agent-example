import type { AgentContext, AgentRequest, AgentResponse } from '@agentuity/sdk';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
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

Menu data is available in the menuData variable.`;

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
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
      tools: {
        showItem: tool({
          description: 'Show details about a menu item',
          parameters: z.object({
            name: z.string().describe('The name of the menu item'),
            price: z.number().describe('The price of the item'),
            description: z.string().optional().describe('Description of the item'),
            category: z.string().optional().describe('The category the item belongs to'),
          }),
          execute: async ({ name, price, description, category }) => {
            return { name, price, description, category };
          },
        }),
        
        addToCart: tool({
          description: 'Add an item to the customer\'s cart',
          parameters: z.object({
            name: z.string().describe('The name of the menu item'),
            price: z.number().describe('The price per item'),
            quantity: z.number().min(1).describe('Quantity to add'),
          }),
          execute: async ({ name, price, quantity }) => {
            return { 
              name, 
              price, 
              quantity,
              message: `Added ${quantity}x ${name} to your cart` 
            };
          },
        }),
        
        searchMenu: tool({
          description: 'Search for items in the menu by category or keyword',
          parameters: z.object({
            query: z.string().describe('Search query or category name'),
          }),
          execute: async ({ query }) => {
            const lowerQuery = query.toLowerCase();
            const results = [];
            
            // Search by category
            const category = menuData.categories.find(
              cat => cat.name.toLowerCase().includes(lowerQuery)
            );
            
            if (category) {
              return {
                category: category.name,
                items: category.items.map(item => ({
                  name: item.name,
                  price: item.price,
                  subcategory: item.subcategory,
                })),
              };
            }
            
            // Search by item name
            menuData.categories.forEach(cat => {
              cat.items.forEach(item => {
                if (item.name.toLowerCase().includes(lowerQuery)) {
                  results.push({
                    name: item.name,
                    price: item.price,
                    category: cat.name,
                    subcategory: item.subcategory,
                  });
                }
              });
            });
            
            return { results };
          },
        }),
        
        confirmOrder: tool({
          description: 'Show order confirmation summary',
          parameters: z.object({
            items: z.array(z.object({
              name: z.string(),
              price: z.number(),
              quantity: z.number(),
            })),
            total: z.number().describe('Total price of the order'),
          }),
          execute: async ({ items, total }) => {
            return { items, total };
          },
        }),
      },
      toolChoice: 'auto',
    });

    return result.toDataStreamResponse();
  } catch (error) {
    ctx.logger.error('Error running agent:', error);
    return resp.text('Sorry, there was an error processing your request. Please try again.');
  }
}