import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  product: string;
  price: number;
  stock: number;
  image?: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [_cart, setCart] = useState<{ _id: string; quantity: number }[]>([]);
  const [addedProduct, setAddedProduct] = useState<{ name: string; price: number } | null>(null);
  const [showViewCart, setShowViewCart] = useState<string | null>(null); 
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  //  Fetch all products and load saved cart
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();

    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, [API_BASE_URL]);

  //  Add to Cart (with quantity support)
  const handleAddToCart = (product: Product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingItem = existingCart.find((item: any) => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({ _id: product._id, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCart(existingCart);

    //  Show global notification
    setAddedProduct({ name: product.product, price: product.price });

    //  Show product-level viewcart for 10 seconds
    setShowViewCart(product._id);
    setTimeout(() => {
      setShowViewCart(null);
    }, 5000);

    setTimeout(() => {
      setAddedProduct(null);
    }, 5000);

    window.dispatchEvent(new Event("cartUpdated"));
  };

  //  Go to Cart page
  const handleViewCart = () => {
    navigate("/cart");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/*  Notification Bar */}
      {addedProduct && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
          <span>
            🛒 <strong>{addedProduct.name}</strong> (₹{addedProduct.price}) added to cart
          </span>
          <button
            onClick={handleViewCart}
            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
          >
            View Cart
          </button>
        </div>
      )}

      <h1 className="text-2xl font-semibold mb-6 text-center">Products</h1>

      {/*  Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded-2xl shadow-md p-4 flex flex-col items-center text-center bg-white"
          >
            {product.image ? (
              <img
                src={`${API_BASE_URL}/uploads/${product.image}`}
                alt={product.product}
                className="w-48 h-48 object-cover mb-4 rounded-lg"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-200 mb-4 flex items-center justify-center rounded-lg">
                No Image
              </div>
            )}

            <h2 className="text-lg font-medium">{product.product}</h2>
            <p className="text-gray-600 mt-1">₹{product.price}</p>

            <p
              className={`mt-2 text-sm font-semibold ₹{
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>

            <button
              onClick={() => handleAddToCart(product)}
              disabled={product.stock <= 0}
              className={`mt-4 w-full py-2 rounded-xl text-white ${
                product.stock > 0
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Add to Cart
            </button>

            {/*  Temporary View Cart button below Add to Cart */}
            {showViewCart === product._id && (
              <button
                onClick={handleViewCart}
                className="mt-2 w-full py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
              >
                View Cart
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
