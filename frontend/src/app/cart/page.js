'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cartItems, isLoading, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const [user, setUser] = useState(null);
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

  const handleQuantityChange = async (plantId, quantity) => {
    try {
      await updateQuantity(plantId, quantity);
      setSuccessMessage('Quantity updated');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const handleRemoveItem = async (plantId) => {
    try {
      await removeFromCart(plantId);
      setSuccessMessage('Item removed from cart');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} setUser={setUser} />

      <div className="max-w-7xl mx-auto px-8 py-8 grow w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review and manage your items before checkout</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <Link
              href="/catalog"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subtotal</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {cartItems.map(item => (
                        <tr key={item.plant_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              {item.image_url && (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="h-12 w-12 object-cover rounded"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              )}
                              {!item.image_url && (
                                <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-xl">
                                  🌿
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-600">{item.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-800">€{item.price}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleQuantityChange(item.plant_id, item.quantity - 1)}
                                className="px-2 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                              >
                                −
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.plant_id, Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-12 text-center border border-gray-300 rounded py-1"
                              />
                              <button
                                onClick={() => handleQuantityChange(item.plant_id, item.quantity + 1)}
                                className="px-2 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-800">
                            €{(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleRemoveItem(item.plant_id)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow p-6 h-fit">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
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
                  <span>€ {totalPrice.toFixed(2)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full block text-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/catalog"
                  className="w-full block text-center mt-3 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
