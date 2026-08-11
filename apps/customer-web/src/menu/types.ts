export type MenuCategory = "Main" | "Starters" | "Grill" | "Sides" | "Drinks";

export type MenuItem = {
  id: string;
  category: MenuCategory;
  name: string;
  price: number;
  description: string;
  image: string;
  tag?: string;
  customizations?: CustomizationGroup[];
};

export type CustomizationGroup = {
  name: string;
  required?: boolean;
  options: string[];
};

export type CartItem = {
  id: string;
  item: MenuItem;
  selections: string[];
  quantity: number;
};

export type PastOrder = {
  id: string;
  createdAt: string;
  status: "Preparing" | "Served";
  items: CartItem[];
  total: number;
};
