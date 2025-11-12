import { useEffect, useState } from "react";
import type { Product, ProductFormData } from "./types/product";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import BulkActions from "./BulkActions";
import Filters from "./Filters";
import ProductModal from "./ProductModal";
import ProductTable from "./ProductTable";
import Pagination from "./Pagination";
import ViewProductModal from "./ViewProductModal";

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // View modal states
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/api/products`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Product[] = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err: unknown) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  // Filter products based on search term and stock filter
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStock = stockFilter === "all" ||
                        (stockFilter === "in_stock" && product.stock > 0) ||
                        (stockFilter === "out_of_stock" && product.stock === 0) ||
                        (stockFilter === "low_stock" && product.stock > 0 && product.stock < 10);

    return matchesSearch && matchesStock;
  });

  // Pagination calculations
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, stockFilter]);

  const toggleProductSelection = (productId: string): void => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = (): void => {
    const currentPageProductIds = currentProducts.map(p => p._id);
    setSelectedProducts(
      selectedProducts.length === currentPageProductIds.length
        ? []
        : currentPageProductIds
    );
  };

  // Pagination functions
  const goToPage = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = (): void => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // View handler function
  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  // Handle Add/Edit Product
  const handleProductSubmit = async (formData: ProductFormData) => {
    // Convert comma-separated strings to arrays and trim whitespace
    const categoriesArray = formData.categories
      .split(',')
      .map(cat => cat.trim())
      .filter(cat => cat.length > 0);
    
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const apiData = new FormData();
    apiData.append('product', formData.product);
    apiData.append('slug', formData.slug);
    apiData.append('sku', formData.sku);
    apiData.append('stock', formData.stock.toString());
    apiData.append('price', formData.price.toString());
    apiData.append('categories', JSON.stringify(categoriesArray));
    apiData.append('description', formData.description);
    apiData.append('shortDescription', formData.shortDescription);
    apiData.append('tags', JSON.stringify(tagsArray));
    apiData.append('status', 'active');
    
    if (formData.image) {
      apiData.append('image', formData.image);
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const url = modalMode === 'add' 
        ? `${API_BASE_URL}/api/products`
        : `${API_BASE_URL}/api/products/${editingProduct!._id}`;
      
      const method = modalMode === 'add' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        body: apiData,
      });

      if (response.ok) {
        await fetchProducts();
        closeModal();
      } else {
        throw new Error(`Failed to ${modalMode} product`);
      }
    } catch (error) {
      console.error(`Error ${modalMode}ing product:`, error);
      alert(`Error ${modalMode}ing product. Please try again.`);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProducts();
        setSelectedProducts(prev => prev.filter(id => id !== productId));
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  // Bulk Actions
  const handleBulkAction = async (action: string) => {
    if (action === "trash" && selectedProducts.length > 0) {
      if (confirm(`Move ${selectedProducts.length} product(s) to trash?`)) {
        try {
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
          
          await Promise.all(
            selectedProducts.map(productId =>
              fetch(`${API_BASE_URL}/api/products/${productId}`, {
                method: 'DELETE',
              })
            )
          );
          
          await fetchProducts();
          setSelectedProducts([]);
        } catch (error) {
          console.error('Error deleting products:', error);
          alert('Error deleting products. Please try again.');
        }
      }
    }
  };

  // Modal handlers
  const openAddModal = () => {
    setModalMode('add');
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setModalMode('edit');
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} products
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Add Product
        </button>
      </div>

      {/* Filters and Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <BulkActions 
          selectedCount={selectedProducts.length}
          onBulkAction={handleBulkAction}
        />
        
        <Filters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          stockFilter={stockFilter}
          onStockFilterChange={setStockFilter}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {/* Products Table */}
      <ProductTable
        products={currentProducts}
        selectedProducts={selectedProducts}
        onToggleSelect={toggleProductSelection}
        onToggleSelectAll={toggleSelectAll}
        onEdit={openEditModal}
        onDelete={handleDeleteProduct}
        onView={handleViewProduct}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={goToPage}
        onNext={goToNextPage}
        onPrevious={goToPreviousPage}
      />

      {/* Product Modal - This one has onSubmit */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleProductSubmit}
        product={editingProduct}
        mode={modalMode}
      />

      {/* View Product Modal - This one does NOT have onSubmit */}
      <ViewProductModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingProduct(null);
        }}
        product={viewingProduct}
      />
    </div>
  );
};

export default Inventory;