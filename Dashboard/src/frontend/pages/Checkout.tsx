import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadRazorpayScript } from "../utils/razorpay";
import type { RazorpayOptions } from "../utils/razorpay";

interface CartItem {
  _id: string;
  product: string;
  price: number;
  image?: string;
  quantity: number;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

const Checkout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingCost] = useState(10.0);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  // Shipping Address State
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

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
        const promises = savedCart.map(
          async (item: { _id: string; quantity: number }) => {
            const res = await fetch(`${API_BASE_URL}/api/products/${item._id}`);
            const data = await res.json();
            return { ...data, quantity: item.quantity };
          }
        );
        const results = await Promise.all(promises);
        setCartItems(results);
      } catch (error) {
        console.error("Error loading cart products:", error);
      }
    };

    if (savedCart.length > 0) fetchCartProducts();
  }, [API_BASE_URL]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + shippingCost;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create Razorpay Order
  const createRazorpayOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Backend error response:", data);
        
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        } else if (response.status === 400) {
          throw new Error(data.message || "Invalid request to payment gateway");
        } else {
          throw new Error(data.message || `Failed to create order (${response.status})`);
        }
      }
      
      if (!data.success) {
        throw new Error(data.message || "Failed to create payment order");
      }
      
      return data;
    } catch (error:any) {
      console.error("Create Razorpay Order Error:", error);
      
      if (error.message.includes("credentials") || error.message.includes("authentication")) {
        throw new Error("Payment gateway configuration error. Please contact support.");
      } else if (error.message.includes("Session expired")) {
        localStorage.removeItem("token");
        navigate("/login");
        throw new Error("Please login again to continue");
      } else {
        throw error;
      }
    }
  };

  // Verify Payment
  const verifyPayment = async (paymentData: any) => {
    try {
      const token = localStorage.getItem("token");
      
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        shippingCost,
        total,
        shippingAddress,
      };

      const response = await fetch(`${API_BASE_URL}/api/payments/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...paymentData,
          orderData,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Payment Verification Error:", error);
      throw error;
    }
  };

  // Initialize Razorpay Payment
  const initiateRazorpayPayment = async () => {
    setIsProcessing(true);
    
    try {
      // 1. Create Razorpay Order
      const order = await createRazorpayOrder();

      // 2. Load Razorpay Script
      await loadRazorpayScript();

      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount.toString(),
        currency: order.currency,
        name: "Your Store Name",
        description: "Order Payment",
        order_id: order.orderId,
        handler: async (response: any) => {
          // Payment successful
          try {
            // Verify payment
            const verification = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.success) {
              // Clear cart
              localStorage.removeItem("cart");
              
              // Redirect to success page
              navigate("/order-success", {
                state: { orderId: verification.order._id },
              });
            } else {
              alert("Payment verification failed. Please contact support.");
              setIsProcessing(false);
            }
          } catch (error) {
            console.error("Payment handler error:", error);
            alert("Payment processing failed. Please try again.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: localStorage.getItem("userName") || "",
          email: userEmail,
          contact: shippingAddress.phone || "",
        },
        theme: {
          color: "#4f46e5",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (error: any) {
      console.error("Payment Initiation Error:", error);
      alert(error.message || "Failed to initialize payment");
      setIsProcessing(false);
    }
  };

  // Handle COD Order
  const handleCODOrder = async () => {
    if (!isLoggedIn) {
      alert("Please login to place order.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsProcessing(true);
    
    try {
      const token = localStorage.getItem("token");

      const orderData = {
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        shippingCost,
        total,
        shippingAddress,
        paymentMethod: "cod",
      };

      const res = await fetch(`${API_BASE_URL}/api/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Order failed");
        setIsProcessing(false);
        return;
      }

      // Clear cart
      localStorage.removeItem("cart");

      // Redirect to success page
      navigate("/order-success", {
        state: { orderId: data.order._id },
      });
    } catch (error) {
      console.error("Order error:", error);
      alert("Something went wrong placing your order.");
      setIsProcessing(false);
    }
  };

  // Main Place Order Function
  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      alert("Please login to place order.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Validate shipping address for both methods
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.zipCode) {
      alert("Please fill in all required shipping address fields.");
      return;
    }

    if (paymentMethod === "razorpay") {
      await initiateRazorpayPayment();
    } else {
      await handleCODOrder();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      {!isLoggedIn && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-lg mb-6 text-center">
          Please{" "}
          <Link to="/login" className="text-blue-600 underline">
            login
          </Link>{" "}
          or{" "}
          <Link to="/signup" className="text-blue-600 underline">
            sign up
          </Link>{" "}
          to continue checkout.
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side */}
        <div className="lg:w-2/3">
          {/* Shipping Address */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="border p-3 rounded-lg" placeholder="Street Address" 
                  name="street" value={shippingAddress.street} onChange={handleAddressChange} required />
                <input className="border p-3 rounded-lg" placeholder="City" 
                  name="city" value={shippingAddress.city} onChange={handleAddressChange} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input className="border p-3 rounded-lg" placeholder="State" 
                  name="state" value={shippingAddress.state} onChange={handleAddressChange} required />
                <input className="border p-3 rounded-lg" placeholder="ZIP Code" 
                  name="zipCode" value={shippingAddress.zipCode} onChange={handleAddressChange} required />
                <input className="border p-3 rounded-lg" placeholder="Phone" 
                  name="phone" value={shippingAddress.phone} onChange={handleAddressChange} required />
              </div>
            </form>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => setPaymentMethod("razorpay")}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                  className="h-5 w-5"
                />
                <div className="flex-1">
                  <p className="font-medium">Pay with Razorpay</p>
                  <p className="text-sm text-gray-600">Credit/Debit Card, UPI, NetBanking</p>
                </div>
                <img 
                  src="https://razorpay.com/assets/razorpay-glyph.svg" 
                  alt="Razorpay" 
                  className="h-8"
                />
              </div>

              <div className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => setPaymentMethod("cod")}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="h-5 w-5"
                />
                <div>
                  <p className="font-medium">Cash on Delivery (COD)</p>
                  <p className="text-sm text-gray-600">Pay when you receive the order</p>
                </div>
              </div>
            </div>

            {paymentMethod === "razorpay" && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  You will be redirected to Razorpay's secure payment gateway to complete your payment.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-3 border-b pb-4">
                  {item.image ? (
                    <img
                      src={`${API_BASE_URL}/uploads/${item.image}`}
                      alt={item.product}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      No Image
                    </div>
                  )}

                  <div className="flex-grow">
                    <p className="font-medium text-sm">{item.product}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>

                  <p className="font-semibold text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Section */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>

              <div className="border-t pt-3 mt-3 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={!isLoggedIn || isProcessing}
              className={`w-full py-3 rounded-lg font-medium ${
                isLoggedIn && !isProcessing
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  {paymentMethod === "razorpay" ? "Pay Now" : "Place Order (COD)"}
                </>
              )}
            </button>

            <Link
              to="/cart"
              className="block w-full mt-3 border text-center py-3 rounded-lg font-medium"
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