We're building a copy of a website but are going to supercharge it with a chat interface.  The point is a prototype to show off how a customer can quickly order something without a lot of fuss or clicking on a bunch of things.

The website target is: https://my.lighthousecoveminigolf.com/venues/6bad29b9-614c-4764-bf4f-967d0ae08800/menu/6e3c014e-cb98-4042-b4e6-0b78da48a6ac/

We extracted the menu in the menu.json file just so we can have something programmatic to use.

We will duplicate this exactly, with navigation, etc. The different is, the user can enter a chat mode so he can quickly just tell the app what he wants.  The AI agent will quickly figure out what the user wants, if there needs to be some customization or clarification, will clarify, in order to get what the user wants, and automatically add to cart (which we'll just prototype a cart button for now).  The goal is get the order as fast and seemless and frictionless as possible.

For the web app:
We'll just use NextJS, Tailwind, etc. The Vercel AI SDK with the Chat SDK (useChat, etc) so we can quickly wire that up.  useChat has a way to point to a custom API endpoint, which will be an Agentuity agent endpoint.  For now that will be on localhost:3500/agent_id_here .

The chat sdk docs are here: https://chat-sdk.dev/docs/getting-started/architecture

One thing to make this simple: We don't need all the complicated user tracking and auth and history like this has - we just need to track the convo for the session duration of the user ordering something (for now).  We might be able to just use the Vercel AI SDK primitives instead:
- Chat: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
- Message persistance: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-message-persistence
- Tool use: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-tool-usage
- Generative UI: https://ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces
- Object gen: https://ai-sdk.dev/docs/ai-sdk-ui/object-generation
- Structured data: https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data

The chat streaming response will include tool calls from the agent.  These will have special UI components that will be used: when a user selects an item, an item that the user is asking about (shows an image, description, price, etc)., double check order before placing (with an apple pay button), and them a final payment / order placed component.

Agentuity agent:
This will be a separate folder - restaurant-chat - where the agent lives.  It is it's own project.  Built in Bun and will likewise use the Vercel AI SDK for streaming text, etc.

Agentuity JS SDK docs are here: https://agentuity.dev/SDKs/javascript/api-reference

Run the agent by going to the restaurant-chat folder and running `agentuity dev`

The agent will have access to the menu.json as well and use it in context to the LLM call, be able to look through it and pull out info for the user, etc. (it's sort of the database if you will).

For how this works with AI SDK's useChat, here is some example code from other agents I've built:
In the agent use the streamText or streamObject, then return the results.toDataStreamResponse() method.  This will stream it back to the client, which the client useChat would look something like:

```ts
const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		isLoading,
		stop,
		setMessages,
		append,
	} = useChat({
		api: 'http://127.0.0.1:3500/agent_41560c0472cb881b00a4deae9489e659',
		body: {
			threadId,
		},
		onError: (error) => {
			console.error('Chat error:', error);
		},
		initialMessages,
	});
```
