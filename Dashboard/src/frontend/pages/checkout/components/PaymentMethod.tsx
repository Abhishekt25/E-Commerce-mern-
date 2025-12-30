import React from 'react';

interface PaymentMethodProps {
  paymentMethod: 'razorpay' | 'cod';
  setPaymentMethod: (method: 'razorpay' | 'cod') => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ 
  paymentMethod, 
  setPaymentMethod 
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
      <div className="space-y-3">
        <div 
          className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-100 ${
            paymentMethod === 'razorpay' ? 'border-blue-500 bg-blue-50' : ''
          }`}
          onClick={() => setPaymentMethod("razorpay")}
        >
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

        <div 
          className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-100 ${
            paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : ''
          }`}
          onClick={() => setPaymentMethod("cod")}
        >
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
  );
};

export default PaymentMethod;