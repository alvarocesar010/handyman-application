export interface Category {
  value: string;
  sizes: string[];
}

export interface InventoryItem {
  size: string;
  qty: string;
  _id?: string; // (optional but useful for your stock updates)
}

export interface StoreEntry {
  storeName: string;
  price: number | string;
  link?: string;
  inventory: InventoryItem[];
}

export interface SupplyDB {
  _id?: string;
  name: string;
  description: string;
  category: string;
  serviceSlug?: string;
  color?: string;
  itemSlug: string;
  sellingPrice: string;

  photos?: string[];
  storeEntries: StoreEntry[];
  localPreview?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface APIOptionsResponse {
  stores: string[];
  categories: Category[];
}

export interface SupplyUI {
  _id: string;
  name: string;
  description: string;
  category: string;
  color: string;

  // flattened
  price: number;
  storeName: string;
  link: string;

  photos: string[];
  createdAt: string;
}
