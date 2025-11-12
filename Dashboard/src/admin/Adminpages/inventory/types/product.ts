export interface Product {
  _id: string;
  product: string;
  slug: string;
  sku: string;
  stock: number;
  price: number;
  status: string;
  categories: string[];
  description: string;
  shortDescription: string;
  tags: string[];
  image?: string;
  createdAt: string;
}

export interface ProductFormData {
  product: string;
  slug: string;
  sku: string;
  stock: number;
  price: number;
  categories: string;
  description: string;
  shortDescription: string;
  tags: string;
  image: File | null;
}