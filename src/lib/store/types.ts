export type Supply = {
  _id: string;
  name: string;
  description: string;
  category: string;
  serviceSlug: string;
  photos: string[];
  storeEntries: {
    storeName: string;
    link: string;
    price: number;
    inventory: {
      size: string;
      qty: number;
      _id: string;
    }[];
  }[];
};