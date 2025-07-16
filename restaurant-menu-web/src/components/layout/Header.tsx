"use client";

import { ShoppingCart, MessageSquare } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface HeaderProps {
  onChatToggle: () => void;
  onCartToggle: () => void;
}

export default function Header({ onChatToggle, onCartToggle }: HeaderProps) {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Lighthouse Cove</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onChatToggle}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#1a472a] rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MessageSquare size={20} />
              <span className="hidden sm:inline text-black">Chat to Order</span>
            </button>

            <button
              onClick={onCartToggle}
              className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
