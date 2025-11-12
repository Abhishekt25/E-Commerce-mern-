import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  product: string;
  slug: string;
  sku: string;
  stock: number;
  price: number;
  categories: string[];
  description: string;
  shortDescription: string;
  tags: string[];
  status: string;
  variants?: string[];
  marketplaces?: string[];
  image?: string;
  createdAt: Date;
}

const productSchema: Schema = new Schema<IProduct>({
  product: { type: String, required: true },
  slug: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  categories: { type: [String], default: [] },
  description: { type: String },
  shortDescription: { type: String },
  tags: { type: [String], default: [] },
  status: { type: String, required: true },
  variants: { type: [String], default: [] },
  marketplaces: { type: [String], default: [] },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
