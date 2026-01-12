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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  /* Fetch Best Products */
  useEffect(() => {
    const fetchBestProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/api/products/category/Best-product`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch best products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load best products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBestProducts();
  }, [API_BASE_URL]);

  /* Auto Slide */
  useEffect(() => {
    if (products.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) =>
          (prev + 1) % Math.ceil(products.length / 3)
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [products.length]);

  /*Cart Functions*/
  const handleAddToCart = (product: Product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingItem = existingCart.find(
      (item: any) => item._id === product._id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({ _id: product._id, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    setShowViewCart(product._id);
    setTimeout(() => setShowViewCart(null), 5000);

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleViewCart = () => {
    navigate("/cart");
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      (prev + 1) % Math.ceil(products.length / 3)
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      (prev - 1 + Math.ceil(products.length / 3)) %
      Math.ceil(products.length / 3)
    );
  };

  const calculateDiscount = (price: number, salePrice: number) => {
    return Math.round(((price - salePrice) / price) * 100);
  };

  /*LOADING STATE (Skeleton)*/
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Best Selling Products
          </h2>
          <p className="text-gray-600 text-lg">
            Waking up our servers… please wait ⏳
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
            >
              <div className="h-64 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-10 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /*ERROR STATE */
  if (error) {
    return (
      <div className="text-center py-12 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  /* EMPTY STATE*/
  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No best-selling products available right now.
      </div>
    );
  }

  /* MAIN UI*/
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Our Best Selling Products
        </h2>
        <p className="text-gray-600 text-lg">
          Discover our most popular nutrition products
        </p>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({
              length: Math.ceil(products.length / 3),
            }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6 px-2"
              >
                {products
                  .slice(slideIndex * 3, slideIndex * 3 + 3)
                  .map((product) => (
                    <div
                      key={product._id}
                      onClick={() =>
                        navigate(`/product/${product._id}`)
                      }
                      className="bg-white rounded-2xl shadow-lg overflow-hidden border hover:shadow-xl transition cursor-pointer"
                    >
                      {/* Image */}
                      <div className="relative">
                        {product.image ? (
                          <img
                            src={`${API_BASE_URL}/uploads/${product.image}`}
                            alt={product.product}
                            className="w-full h-64 object-cover"
                          />
                        ) : (
                          <div className="h-64 bg-gray-200 flex items-center justify-center">
                            No Image
                          </div>
                        )}

                        {product.salePrice && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            Sale{" "}
                            {calculateDiscount(
                              product.price,
                              product.salePrice
                            )}
                            %
                          </div>
                        )}

                        <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Best Sales
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-6">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {product.product}
                        </h3>

                        <div className="flex gap-2 mb-4">
                          {product.salePrice ? (
                            <>
                              <span className="text-2xl font-bold">
                                ₹{product.salePrice}
                              </span>
                              <span className="line-through text-gray-500">
                                ₹{product.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold">
                              ₹{product.price}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          disabled={product.stock <= 0}
                          className={`w-full py-3 rounded-lg font-semibold ${
                            product.stock > 0
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {product.stock > 0
                            ? "Add to Cart"
                            : "Out of Stock"}
                        </button>

                        {showViewCart === product._id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewCart();
                            }}
                            className="mt-2 w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
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

        {/* Arrows */}
        {products.length > 3 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* See More */}
      <div className="text-center mt-12">
        <Link
          to="/products"
          className="inline-block bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800"
        >
          SEE MORE
        </Link>
      </div>
    </div>
  );
};

export default BestProduct;
