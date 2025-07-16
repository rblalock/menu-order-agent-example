"use client";

import { ChevronRight } from "lucide-react";
import { MenuCategory } from "@/types/menu";

interface CategoryCardProps {
  category: MenuCategory;
  onClick: () => void;
}

// Use placeholder for all category images
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Category";

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="flex items-center p-4 gap-4">
        <div className="flex-1 text-left">
          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
          <p className="text-sm text-gray-500">{category.items.length} items</p>
        </div>
        <ChevronRight className="text-gray-400" size={24} />
      </div>
    </button>
  );
}