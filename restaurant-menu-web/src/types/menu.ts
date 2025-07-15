export interface MenuItem {
  name: string;
  price: number;
  description?: string;
  subcategory?: string;
  image?: string;
  original_price?: number;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
  image?: string;
}

export interface Menu {
  categories: MenuCategory[];
}

export interface CartItem extends MenuItem {
  id: string;
  quantity: number;
  specialInstructions?: string;
}