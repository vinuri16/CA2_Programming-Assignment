'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { orderAPI } from '@/lib/api';

export default function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!user || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading...</p>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      // Prepare order data
      const orderData = {
        user_id: user.user_id,
        total_amount: totalPrice,
        items: cartItems.map(item => ({
          plant_id: item.plant_id,
          quantity: item.quantity,
          price: item.price
        })),
        payment_method: paymentMethod
      };

      // Create order via API
      const response = await orderAPI.create(orderData);

      setSuccessMessage('Order placed successfully!');

      // Clear cart
      clearCart();

      // Redirect to order confirmation after 2 seconds
      setTimeout(() => {
        router.push(`/orders`);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
      console.error('Error placing order:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} setUser={setUser} />

      <div className="max-w-5xl mx-auto px-8 py-8 grow w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Billing Address */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Billing Address</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50" style={{ borderColor: paymentMethod === 'stripe' ? '#16a34a' : undefined, backgroundColor: paymentMethod === 'stripe' ? '#f0fdf4' : undefined }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 font-medium text-gray-800">💳 Credit/Debit Card (Stripe)</span>
                  </label>

                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50" style={{ borderColor: paymentMethod === 'paypal' ? '#16a34a' : undefined, backgroundColor: paymentMethod === 'paypal' ? '#f0fdf4' : undefined }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 font-medium text-gray-800">🅿️ PayPal</span>
                  </label>
                </div>

                {paymentMethod === 'stripe' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                    ℹ️ Card details will be processed securely via Stripe. This is a demo - no actual charges will be made.
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                    ℹ️ You will be redirected to PayPal to complete your purchase. This is a demo - no actual charges will be made.
                  </div>
                )}
              </div>

              {/* Order Items Review */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Items</h2>
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.plant_id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-gray-800">€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Place Order - €${totalPrice.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Items ({cartItems.length})</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>€0.00</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>€0.00</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-800 mb-6">
                <span>Total</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>

              <p className="text-xs text-gray-500 text-center">
                🔒 Your payment information is secure
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
