"use client";

import { Message } from "ai";
import { Bot, User } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useEffect, useRef } from "react";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const { addItem } = useCart();
  const processedInvocations = useRef(new Set<string>());

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
          <Bot size={16} className="text-gray-600" />
        )}
      </div>
      <div
        className={`flex-1 px-4 py-2 rounded-lg ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        
        {message.toolInvocations && message.toolInvocations.length > 0 && (
          <div className="space-y-2 mt-2">
            {message.toolInvocations.map((toolInvocation, index) => (
              <div key={index}>
                {renderToolResult(toolInvocation)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function renderToolResult(toolInvocation: any) {
  if (!toolInvocation.result) return null;

  const { toolName, result } = toolInvocation;

  switch (toolName) {
    case "showItem":
      return (
        <div className="bg-white rounded-lg p-3 text-gray-900 border border-gray-200">
          <h4 className="font-semibold">{result.name}</h4>
          <p className="text-sm text-gray-600">${result.price.toFixed(2)}</p>
          {result.description && (
            <p className="text-sm mt-1">{result.description}</p>
          )}
          {result.category && (
            <p className="text-xs text-gray-500 mt-1">{result.category}</p>
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
        <div className="bg-blue-50 rounded-lg p-3 text-blue-800 border border-blue-200">
          <h4 className="font-semibold mb-2">Order Summary</h4>
          {result.items.map((item: any, idx: number) => (
            <div key={idx} className="text-sm flex justify-between">
              <span>{item.quantity}x {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-blue-200">
            <p className="font-semibold flex justify-between">
              <span>Total:</span>
              <span>${result.total.toFixed(2)}</span>
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
}