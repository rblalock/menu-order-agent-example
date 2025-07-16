"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import CategoryCard from "./CategoryCard";
import menuData from "@/data/menu.json";
import { getItemImage } from "@/utils/itemImages";

export default function MenuView() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const currentCategory = selectedCategory
    ? menuData.categories.find((cat) => cat.name === selectedCategory)
    : null;

  if (selectedCategory && currentCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-40 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center h-14">
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <ChevronLeft size={20} />
                <span>Back to Menu</span>
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold text-black mb-6">
            {selectedCategory}
          </h2>

          {/* Group items by subcategory if they exist */}
          {(() => {
            const subcategories = [
              ...new Set(
                currentCategory.items
                  .map((item) => (item as any).subcategory)
                  .filter(Boolean),
              ),
            ];

            if (subcategories.length > 0) {
              return subcategories.map((subcategory) => (
                <div key={subcategory} className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    {subcategory}
                  </h3>
                  <div className="space-y-4">
                    {currentCategory.items
                      .filter(
                        (item) => (item as any).subcategory === subcategory,
                      )
                      .map((item, index) => (
                        <MenuItemCard
                          key={`${item.name}-${index}`}
                          item={item}
                          category={selectedCategory}
                        />
                      ))}
                  </div>
                </div>
              ));
            }

            return (
              <div className="space-y-4">
                {currentCategory.items.map((item, index) => (
                  <MenuItemCard
                    key={`${item.name}-${index}`}
                    item={item}
                    category={selectedCategory}
                  />
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Menu</h1>
        <div className="space-y-4 max-w-2xl mx-auto">
          {menuData.categories.map((category) => (
            <CategoryCard
              key={category.name}
              category={category}
              onClick={() => setSelectedCategory(category.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuItemCard({
  item,
  category,
}: {
  item: any;
  category: string | null;
}) {
  const { addItem } = useCart();
  const imageUrl = getItemImage(item.name, category || undefined);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{item.name}</h4>
          {item.description && (
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-lg font-semibold text-green-600">
                ${item.price.toFixed(2)}
              </span>
              {item.original_price && (
                <span className="text-sm text-gray-400 line-through ml-2">
                  ${item.original_price.toFixed(2)}
                </span>
              )}
            </div>
            <button
              onClick={() => addItem(item)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
