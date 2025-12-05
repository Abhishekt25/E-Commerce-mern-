import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Product {
  _id: string;
  product: string;
  price: number;
  image?: string;
  quantity: number;
  description?: string;
}

const Cart = () => {
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const fetchCartProducts = async () => {
      try {
        const promises = savedCart.map(async (item: { _id: string; quantity: number }) => {
          const res = await fetch(`${API_BASE_URL}/api/products/${item._id}`);
          const data = await res.json();
          return { ...data, quantity: item.quantity };
        });

        const results = await Promise.all(promises);
        setCartProducts(results);
      } catch (error) {
        console.error("Error loading cart products:", error);
      }
    };

    if (savedCart.length > 0) fetchCartProducts();
  }, [API_BASE_URL]);

  // Update quantity
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedCart = cartProducts.map(product => 
      product._id === productId ? { ...product, quantity: newQuantity } : product
    );
    
    setCartProducts(updatedCart);
    
    // Update localStorage
    const cartForStorage = updatedCart.map(({ _id, quantity }) => ({ _id, quantity }));
    localStorage.setItem("cart", JSON.stringify(cartForStorage));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Remove item from cart
  const removeItem = (productId: string) => {
    const updatedCart = cartProducts.filter(product => product._id !== productId);
    setCartProducts(updatedCart);
    
    // Update localStorage
    const cartForStorage = updatedCart.map(({ _id, quantity }) => ({ _id, quantity }));
    localStorage.setItem("cart", JSON.stringify(cartForStorage));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const subtotal = cartProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h1>

      {cartProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            {cartProducts.map((product) => (
              <div
                key={product._id}
                className="border-b border-gray-200 py-6 last:border-b-0"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {product.image ? (
                      <img
                        src={`${API_BASE_URL}/uploads/${product.image}`}
                        alt={product.product}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {product.product}
                    </h3>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-gray-700 font-medium">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(product._id, product.quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-medium min-w-8 text-center">
                          {product.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product._id, product.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      {/* Remove button */}
                      <button
                        onClick={() => removeItem(product._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium ml-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-semibold text-lg text-gray-900">
                      ${(product.price * product.quantity).toFixed(2)}
                    </p>
                    <p className="text-gray-600 text-sm">
                      ${product.price} each
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/checkout"
                  className="block w-full bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Checkout
                </Link>
                
                <Link
                  to="/products"
                  className="block w-full border border-gray-300 text-gray-700 text-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;