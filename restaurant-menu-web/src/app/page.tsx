"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import MenuView from "@/components/menu/MenuView";
import CartDrawer from "@/components/cart/CartDrawer";
import ChatInterface from "@/components/chat/ChatInterface";
import { CartProvider } from "@/hooks/useCart";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Header
          onChatToggle={() => setIsChatOpen(true)}
          onCartToggle={() => setIsCartOpen(true)}
        />
        
        <main>
          <MenuView />
        </main>

        <ChatInterface
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </div>
    </CartProvider>
  );
}