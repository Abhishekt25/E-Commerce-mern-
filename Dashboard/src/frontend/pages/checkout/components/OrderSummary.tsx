import React from 'react';
import { Link } from 'react-router-dom';

interface CartItem {
  _id: string;
  product: string;
  price: number;
  image?: string;
  quantity: number;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  isLoggedIn: boolean;
  isProcessing: boolean;
  paymentMethod: 'razorpay' | 'cod';
  onPlaceOrder: () => void;
  API_BASE_URL: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  subtotal,
  shippingCost,
  total,
  isLoggedIn,
  isProcessing,
  paymentMethod,
  onPlaceOrder,
  API_BASE_URL
}) => {
  return (
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
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Price Section */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{shippingCost.toFixed(2)}</span>
          </div>

          <div className="border-t pt-3 mt-3 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={onPlaceOrder}
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
          className="block w-full mt-3 border text-center py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Back to Cart
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;