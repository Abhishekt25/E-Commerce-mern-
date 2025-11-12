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
    const { product,slug,sku,stock,price,status,categories,description,shortDescription,tags,variants,marketplaces, } = req.body;

    const image = req.file?.filename;

    // Parse arrays from JSON strings if necessary
    const categoriesArray = categories ? JSON.parse(categories) : [];
    const tagsArray = tags ? JSON.parse(tags) : [];

    const selectedMarketplaces = marketplaces
      ? Object.keys(JSON.parse(marketplaces)).filter((key) => JSON.parse(marketplaces)[key])
      : [];

    const variantsArray = variants ? variants.split(',').map((v: string) => v.trim()) : [];

    const newProduct = new Product({
      product,
      slug,
      sku,
      stock: Number(stock),
      price: Number(price),
      status,
      categories: categoriesArray,
      description,
      shortDescription,
      tags: tagsArray,
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

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { product,slug,sku,stock,price,status,categories,description,shortDescription,tags,variants,marketplaces,} = req.body;

    // Handle image (optional)
    const image = req.file?.filename;

    // Parse stringified arrays
    const categoriesArray = categories ? JSON.parse(categories) : [];
    const tagsArray = tags ? JSON.parse(tags) : [];
    const selectedMarketplaces = marketplaces
      ? Object.keys(JSON.parse(marketplaces)).filter((key) => JSON.parse(marketplaces)[key])
      : [];
    const variantsArray = variants ? variants.split(',').map((v: string) => v.trim()) : [];

    // Find and update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        product,
        slug,
        sku,
        stock: Number(stock),
        price: Number(price),
        status,
        categories: categoriesArray,
        description,
        shortDescription,
        tags: tagsArray,
        variants: variantsArray,
        marketplaces: selectedMarketplaces,
        ...(image && { image }), // only update image if a new one is uploaded
      },
      { new: true } // return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product", error });
  }
};
