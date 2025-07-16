"use client";

import { Message } from "ai";
import { Palmtree, User } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
  onQuickOrder?: (text: string) => void;
}

export default function ChatMessage({ message, onQuickOrder }: ChatMessageProps) {
  const isUser = message.role === "user";
  const { addItem } = useCart();
  const processedInvocations = useRef(new Set<string>());
  
  // Check if we have tool invocations that should replace text content
  const hasDisplayTools = message.toolInvocations?.some((inv: any) => 
    ['showCategory', 'showItem', 'confirmOrder'].includes(inv.toolName)
  );

  // Handle addToCart tool invocations
  useEffect(() => {
    if (message.toolInvocations) {
      message.toolInvocations.forEach((invocation: any) => {
        const invocationKey = `${message.id}-${invocation.toolName}-${JSON.stringify(invocation.args)}`;
        
        if (invocation.toolName === 'addToCart' && 
            invocation.result && 
            !processedInvocations.current.has(invocationKey)) {
          const { name, price, quantity } = invocation.result;
          // Add to actual cart
          addItem({ name, price }, quantity);
          processedInvocations.current.add(invocationKey);
        }
      });
    }
  }, [message.toolInvocations, message.id, addItem]);

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        {isUser ? (
          <User size={16} className="text-white" />
        ) : (
          <Palmtree size={16} className="text-gray-600" />
        )}
      </div>
      <div
        className={`flex-1 px-4 py-2 rounded-lg ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        {/* Only show text content if it's user message or if there are no display tools */}
        {(isUser || !hasDisplayTools) && message.content && (
          <div className={`prose prose-sm max-w-none ${isUser ? "prose-invert" : ""}`}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        
        {/* Show brief intro text if we have display tools and the message is short */}
        {!isUser && hasDisplayTools && message.content && message.content.length < 100 && (
          <p className="text-sm mb-2">{message.content}</p>
        )}
        
        {/* Add Order button if agent is asking for confirmation */}
        {!isUser && message.content && 
         (message.content.toLowerCase().includes("shall i go ahead") || 
          message.content.toLowerCase().includes("confirm your order")) && 
         onQuickOrder && (
          <button
            onClick={() => onQuickOrder("Yes, confirm my order")}
            className="mt-3 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Confirm Order
          </button>
        )}
        
        {message.toolInvocations && message.toolInvocations.length > 0 && (
          <div className="space-y-2 mt-2">
            {message.toolInvocations.map((toolInvocation, index) => (
              <ToolResult key={index} toolInvocation={toolInvocation} onQuickOrder={onQuickOrder} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ToolResult({ toolInvocation, onQuickOrder }: { toolInvocation: any; onQuickOrder?: (text: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  
  if (!toolInvocation.result) return null;

  const { toolName, result } = toolInvocation;

  switch (toolName) {
    case "showItem":
      return (
        <div 
          className="bg-white rounded-lg overflow-hidden border border-gray-200 cursor-pointer transition-all"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <div className="p-4">
                <h4 className="font-semibold text-lg">{result.name}</h4>
                <p className="text-xl font-bold text-green-600 mt-1">${result.price.toFixed(2)}</p>
                {result.description && (
                  <p className="text-sm text-gray-600 mt-2">{result.description}</p>
                )}
                {result.modifications && result.modifications.length > 0 && (
                  <div className="mt-2 text-sm text-blue-600">
                    <p className="font-medium">Modifications:</p>
                    <ul className="list-disc list-inside">
                      {result.modifications.map((mod: string, idx: number) => (
                        <li key={idx}>{mod}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {onQuickOrder && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickOrder(`I want the ${result.name}${result.modifications && result.modifications.length > 0 ? ' with ' + result.modifications.join(', ') : ''}`);
                    }}
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors w-full"
                  >
                    I want this
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="p-3 flex justify-between items-center">
              <span className="font-medium">{result.name}</span>
              <span className="text-green-600 font-bold">${result.price.toFixed(2)}</span>
            </div>
          )}
        </div>
      );

    case "showCategory":
      return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div 
            className="bg-gray-100 p-3 font-semibold cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex justify-between items-center">
              <span>{result.category}</span>
              <span className="text-sm text-gray-500">{isExpanded ? "▼" : "▶"}</span>
            </div>
          </div>
          {isExpanded && (
            <div className="p-3 space-y-2">
              {result.items.map((item: any, idx: number) => {
                const isItemExpanded = expandedItems.has(idx);
                
                return (
                  <div key={idx} className="border-b last:border-0">
                    <div 
                      className="flex justify-between items-start py-2 cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        const newExpanded = new Set(expandedItems);
                        if (isItemExpanded) {
                          newExpanded.delete(idx);
                        } else {
                          newExpanded.add(idx);
                        }
                        setExpandedItems(newExpanded);
                      }}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        {!isItemExpanded && item.description && (
                          <div className="text-sm text-gray-600 mt-1 line-clamp-1">{item.description}</div>
                        )}
                      </div>
                      <div className="text-green-600 font-bold ml-4">${item.price.toFixed(2)}</div>
                    </div>
                    
                    {isItemExpanded && (
                      <div className="px-2 pb-3">
                        {item.description && (
                          <div className="text-sm text-gray-600 mb-3">{item.description}</div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onQuickOrder) {
                              onQuickOrder(`I want the ${item.name}`);
                            }
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          I want this
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );

    case "addToCart":
      return (
        <div className="bg-green-50 rounded-lg p-3 text-green-800 border border-green-200">
          <p className="text-sm font-medium">
            ✓ Added {result.quantity}x {result.name} to cart
          </p>
        </div>
      );

    case "searchMenu":
      if (result.category && result.items) {
        return (
          <div className="bg-white rounded-lg p-3 text-gray-900 border border-gray-200">
            <h4 className="font-semibold mb-2">{result.category}</h4>
            <div className="space-y-1">
              {result.items.map((item: any, idx: number) => (
                <div key={idx} className="text-sm flex justify-between">
                  <span>{item.name}</span>
                  <span className="text-green-600">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      } else if (result.results) {
        return (
          <div className="bg-white rounded-lg p-3 text-gray-900 border border-gray-200">
            <h4 className="font-semibold mb-2">Search Results</h4>
            <div className="space-y-1">
              {result.results.map((item: any, idx: number) => (
                <div key={idx} className="text-sm">
                  <div className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="text-green-600">${item.price.toFixed(2)}</span>
                  </div>
                  <span className="text-xs text-gray-500">{item.category}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }
      return null;

    case "confirmOrder":
      return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-100 p-4 text-center">
            <h4 className="font-bold text-lg">Order Confirmation</h4>
            <p className="text-sm text-gray-600 mt-1">Table #{result.tableNumber}</p>
          </div>
          
          <div className="p-4 space-y-3">
            {result.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm">
                <div className="flex-1">
                  <span className="font-medium">{item.quantity}x {item.name}</span>
                  {item.modifications && item.modifications.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {item.modifications.join(", ")}
                    </div>
                  )}
                </div>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${result.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${result.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>${result.total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="pt-4 space-y-3">
              <button className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                <svg className="w-12 h-5" viewBox="0 0 165.52 69.65">
                  <path fill="white" d="M150.7 0h-135.9c-2.04 0-3.96.39-5.74 1.17s-3.33 1.89-4.64 3.23c-1.31 1.31-2.34 2.86-3.12 4.64s-1.16 3.66-1.16 5.66v40.2c0 2.04.39 3.96 1.16 5.74s1.81 3.33 3.12 4.64c1.31 1.35 2.86 2.38 4.64 3.16s3.7 1.17 5.74 1.17h135.9c2.04 0 3.96-.39 5.74-1.17s3.33-1.81 4.64-3.16c1.35-1.31 2.38-2.86 3.16-4.64s1.17-3.7 1.17-5.74v-40.2c0-2-.39-3.88-1.17-5.66s-1.81-3.33-3.16-4.64c-1.31-1.34-2.86-2.45-4.64-3.23s-3.7-1.17-5.74-1.17zm-109.3 44.51c0-2.94.65-5.51 1.92-7.68s2.96-3.88 5.08-5.12c2.08-1.2 4.37-1.81 6.86-1.81s4.78.6 6.86 1.81c2.12 1.24 3.81 2.94 5.08 5.12s1.92 4.74 1.92 7.68-.65 5.51-1.92 7.68-2.96 3.88-5.08 5.12c-2.08 1.2-4.37 1.81-6.86 1.81s-4.78-.6-6.86-1.81c-2.12-1.24-3.81-2.94-5.08-5.12s-1.92-4.74-1.92-7.68zm30.25 0c0-2.94.65-5.51 1.92-7.68s2.96-3.88 5.08-5.12c2.08-1.2 4.37-1.81 6.86-1.81s4.78.6 6.86 1.81c2.12 1.24 3.81 2.94 5.08 5.12s1.92 4.74 1.92 7.68-.65 5.51-1.92 7.68-2.96 3.88-5.08 5.12c-2.08 1.2-4.37 1.81-6.86 1.81s-4.78-.6-6.86-1.81c-2.12-1.24-3.81-2.94-5.08-5.12s-1.92-4.74-1.92-7.68z"/>
                </svg>
                Apple Pay
              </button>
              
              <button className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                <svg className="w-6 h-4" viewBox="0 0 24 16">
                  <rect width="24" height="16" rx="2" fill="#1434CB"/>
                  <rect x="16" y="11" width="5" height="3" fill="#FF6B00"/>
                </svg>
                Credit Card
              </button>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}