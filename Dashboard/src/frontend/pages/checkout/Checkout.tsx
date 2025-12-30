import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadRazorpayScript } from "../../utils/razorpay";
import type { RazorpayOptions } from "../../utils/razorpay";
import AddressSection, { type AddressData } from "./components/AddressSection";
import { validateCheckout } from "./utils/validation";
import PaymentMethod from "./components/PaymentMethod";
import OrderSummary from "./components/OrderSummary";

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
  const [shippingCost] = useState(10.0);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  // Address States
  const [billingAddress, setBillingAddress] = useState<AddressData>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: "",
    firstName: "",
    lastName: "",
    email: ""
  });

  const [shippingAddress, setShippingAddress] = useState<AddressData>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: "",
    firstName: "",
    lastName: "",
    email: ""
  });

  // Validation Errors
  const [billingErrors, setBillingErrors] = useState<any>({});
  const [shippingErrors, setShippingErrors] = useState<any>({});

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");

    if (token && userRole === "user") {
      setIsLoggedIn(true);
      setUserEmail(`${userName || "User"}@example.com`);
      
      // Set user email in billing address
      setBillingAddress(prev => ({
        ...prev,
        email: `${userName || "User"}@example.com`
      }));
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

  const validateAddresses = () => {
    // We assume sameAddress is true when shippingAddress is empty
    const sameAddress = 
      shippingAddress.street === "" && 
      shippingAddress.city === "" && 
      shippingAddress.state === "";

    const { isValid, billingErrors, shippingErrors } = validateCheckout(
      billingAddress,
      shippingAddress,
      sameAddress
    );

    setBillingErrors(billingErrors);
    setShippingErrors(shippingErrors);

    return isValid;
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
        billingAddress,
        shippingAddress: shippingAddress.street ? shippingAddress : billingAddress,
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
          name: `${billingAddress.firstName} ${billingAddress.lastName}`.trim() || localStorage.getItem("userName") || "",
          email: billingAddress.email || userEmail,
          contact: billingAddress.phone || "",
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
        billingAddress,
        shippingAddress: shippingAddress.street ? shippingAddress : billingAddress,
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

    // Validate addresses
    if (!validateAddresses()) {
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
          {/* Address Section */}
          <AddressSection
            billingAddress={billingAddress}
            shippingAddress={shippingAddress}
            onBillingChange={setBillingAddress}
            onShippingChange={setShippingAddress}
            billingErrors={billingErrors}
            shippingErrors={shippingErrors}
            userEmail={userEmail}
          />

          {/* Payment Method */}
          <PaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>

        {/* Right Side - Order Summary */}
        <OrderSummary
          cartItems={cartItems}
          subtotal={subtotal}
          shippingCost={shippingCost}
          total={total}
          isLoggedIn={isLoggedIn}
          isProcessing={isProcessing}
          paymentMethod={paymentMethod}
          onPlaceOrder={handlePlaceOrder}
          API_BASE_URL={API_BASE_URL}
        />
      </div>
    </div>
  );
};

export default Checkout;