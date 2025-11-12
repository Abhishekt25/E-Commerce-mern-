import type { Product } from './types/product';
import { getStockBadge, formatDate } from './utils/helpers';

// ViewProductModal.tsx - Make sure this is correct
interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ViewProductModal = ({ isOpen, onClose, product }: ViewProductModalProps) => {
  if (!isOpen || !product) return null;

  const stockBadge = getStockBadge(product.stock);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div>
              {product.image ? (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${product.image}`}
                  alt={product.product}
                  className="w-full h-80 object-cover rounded-lg bg-gray-100"
                />
              ) : (
                <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-4xl text-gray-400">📦</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{product.product}</h3>
                <p className="text-sm text-gray-500 mt-1">Slug: {product.slug}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">SKU</label>
                  <p className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                    {product.sku}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Stock</label>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockBadge.class}`}>
                      {stockBadge.text} ({product.stock})
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Price</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">${product.price.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-900 mt-1 capitalize">{product.status}</p>
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-sm font-medium text-gray-700">Categories</label>
                {product.categories && product.categories.length > 0 && Array.isArray(product.categories) ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {typeof category === 'string' ? category.trim() : String(category)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">No categories</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium text-gray-700">Tags</label>
                {product.tags && product.tags.length > 0 && Array.isArray(product.tags) ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {typeof tag === 'string' ? tag.trim() : String(tag)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">No tags</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-medium text-gray-700">Date Added</label>
                <p className="text-sm text-gray-900 mt-1">{formatDate(product.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8 border-t pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Description</h4>
            
            {product.shortDescription && (
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">Short Description</label>
                <p className="text-sm text-gray-600 mt-1">{product.shortDescription}</p>
              </div>
            )}

            {product.description && (
              <div>
                <label className="text-sm font-medium text-gray-700">Full Description</label>
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {!product.shortDescription && !product.description && (
              <p className="text-sm text-gray-500">No description available</p>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;