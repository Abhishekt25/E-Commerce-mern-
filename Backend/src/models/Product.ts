import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  product: string;
  sku: string;
  stock: number;
  price: number;
  status: string;
  variants: string[];
  marketplaces: string[];
  image?: string;
  createdAt: Date;
}

const productSchema: Schema = new Schema<IProduct>({
  product: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, required: true },
  variants: { type: [String], default: [] },
  marketplaces: { type: [String], default: [] },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
