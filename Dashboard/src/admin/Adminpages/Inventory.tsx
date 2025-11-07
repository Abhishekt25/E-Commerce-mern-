// import { useEffect, useState } from "react";

// interface Product {
//   _id: string;
//   product: string;
//   slug: string;
//   sku: string;
//   stock: number;
//   price: number;
//   status: string;
//   categories: string[];
//   description: string;
//   shortDescription: string;
//   tags: string[];
//   image?: string;
//   createdAt: string;
// }

// const Inventory = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [showAddProduct, setShowAddProduct] = useState<boolean>(false);
//   const [showEditProduct, setShowEditProduct] = useState<boolean>(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [stockFilter, setStockFilter] = useState<string>("all");
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [itemsPerPage, setItemsPerPage] = useState<number>(10);

//   // Add Product Form State
//   const [newProduct, setNewProduct] = useState({
//     product: "",
//     slug: "",
//     sku: "",
//     stock: 0,
//     price: 0,
//     categories: "",
//     description: "",
//     shortDescription: "",
//     tags: "",
//     image: null as File | null,
//   });

//   // Edit Product Form State
//   const [editProduct, setEditProduct] = useState({
//     product: "",
//     slug: "",
//     sku: "",
//     stock: 0,
//     price: 0,
//     categories: "",
//     description: "",
//     shortDescription: "",
//     tags: "",
//     image: null as File | null,
//   });

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//       const response = await fetch(`${API_BASE_URL}/api/products`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data: Product[] = await response.json();
//       console.log("Products fetched:", data);
//       setProducts(data);
//       setLoading(false);
//     } catch (err: unknown) {
//       console.error("Error fetching products:", err);
//       setError(err instanceof Error ? err.message : 'Unknown error');
//       setLoading(false);
//     }
//   };

//   // Generate slug from product name
//   const generateSlug = (productName: string): string => {
//     return productName
//       .toLowerCase()
//       .trim()
//       .replace(/[^\w\s-]/g, '')
//       .replace(/[\s_-]+/g, '-')
//       .replace(/^-+|-+$/g, '');
//   };

//   // Auto-generate slug when product name changes (for add form)
//   useEffect(() => {
//     if (newProduct.product && !newProduct.slug) {
//       const generatedSlug = generateSlug(newProduct.product);
//       setNewProduct(prev => ({ ...prev, slug: generatedSlug }));
//     }
//   }, [newProduct.product]);

//   // Auto-generate slug when product name changes (for edit form)
//   useEffect(() => {
//     if (editProduct.product && !editProduct.slug) {
//       const generatedSlug = generateSlug(editProduct.product);
//       setEditProduct(prev => ({ ...prev, slug: generatedSlug }));
//     }
//   }, [editProduct.product]);

//   // Filter products based on search term and stock filter
//   const filteredProducts = products.filter((product: Product) => {
//     const matchesSearch = product.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          product.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesStock = stockFilter === "all" ||
//                         (stockFilter === "in_stock" && product.stock > 0) ||
//                         (stockFilter === "out_of_stock" && product.stock === 0) ||
//                         (stockFilter === "low_stock" && product.stock > 0 && product.stock < 10);

//     return matchesSearch && matchesStock;
//   });

//   // Pagination calculations
//   const totalItems = filteredProducts.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentProducts = filteredProducts.slice(startIndex, endIndex);

//   // Reset to first page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, stockFilter]);

//   const toggleProductSelection = (productId: string): void => {
//     setSelectedProducts(prev =>
//       prev.includes(productId)
//         ? prev.filter(id => id !== productId)
//         : [...prev, productId]
//     );
//   };

//   const toggleSelectAll = (): void => {
//     const currentPageProductIds = currentProducts.map(p => p._id);
//     setSelectedProducts(
//       selectedProducts.length === currentPageProductIds.length
//         ? []
//         : currentPageProductIds
//     );
//   };

//   const getStockBadge = (stock: number): { text: string; class: string } => {
//     if (stock === 0) return { text: "Out of stock", class: "bg-red-100 text-red-800" };
//     if (stock < 10) return { text: "Low stock", class: "bg-yellow-100 text-yellow-800" };
//     return { text: "In stock", class: "bg-green-100 text-green-800" };
//   };

//   const formatDate = (dateString: string): string => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Pagination functions
//   const goToPage = (page: number): void => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const goToNextPage = (): void => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const goToPreviousPage = (): void => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   // Handle Add Product Form
//   const handleAddProduct = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const formData = new FormData();
//     formData.append('product', newProduct.product);
//     formData.append('slug', newProduct.slug);
//     formData.append('sku', newProduct.sku);
//     formData.append('stock', newProduct.stock.toString());
//     formData.append('price', newProduct.price.toString());
//     formData.append('categories', newProduct.categories);
//     formData.append('description', newProduct.description);
//     formData.append('shortDescription', newProduct.shortDescription);
//     formData.append('tags', newProduct.tags);
//     formData.append('status', 'active');
    
//     if (newProduct.image) {
//       formData.append('image', newProduct.image);
//     }

//     try {
//       const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//       const response = await fetch(`${API_BASE_URL}/api/products`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log('Product added:', result);
        
//         // Refresh products list
//         await fetchProducts();
        
//         // Reset form and close
//         setNewProduct({
//           product: "",
//           slug: "",
//           sku: "",
//           stock: 0,
//           price: 0,
//           categories: "",
//           description: "",
//           shortDescription: "",
//           tags: "",
//           image: null,
//         });
//         setShowAddProduct(false);
//       } else {
//         throw new Error('Failed to add product');
//       }
//     } catch (error) {
//       console.error('Error adding product:', error);
//       alert('Error adding product. Please try again.');
//     }
//   };

//   // Handle Edit Product
//   const handleEditProduct = (product: Product) => {
//     setEditingProduct(product);
//     setEditProduct({
//       product: product.product,
//       slug: product.slug,
//       sku: product.sku,
//       stock: product.stock,
//       price: product.price,
//       categories: product.categories.join(", "),
//       description: product.description,
//       shortDescription: product.shortDescription,
//       tags: product.tags.join(", "),
//       image: null,
//     });
//     setShowEditProduct(true);
//   };

//   // Handle Update Product
//   const handleUpdateProduct = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!editingProduct) return;

//     const formData = new FormData();
//     formData.append('product', editProduct.product);
//     formData.append('slug', editProduct.slug);
//     formData.append('sku', editProduct.sku);
//     formData.append('stock', editProduct.stock.toString());
//     formData.append('price', editProduct.price.toString());
//     formData.append('categories', editProduct.categories);
//     formData.append('description', editProduct.description);
//     formData.append('shortDescription', editProduct.shortDescription);
//     formData.append('tags', editProduct.tags);
    
//     if (editProduct.image) {
//       formData.append('image', editProduct.image);
//     }

//     try {
//       const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//       const response = await fetch(`${API_BASE_URL}/api/products/${editingProduct._id}`, {
//         method: 'PUT',
//         body: formData,
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log('Product updated:', result);
        
//         // Refresh products list
//         await fetchProducts();
        
//         // Reset form and close
//         setShowEditProduct(false);
//         setEditingProduct(null);
//         setEditProduct({
//           product: "",
//           slug: "",
//           sku: "",
//           stock: 0,
//           price: 0,
//           categories: "",
//           description: "",
//           shortDescription: "",
//           tags: "",
//           image: null,
//         });
//       } else {
//         throw new Error('Failed to update product');
//       }
//     } catch (error) {
//       console.error('Error updating product:', error);
//       alert('Error updating product. Please try again.');
//     }
//   };

//   // Handle Delete Product
//   const handleDeleteProduct = async (productId: string) => {
//     if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//       const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         console.log('Product deleted successfully');
        
//         // Refresh products list
//         await fetchProducts();
        
//         // Remove from selected products if it was selected
//         setSelectedProducts(prev => prev.filter(id => id !== productId));
//       } else {
//         throw new Error('Failed to delete product');
//       }
//     } catch (error) {
//       console.error('Error deleting product:', error);
//       alert('Error deleting product. Please try again.');
//     }
//   };

//   // Bulk Actions
//   const handleBulkAction = async (action: string) => {
//     if (action === "trash" && selectedProducts.length > 0) {
//       if (confirm(`Move ${selectedProducts.length} product(s) to trash?`)) {
//         try {
//           const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
          
//           // Delete all selected products
//           await Promise.all(
//             selectedProducts.map(productId =>
//               fetch(`${API_BASE_URL}/api/products/${productId}`, {
//                 method: 'DELETE',
//               })
//             )
//           );
          
//           // Refresh products list
//           await fetchProducts();
//           setSelectedProducts([]);
//         } catch (error) {
//           console.error('Error deleting products:', error);
//           alert('Error deleting products. Please try again.');
//         }
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="animate-pulse">
//           <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
//           <div className="space-y-3">
//             <div className="h-4 bg-gray-200 rounded"></div>
//             <div className="h-4 bg-gray-200 rounded"></div>
//             <div className="h-4 bg-gray-200 rounded"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
//               <p className="text-sm text-red-600 mt-1">{error}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} products
//           </p>
//         </div>
//         <button 
//           onClick={() => setShowAddProduct(true)}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
//         >
//           Add Product
//         </button>
//       </div>

//       {/* Add Product Modal */}
//       {showAddProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Add New Product</h2>
//                 <button
//                   onClick={() => setShowAddProduct(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
              
//               <form onSubmit={handleAddProduct} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Product Name *
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       placeholder="Enter product name"
//                       value={newProduct.product}
//                       onChange={(e) => setNewProduct({...newProduct, product: e.target.value})}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Slug *
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       placeholder="Auto-generated slug"
//                       value={newProduct.slug}
//                       onChange={(e) => setNewProduct({...newProduct, slug: e.target.value})}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
//                     />
//                     <p className="text-xs text-gray-500 mt-1">Slug will be auto-generated from product name</p>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       SKU *
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       placeholder="Enter SKU"
//                       value={newProduct.sku}
//                       onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Stock *
//                     </label>
//                     <input
//                       type="number"
//                       required
//                       min="0"
//                       placeholder="Enter stock quantity"
//                       value={newProduct.stock}
//                       onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Price *
//                     </label>
//                     <input
//                       type="number"
//                       required
//                       min="0"
//                       step="0.01"
//                       placeholder="Enter price"
//                       value={newProduct.price}
//                       onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Categories
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="Enter categories (comma separated)"
//                       value={newProduct.categories}
//                       onChange={(e) => setNewProduct({...newProduct, categories: e.target.value})}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                     <p className="text-xs text-gray-500 mt-1">Separate multiple categories with commas</p>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Short Description
//                   </label>
//                   <textarea
//                     placeholder="Enter a brief description (max 200 characters)"
//                     value={newProduct.shortDescription}
//                     onChange={(e) => setNewProduct({...newProduct, shortDescription: e.target.value})}
//                     rows={3}
//                     maxLength={200}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     {newProduct.shortDescription.length}/200 characters
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Full Description
//                   </label>
//                   <textarea
//                     placeholder="Enter full product description"
//                     value={newProduct.description}
//                     onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
//                     rows={5}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Tags
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter tags (comma separated)"
//                     value={newProduct.tags}
//                     onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Product Image
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setNewProduct({...newProduct, image: e.target.files?.[0] || null})}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
                
//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowAddProduct(false)}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                   >
//                     Add Product
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Product Modal */}
//       {showEditProduct && editingProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Edit Product</h2>
//                 <button
//                   onClick={() => {
//                     setShowEditProduct(false);
//                     setEditingProduct(null);
//                   }}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
              
//               <form onSubmit={handleUpdateProduct} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Product Name *
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       placeholder="Enter product name"
//                       value={editProduct.product}
//                       onChange={(e) => setEditProduct({...editProduct, product: e.target.value})}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Slug *
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       placeholder="Auto-generated slug"
//                       value={editProduct.slug}
//                       onChange={(e) => setEditProduct({...editProduct, slug: e.target.value})}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
//                     />
//                     <p className="text-xs text-gray-500 mt-1">Slug will be auto-generated from product name</p>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       SKU *
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       placeholder="Enter SKU"
//                       value={editProduct.sku}
//                       onChange={(e) => setEditProduct({...editProduct, sku: e.target.value})}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Stock *
//                     </label>
//                     <input
//                       type="number"
//                       required
//                       min="0"
//                       placeholder="Enter stock quantity"
//                       value={editProduct.stock}
//                       onChange={(e) => setEditProduct({...editProduct, stock: parseInt(e.target.value) || 0})}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Price *
//                     </label>
//                     <input
//                       type="number"
//                       required
//                       min="0"
//                       step="0.01"
//                       placeholder="Enter price"
//                       value={editProduct.price}
//                       onChange={(e) => setEditProduct({...editProduct, price: parseFloat(e.target.value) || 0})}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Categories
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="Enter categories (comma separated)"
//                       value={editProduct.categories}
//                       onChange={(e) => setEditProduct({...editProduct, categories: e.target.value})}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                     <p className="text-xs text-gray-500 mt-1">Separate multiple categories with commas</p>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Short Description
//                   </label>
//                   <textarea
//                     placeholder="Enter a brief description (max 200 characters)"
//                     value={editProduct.shortDescription}
//                     onChange={(e) => setEditProduct({...editProduct, shortDescription: e.target.value})}
//                     rows={3}
//                     maxLength={200}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     {editProduct.shortDescription.length}/200 characters
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Full Description
//                   </label>
//                   <textarea
//                     placeholder="Enter full product description"
//                     value={editProduct.description}
//                     onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
//                     rows={5}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Tags
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter tags (comma separated)"
//                     value={editProduct.tags}
//                     onChange={(e) => setEditProduct({...editProduct, tags: e.target.value})}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Product Image
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setEditProduct({...editProduct, image: e.target.files?.[0] || null})}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   {editingProduct.image && (
//                     <p className="text-xs text-gray-500 mt-1">
//                       Current image: {editingProduct.image}
//                     </p>
//                   )}
//                 </div>
                
//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowEditProduct(false);
//                       setEditingProduct(null);
//                     }}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                   >
//                     Update Product
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Filters and Stats */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
//         {/* Bulk Actions */}
//         {selectedProducts.length > 0 && (
//           <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg mb-4">
//             <span className="text-sm font-medium text-blue-900">
//               {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
//             </span>
//             <select 
//               onChange={(e) => handleBulkAction(e.target.value)}
//               className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Bulk actions</option>
//               <option value="trash">Move to trash</option>
//             </select>
//             <button 
//               onClick={() => handleBulkAction("trash")}
//               className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             >
//               Apply
//             </button>
//           </div>
//         )}

//         {/* Search and Filters */}
//         <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
//           <div className="flex-1">
//             <input
//               type="text"
//               placeholder="Search products by name, SKU, or slug..."
//               value={searchTerm}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <select 
//             value={stockFilter}
//             onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStockFilter(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="all">All stock status</option>
//             <option value="in_stock">In stock</option>
//             <option value="out_of_stock">Out of stock</option>
//             <option value="low_stock">Low stock</option>
//           </select>
          
//           {/* Items per page selector */}
//           <select 
//             value={itemsPerPage}
//             onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setItemsPerPage(Number(e.target.value))}
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="5">5 per page</option>
//             <option value="10">10 per page</option>
//             <option value="20">20 per page</option>
//             <option value="50">50 per page</option>
//           </select>
//         </div>
//       </div>

//       {/* Products Table */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="w-12 px-6 py-3">
//                   <input
//                     type="checkbox"
//                     className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                     checked={selectedProducts.length === currentProducts.length && currentProducts.length > 0}
//                     onChange={toggleSelectAll}
//                   />
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Product
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   SKU
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Stock
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Price
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Categories
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date Added
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentProducts.length === 0 ? (
//                 <tr>
//                   <td colSpan={8} className="px-6 py-12 text-center">
//                     <div className="flex flex-col items-center justify-center">
//                       <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
//                       </svg>
//                       <p className="text-gray-500 text-lg font-medium">No products found</p>
//                       <p className="text-gray-400 mt-1">
//                         {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first product'}
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 currentProducts.map((product: Product) => {
//                   const stockBadge = getStockBadge(product.stock);
//                   const isSelected = selectedProducts.includes(product._id);
                  
//                   return (
//                     <tr 
//                       key={product._id}
//                       className={`hover:bg-gray-50 transition-colors duration-150 ${
//                         isSelected ? 'bg-blue-50' : ''
//                       }`}
//                     >
//                       <td className="px-6 py-4">
//                         <input
//                           type="checkbox"
//                           className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                           checked={isSelected}
//                           onChange={() => toggleProductSelection(product._id)}
//                         />
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center space-x-3">
//                           {product.image ? (
//                             <img
//                               src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${product.image}`}
//                               alt={product.product}
//                               className="w-10 h-10 rounded-lg object-cover bg-gray-100"
//                               onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
//                                 const target = e.target as HTMLImageElement;
//                                 target.style.display = 'none';
//                               }}
//                             />
//                           ) : (
//                             <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
//                               <span className="text-xs text-gray-500">📦</span>
//                             </div>
//                           )}
//                           <div className="min-w-0 flex-1">
//                             <p className="text-sm font-medium text-gray-900 truncate">
//                               {product.product}
//                             </p>
//                             <p className="text-xs text-gray-500 truncate">
//                               /{product.slug}
//                             </p>
//                             {product.shortDescription && (
//                               <p className="text-xs text-gray-500 truncate mt-1">
//                                 {product.shortDescription}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
//                           {product.sku}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockBadge.class}`}>
//                           {stockBadge.text}
//                           {product.stock > 0 && ` (${product.stock})`}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="text-sm font-semibold text-gray-900">
//                           ${product.price.toFixed(2)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         {product.categories && product.categories.length > 0 ? (
//                           <div className="flex flex-wrap gap-1">
//                             {product.categories.slice(0, 2).map((category, index) => (
//                               <span
//                                 key={index}
//                                 className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
//                               >
//                                 {category}
//                               </span>
//                             ))}
//                             {product.categories.length > 2 && (
//                               <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
//                                 +{product.categories.length - 2} more
//                               </span>
//                             )}
//                           </div>
//                         ) : (
//                           <span className="text-xs text-gray-500">No categories</span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="text-sm text-gray-500">
//                           {formatDate(product.createdAt)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() => handleEditProduct(product)}
//                             className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
//                             title="Edit product"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                             </svg>
//                           </button>
//                           <button
//                             onClick={() => handleDeleteProduct(product._id)}
//                             className="text-red-600 hover:text-red-900 transition-colors duration-200"
//                             title="Delete product"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="bg-white px-6 py-4 border-t border-gray-200">
//             <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
//               <div className="text-sm text-gray-700">
//                 Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 {/* Previous Button */}
//                 <button
//                   onClick={goToPreviousPage}
//                   disabled={currentPage === 1}
//                   className={`px-3 py-1 rounded-md text-sm font-medium ${
//                     currentPage === 1
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                       : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
//                   }`}
//                 >
//                   Previous
//                 </button>

//                 {/* Page Numbers */}
//                 <div className="flex space-x-1">
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }

//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => goToPage(pageNum)}
//                         className={`px-3 py-1 rounded-md text-sm font-medium ${
//                           currentPage === pageNum
//                             ? 'bg-blue-600 text-white'
//                             : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 {/* Next Button */}
//                 <button
//                   onClick={goToNextPage}
//                   disabled={currentPage === totalPages}
//                   className={`px-3 py-1 rounded-md text-sm font-medium ${
//                     currentPage === totalPages
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                       : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
//                   }`}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Inventory;