import type { Product } from './types/product';
import { getStockBadge, formatDate } from './utils/helpers';

interface ProductTableProps {
  products: Product[];
  selectedProducts: string[];
  onToggleSelect: (productId: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onView: (product: Product) => void;
}

const ProductTable = ({
  products,
  selectedProducts,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  onView,
}: ProductTableProps) => {
  const allSelected = products.length > 0 && selectedProducts.length === products.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categories
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Added
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">No products found</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const stockBadge = getStockBadge(product.stock);
                const isSelected = selectedProducts.includes(product._id);
                
                return (
                  <tr 
                    key={product._id}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={isSelected}
                        onChange={() => onToggleSelect(product._id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {product.image ? (
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${product.image}`}
                            alt={product.product}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-500">📦</span>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.product}
                          </p>
                          {/* Fixed: Removed the slash and show slug properly */}
                          <p className="text-xs text-gray-500 truncate">
                            Slug: {product.slug}
                          </p>
                          {product.shortDescription && (
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {product.shortDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockBadge.class}`}>
                        {stockBadge.text}
                        {product.stock > 0 && ` (${product.stock})`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {/* Fixed: Check if categories exist and display them */}
                      {product.categories && product.categories.length > 0 && Array.isArray(product.categories) ? (
                        <div className="flex flex-wrap gap-1">
                          {product.categories.slice(0, 3).map((category, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {category.trim()}
                            </span>
                          ))}
                          {product.categories.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                              +{product.categories.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">No categories</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {formatDate(product.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onView(product)}
                          className="text-green-600 hover:text-green-900 transition-colors duration-200"
                          title="View product"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onEdit(product)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          title="Edit product"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(product._id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          title="Delete product"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;