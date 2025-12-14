'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { orderAPI } from '@/lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Check if user is logged in
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
          router.push('/login');
          return;
        }

        const userData = JSON.parse(savedUser);
        if (userData.role === 'admin') {
          router.push('/admin/orders');
          return;
        }
        setUser(userData);

        // Fetch orders for current user
        const response = await orderAPI.getForUser();
        const orderData = response.data || response;
        setOrders(Array.isArray(orderData) ? orderData : []);
      } catch (err) {
        setError(err.message || 'Failed to load orders');
        console.error('Error loading orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-cyan-100 text-cyan-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '📦';
      case 'shipped':
        return '🚚';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} setUser={setUser} />

      <div className="max-w-6xl mx-auto px-8 py-8 grow w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600">View and track your order history</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-600">You haven't placed any orders yet. Start shopping now!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.order_id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                {/* Order Header */}
                <div className="border-b p-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order ID</p>
                      <p className="font-semibold text-gray-800">#{order.order_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Date</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(order.order_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total</p>
                      <p className="font-semibold text-gray-800">€{parseFloat(order.total_amount).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Details Toggle */}
                <div className="p-6">
                  <button
                    onClick={() => setSelectedOrder(selectedOrder?.order_id === order.order_id ? null : order)}
                    className="text-green-600 hover:text-green-800 font-medium flex items-center gap-2"
                  >
                    {selectedOrder?.order_id === order.order_id ? '▼' : '▶'} View Details
                  </button>

                  {/* Expanded Order Details */}
                  {selectedOrder?.order_id === order.order_id && (
                    <div className="mt-6 pt-6 border-t space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Items</h3>
                        {order.items && order.items.length > 0 ? (
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center py-2 bg-gray-50 px-3 rounded">
                                <div>
                                  <p className="font-medium text-gray-800">{item.plant_name || `Plant #${item.plant_id}`}</p>
                                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                                <span className="font-semibold text-gray-800">€{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-600">No items in this order</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Order Status Timeline</p>
                          <div className="space-y-2 text-sm">
                            <p className={`${order.status !== 'pending' ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                              ✓ Order Placed
                            </p>
                            <p className={`${['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                              {['processing', 'shipped', 'delivered'].includes(order.status) ? '✓' : '○'} Processing
                            </p>
                            <p className={`${['shipped', 'delivered'].includes(order.status) ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                              {['shipped', 'delivered'].includes(order.status) ? '✓' : '○'} Shipped
                            </p>
                            <p className={`${order.status === 'delivered' ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                              {order.status === 'delivered' ? '✓' : '○'} Delivered
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-2">Last Updated</p>
                          <p className="font-semibold text-gray-800">
                            {order.updated_at ? new Date(order.updated_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
