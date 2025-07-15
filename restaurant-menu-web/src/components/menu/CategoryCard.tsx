"use client";

import { ChevronRight } from "lucide-react";
import { MenuCategory } from "@/types/menu";

interface CategoryCardProps {
  category: MenuCategory;
  onClick: () => void;
}

const categoryImages: Record<string, string> = {
  "Soft Drinks": "https://images.unsplash.com/photo-1581098365948-6a5a912b7a49?w=400&h=300&fit=crop",
  "Beers": "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=300&fit=crop",
  "Wines": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop",
  "Appetizers": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
  "Salads": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  "Burgers": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
  "Sandwiches": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop",
  "Wraps": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
  "Smash Burgers": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
  "Wings": "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400&h=300&fit=crop",
  "Pizza": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
  "Desserts": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
};

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="flex items-center p-4 gap-4">
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={categoryImages[category.name] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
          <p className="text-sm text-gray-500">{category.items.length} items</p>
        </div>
        <ChevronRight className="text-gray-400" size={24} />
      </div>
    </button>
  );
}