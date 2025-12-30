import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadRazorpayScript } from "../../utils/razorpay";
import type { RazorpayOptions } from "../../utils/razorpay";
import AddressSection from "./components/AddressSection";
import type { AddressData } from "./components/AddressSection";
import { validateCheckout } from "./utils/validation";
import PaymentMethod from "./components/PaymentMethod";
import OrderSummary from "./components/OrderSummary";

interface CartItem {
  _id: string;
  product: string;
  price: number;
  quantity: number;
  image?: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] =
    useState<"razorpay" | "cod">("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const [billingAddress, setBillingAddress] = useState<AddressData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India"
  });

  const [shippingAddress, setShippingAddress] = useState<AddressData>({
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India"
  });

  const [billingErrors, setBillingErrors] = useState({});
  const [shippingErrors, setShippingErrors] = useState({});

  const shippingCost = 10;

  // ---------------- AUTH + CART ----------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const userName = localStorage.getItem("userName");

    if (token && userRole === "user") {
      setIsLoggedIn(true);
      const email = `${userName || "user"}@example.com`;
      setUserEmail(email);
      setBillingAddress((p) => ({ ...p, email }));
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const loadCart = async () => {
      const products = await Promise.all(
        cart.map(async (item: any) => {
          const res = await fetch(
            `${API_BASE_URL}/api/products/${item._id}`
          );
          const data = await res.json();
          return { ...data, quantity: item.quantity };
        })
      );
      setCartItems(products);
    };

    if (cart.length) loadCart();
  }, [API_BASE_URL]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + shippingCost;

  // ---------------- VALIDATION ----------------
  const validateAddresses = () => {
    const { isValid, billingErrors, shippingErrors } = validateCheckout(
      billingAddress,
      shippingAddress,
      sameAsBilling
    );

    setBillingErrors(billingErrors);
    setShippingErrors(shippingErrors);
    return isValid;
  };

  const finalShippingAddress = sameAsBilling
    ? billingAddress
    : shippingAddress;

  // ---------------- RAZORPAY ----------------
  const createRazorpayOrder = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API_BASE_URL}/api/payments/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: total })
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Order creation failed");

    return data; // { orderId, amount, currency }
  };

  const startRazorpay = async () => {
    setIsProcessing(true);

    try {
      const order = await createRazorpayOrder();
      await loadRazorpayScript();

      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount.toString(),
        currency: order.currency,
        name: "Your Store",
        description: "Order Payment",
        order_id: order.orderId,

        handler: async (response: any) => {
          localStorage.removeItem("cart");
          navigate("/order-success", {
            state: { paymentId: response.razorpay_payment_id }
          });
        },

        prefill: {
          name: `${billingAddress.firstName} ${billingAddress.lastName}`.trim(),
          email: billingAddress.email || userEmail,
          contact: billingAddress.phone
        },

        theme: {
          color: "#4f46e5"
        }
      };

      new (window as any).Razorpay(options).open();
    } catch (err: any) {
      alert(err.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // ---------------- COD ----------------
  const placeCODOrder = async () => {
    setIsProcessing(true);
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/api/orders/place`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        items: cartItems,
        subtotal,
        shippingCost,
        total,
        billingAddress,
        shippingAddress: finalShippingAddress,
        paymentMethod: "cod"
      })
    });

    const data = await res.json();
    if (!res.ok) {
      setIsProcessing(false);
      return alert(data.message || "Order failed");
    }

    localStorage.removeItem("cart");
    navigate("/order-success", { state: { orderId: data.order._id } });
  };

  // ---------------- PLACE ORDER ----------------
  const handlePlaceOrder = async () => {
    if (!isLoggedIn) return alert("Please login");
    if (!cartItems.length) return alert("Cart is empty");
    if (!validateAddresses()) return;

    paymentMethod === "razorpay"
      ? await startRazorpay()
      : await placeCODOrder();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>

      {!isLoggedIn && (
        <div className="bg-yellow-100 p-4 text-center mb-6">
          Please <Link to="/login">login</Link> to continue
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <AddressSection
            billingAddress={billingAddress}
            shippingAddress={shippingAddress}
            onBillingChange={setBillingAddress}
            onShippingChange={setShippingAddress}
            billingErrors={billingErrors}
            shippingErrors={shippingErrors}
            sameAsBilling={sameAsBilling}
            setSameAsBilling={setSameAsBilling}
            userEmail={userEmail}
          />

          <PaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>

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
