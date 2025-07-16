"use client";

import { useChat } from "ai/react";
import { X, Send, Loader2, Mic, MicOff } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { useEffect, useRef, useState } from "react";

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatInterface({ isOpen, onClose }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const loadingMessages = [
    "Checking our menu...",
    "Finding the perfect items...",
    "Preparing your options...",
    "Getting that ready for you...",
    "Looking through our kitchen...",
  ];

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "http://127.0.0.1:3500/agent_f130f43cce1e9ec5a8610574d38762e8",
      body: {
        threadId: `session-${Date.now()}`,
      },
      onError: (error) => {
        console.error("Chat error:", error);
      },
      maxSteps: 5,
    });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading, loadingMessages.length]);
  
  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
          
        handleInputChange({ target: { value: transcript } } as any);
        
        // If it's a final result, submit it
        if (event.results[event.results.length - 1].isFinal) {
          setTimeout(() => {
            handleSubmit({ preventDefault: () => {} } as any);
            setIsListening(false);
          }, 100);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [handleInputChange, handleSubmit]);
  
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-black">Chat to Order</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Hi! I can help you order food quickly. Just tell me what you'd
                  like!
                </p>
              </div>
            )}

            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onQuickOrder={(text: string) => {
                  handleInputChange({ target: { value: text } } as any);
                  setTimeout(() => {
                    handleSubmit({ preventDefault: () => {} } as any);
                  }, 200);
                }}
              />
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500 text-sm p-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="animate-pulse">
                  {loadingMessages[loadingMessageIndex]}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your order..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              disabled={isLoading}
            />
            {recognitionRef.current && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isListening 
                    ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
