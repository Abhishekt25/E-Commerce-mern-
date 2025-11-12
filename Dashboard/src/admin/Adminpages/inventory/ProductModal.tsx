import { useState, useEffect } from 'react';
import type { Product, ProductFormData } from './types/product';
import { generateSlug } from './utils/helpers'; // Fixed import path

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ProductFormData) => void;
  product?: Product | null;
  mode: 'add' | 'edit';
}

const ProductModal = ({ isOpen, onClose, onSubmit, product, mode }: ProductModalProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    product: '',
    slug: '',
    sku: '',
    stock: 0,
    price: 0,
    categories: '',
    description: '',
    shortDescription: '',
    tags: '',
    image: null,
  });

  // Fix for slug generation - generate full slug from product name
  useEffect(() => {
    if (formData.product && mode === 'add') {
      const fullSlug = generateSlug(formData.product);
      setFormData(prev => ({ ...prev, slug: fullSlug }));
    }
  }, [formData.product, mode]);

  // Initialize form when editing or reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        product: '',
        slug: '',
        sku: '',
        stock: 0,
        price: 0,
        categories: '',
        description: '',
        shortDescription: '',
        tags: '',
        image: null,
      });
    } else if (mode === 'edit' && product) {
      // Initialize form for editing
      setFormData({
        product: product.product,
        slug: product.slug,
        sku: product.sku,
        stock: product.stock,
        price: product.price,
        categories: product.categories.join(", "),
        description: product.description,
        shortDescription: product.shortDescription,
        tags: product.tags.join(", "),
        image: null,
      });
    } else if (mode === 'add') {
      // Initialize form for adding (ensure clean state)
      setFormData({
        product: '',
        slug: '',
        sku: '',
        stock: 0,
        price: 0,
        categories: '',
        description: '',
        shortDescription: '',
        tags: '',
        image: null,
      });
    }
  }, [isOpen, mode, product]); // Added isOpen to dependencies

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Reset file input when form resets
  const handleFileInputReset = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Handle modal close with reset
  const handleClose = () => {
    setFormData({
      product: '',
      slug: '',
      sku: '',
      stock: 0,
      price: 0,
      categories: '',
      description: '',
      shortDescription: '',
      tags: '',
      image: null,
    });
    handleFileInputReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {mode === 'add' ? 'Add New Product' : 'Edit Product'}
            </h2>
            <button
              onClick={handleClose} // Use handleClose instead of onClose
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter product name"
                  value={formData.product}
                  onChange={(e) => setFormData({...formData, product: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Auto-generated slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {mode === 'add' ? 'Slug will be auto-generated from product name' : 'You can customize the slug'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter SKU"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="Enter stock quantity"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categories
                </label>
                <input
                  type="text"
                  placeholder="Enter categories (comma separated)"
                  value={formData.categories}
                  onChange={(e) => setFormData({...formData, categories: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple categories with commas</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <textarea
                placeholder="Enter a brief description (max 200 characters)"
                value={formData.shortDescription}
                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                rows={3}
                maxLength={200}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.shortDescription.length}/200 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Description
              </label>
              <textarea
                placeholder="Enter full product description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={5}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                placeholder="Enter tags (comma separated)"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, image: e.target.files?.[0] || null})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {mode === 'edit' && product?.image && (
                <p className="text-xs text-gray-500 mt-1">
                  Current image: {product.image}
                </p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose} // Use handleClose instead of onClose
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {mode === 'add' ? 'Add Product' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;