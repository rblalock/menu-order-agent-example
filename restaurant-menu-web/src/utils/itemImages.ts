// Mapping of menu item names to image URLs
export const itemImages: Record<string, string> = {
  // Smash Burgers
  "The Shack Smash": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
  "Pepperjack-A-Reno Smash": "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop",
  "The Jersey Smash": "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
  "The Cove Smash": "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop",
  "The Chunker Smash": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop",
  "The Black-N-Blue Smash": "https://images.unsplash.com/photo-1608767221051-2b9d18f35a2f?w=400&h=300&fit=crop",
  
  // Default burger image
  "default-burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
  
  // Other categories
  "default-sandwich": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop",
  "default-appetizer": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
  "default-salad": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  "default-wrap": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
  "default-wings": "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400&h=300&fit=crop",
  "default-pizza": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
  "default-dessert": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
};

export function getItemImage(itemName: string, category?: string): string {
  // Check if we have a specific image for this item
  if (itemImages[itemName]) {
    return itemImages[itemName];
  }
  
  // Return category default image
  if (category) {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('burger')) return itemImages['default-burger'];
    if (categoryLower.includes('sandwich')) return itemImages['default-sandwich'];
    if (categoryLower.includes('appetizer')) return itemImages['default-appetizer'];
    if (categoryLower.includes('salad')) return itemImages['default-salad'];
    if (categoryLower.includes('wrap')) return itemImages['default-wrap'];
    if (categoryLower.includes('wing')) return itemImages['default-wings'];
    if (categoryLower.includes('pizza')) return itemImages['default-pizza'];
    if (categoryLower.includes('dessert')) return itemImages['default-dessert'];
  }
  
  // Default food image
  return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop";
}