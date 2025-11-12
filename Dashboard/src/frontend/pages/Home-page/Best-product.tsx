import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  product: string;
  price: number;
  salePrice?: number;
  image?: string;
  categories: string[];
  description?: string;
  shortDescription?: string;
  stock: number;
}

const BestProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showViewCart, setShowViewCart] = useState<string | null>(null);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBestProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/category/Best-product`);
        if (!response.ok) throw new Error("Failed to fetch best products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching best products:", error);
      }
    };

    fetchBestProducts();
  }, [API_BASE_URL]);

  // Auto slide for carousel
  useEffect(() => {
    if (products.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(products.length / 3));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [products.length]);

  // Add to Cart functionality
  const handleAddToCart = (product: Product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingItem = existingCart.find((item: any) => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({ _id: product._id, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    
    // Show product-level view cart button
    setShowViewCart(product._id);
    setTimeout(() => {
      setShowViewCart(null);
    }, 5000);

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Go to Cart page
  const handleViewCart = () => {
    navigate("/cart");
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(products.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(products.length / 3)) % Math.ceil(products.length / 3));
  };

  const calculateDiscount = (price: number, salePrice: number) => {
    return Math.round(((price - salePrice) / price) * 100);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Best Selling Products</h2>
        <p className="text-gray-600 text-lg">Discover our most popular nutrition products</p>
      </div>

      {/* Products Carousel */}
      <div className="relative">
        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: Math.ceil(products.length / 3) }).map((_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
                {products.slice(slideIndex * 3, slideIndex * 3 + 3).map((product) => (
                  <div key={product._id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                    {/* Product Image with Sale Badge */}
                    <div className="relative">
                      {product.image ? (
                        <img
                          src={`${API_BASE_URL}/uploads/${product.image}`}
                          alt={product.product}
                          className="w-full h-64 object-cover"
                        />
                      ) : (
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                      
                      {/* Sale Badge */}
                      {product.salePrice && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Sale {calculateDiscount(product.price, product.salePrice)}%
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Best Sales
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                        {product.product}
                      </h3>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        {product.salePrice ? (
                          <>
                            <span className="text-2xl font-bold text-gray-900">${product.salePrice}</span>
                            <span className="text-lg text-gray-500 line-through">${product.price}</span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className={`w-full py-3 rounded-lg font-semibold transition-colors duration-300 ${
                          product.stock > 0
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-400 cursor-not-allowed text-gray-700"
                        }`}
                      >
                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                      </button>

                      {/* View Cart Button */}
                      {showViewCart === product._id && (
                        <button
                          onClick={handleViewCart}
                          className="mt-2 w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
                        >
                          View Cart
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {products.length > 3 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all duration-300 backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all duration-300 backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {products.length > 3 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(products.length / 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? "bg-gray-900" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* See More Button */}
      <div className="text-center mt-12">
        <Link
          to="/products"
          className="inline-block bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
        >
          SEE MORE
        </Link>
      </div>
    </div>
  );
};

export default BestProduct;