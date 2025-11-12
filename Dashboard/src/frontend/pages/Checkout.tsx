import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface CartItem {
  _id: string;
  product: string;
  price: number;
  image?: string;
  quantity: number;
}

const Checkout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingCost] = useState(10.00);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

useEffect(() => {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  if (token && userRole === "user") {
    setIsLoggedIn(true);
    setUserEmail(`${userName || "User"}@example.com`); 
  } else {
    setIsLoggedIn(false);
  }


    // Load cart items
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const fetchCartProducts = async () => {
      try {
        const promises = savedCart.map(async (item: { _id: string; quantity: number }) => {
          const res = await fetch(`${API_BASE_URL}/api/products/${item._id}`);
          const data = await res.json();
          return { ...data, quantity: item.quantity };
        });
        const results = await Promise.all(promises);
        setCartItems(results);
      } catch (error) {
        console.error("Error loading cart products:", error);
      }
    };

    if (savedCart.length > 0) fetchCartProducts();
  }, [API_BASE_URL]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shippingCost;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      {!isLoggedIn && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-lg mb-6 text-center">
          Please <Link to="/login" className="text-blue-600 underline">login</Link> or <Link to="/signup" className="text-blue-600 underline">sign up</Link> to continue checkout.
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Shipping Address & Payment */}
        <div className="lg:w-2/3">
          {/* Shipping Address */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  placeholder="First Name" 
                />
                <input 
                  className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  placeholder="Last Name" 
                />
              </div>
              <input 
                className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Email Address" 
                type="email"
                value={isLoggedIn ? userEmail : ""}
                readOnly={isLoggedIn}
              />
              <input 
                className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Street Address" 
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  placeholder="City" 
                />
                <input 
                  className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  placeholder="State" 
                />
                <input 
                  className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  placeholder="ZIP Code" 
                />
              </div>
            </form>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <form className="space-y-4">
              <input 
                className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Card Number" 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  placeholder="MM/YY" 
                />
                <input 
                  className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  placeholder="CVV" 
                />
              </div>
              <input 
                className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Name on Card" 
              />
            </form>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-3 border-b border-gray-200 pb-4 last:border-b-0">
                  {item.image ? (
                    <img
                      src={`${API_BASE_URL}/uploads/${item.image}`}
                      alt={item.product}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                      No Image
                    </div>
                  )}
                  <div className="flex-grow">
                    <p className="font-medium text-sm">{item.product}</p>
                    <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes</span>
                <span className="text-sm">Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isLoggedIn 
                  ? "bg-green-600 text-white hover:bg-green-700" 
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
              disabled={!isLoggedIn}
            >
              {isLoggedIn ? "Place Order" : "Please Login to Checkout"}
            </button>

            <Link
              to="/cart"
              className="block w-full border border-gray-300 text-gray-700 text-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium mt-3"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;