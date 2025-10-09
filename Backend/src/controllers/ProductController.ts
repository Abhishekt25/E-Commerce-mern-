import { Request, Response } from 'express';
import { Product } from '../models/Product';
import multer from 'multer';
import path from 'path';

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { product, sku, stock, price, status, variants, marketplaces } = req.body;
    const image = req.file?.filename;

    // Convert marketplaces object to array of selected marketplaces
    const selectedMarketplaces = Object.keys(JSON.parse(marketplaces || '{}')).filter(
      (key) => JSON.parse(marketplaces)[key]
    );

    // Convert variants string to array
    const variantsArray = variants ? variants.split(',').map((v: string) => v.trim()) : [];

    const newProduct = new Product({
      product,
      sku,
      stock: Number(stock),
      price: Number(price),
      status,
      variants: variantsArray,
      marketplaces: selectedMarketplaces,
      image,
      createdAt: new Date(),
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Product saved to MongoDB', id: savedProduct._id });
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ message: 'Error saving product', error });
  }
};
