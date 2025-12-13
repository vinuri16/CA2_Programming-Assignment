'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const router = useRouter();

  // Test data for orders
  useEffect(() => {
    const mockOrders = [
      {
        id: 'ORD-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+353 87 123 4567',
        orderDate: '2024-12-10',
        status: 'pending',
        total: 89.97,
        items: [
          { id: 1, name: 'Monstera Deliciosa', price: 29.99, quantity: 2, image: '🌿' },
          { id: 2, name: 'Peace Lily', price: 24.99, quantity: 1, image: '🕊️' }
        ],
        shippingAddress: '123 Main St, Dublin 2, Ireland',
        paymentMethod: 'Credit Card',
        paymentStatus: 'paid',
        notes: ''
      },
      {
        id: 'ORD-002',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        customerPhone: '+353 87 234 5678',
        orderDate: '2024-12-09',
        status: 'processing',
        total: 45.99,
        items: [
          { id: 3, name: 'Fiddle Leaf Fig', price: 45.99, quantity: 1, image: '🌳' }
        ],
        shippingAddress: '456 Oak Avenue, Cork, Ireland',
        paymentMethod: 'PayPal',
        paymentStatus: 'paid',
        notes: 'Please deliver after 2 PM'
      },
      {
        id: 'ORD-003',
        customerName: 'Mike Wilson',
        customerEmail: 'mike@example.com',
        customerPhone: '+353 87 345 6789',
        orderDate: '2024-12-08',
        status: 'shipped',
        total: 67.97,
        items: [
          { id: 4, name: 'Boston Fern', price: 22.99, quantity: 2, image: '🌿' },
          { id: 5, name: 'Rubber Tree', price: 21.99, quantity: 1, image: '🌳' }
        ],
        shippingAddress: '789 Pine Street, Galway, Ireland',
        paymentMethod: 'Credit Card',
        paymentStatus: 'paid',
        notes: '',
        trackingNumber: 'TN123456789'
      },
      {
        id: 'ORD-004',
        customerName: 'Emma Brown',
        customerEmail: 'emma@example.com',
        customerPhone: '+353 87 456 7890',
        orderDate: '2024-12-07',
        status: 'delivered',
        total: 32.98,
        items: [
          { id: 6, name: 'Lavender', price: 15.99, quantity: 2, image: '💜' }
        ],
        shippingAddress: '321 Elm Road, Limerick, Ireland',
        paymentMethod: 'Credit Card',
        paymentStatus: 'paid',
        notes: '',
        deliveryDate: '2024-12-10'
      },
      {
        id: 'ORD-005',
        customerName: 'David Lee',
        customerEmail: 'david@example.com',
        customerPhone: '+353 87 567 8901',
        orderDate: '2024-12-06',
        status: 'cancelled',
        total: 19.99,
        items: [
          { id: 7, name: 'Snake Plant', price: 19.99, quantity: 1, image: '🐍' }
        ],
        shippingAddress: '654 Birch Lane, Waterford, Ireland',
        paymentMethod: 'Credit Card',
        paymentStatus: 'refunded',
        notes: 'Customer requested cancellation'
      }
    ];
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);

    // Check if user is admin
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.role !== 'admin') {
        router.push('/');
        return;
      }
      setUser(userData);
    } else {
      router.push('/login');
    }
  }, [router]);

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      totalRevenue: orders
        .filter(o => o.paymentStatus === 'paid' && o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0)
    };
    return stats;
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const stats = getOrderStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} setUser={setUser} />
      
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Management</h1>
          <p className="text-gray-600">Manage customer orders and track their progress</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xl font-bold text-blue-600">{stats.processing}</div>
            <div className="text-sm text-gray-600">Processing</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xl font-bold text-purple-600">{stats.shipped}</div>
            <div className="text-sm text-gray-600">Shipped</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xl font-bold text-green-600">{stats.delivered}</div>
            <div className="text-sm text-gray-600">Delivered</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xl font-bold text-green-600">€{stats.totalRevenue.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Revenue</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-500">{order.orderDate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <span key={index} className="text-lg">{item.image}</span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-sm text-gray-500">+{order.items.length - 3} more</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{order.items.length} item(s)</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Order Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Order ID:</span> {selectedOrder.id}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {selectedOrder.orderDate}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Payment:</span> {selectedOrder.paymentStatus}
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                  <div className="text-sm space-y-1">
                    <div><span className="font-medium">Name:</span> {selectedOrder.customerName}</div>
                    <div><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</div>
                    <div><span className="font-medium">Phone:</span> {selectedOrder.customerPhone}</div>
                    <div><span className="font-medium">Address:</span> {selectedOrder.shippingAddress}</div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{item.image}</span>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">€{(item.price * item.quantity).toFixed(2)}</div>
                          <div className="text-sm text-gray-500">€{item.price} each</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center font-bold">
                      <span>Total:</span>
                      <span>€{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Notes</h3>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedOrder.notes}</p>
                  </div>
                )}

                {/* Tracking Info */}
                {selectedOrder.trackingNumber && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Tracking Information</h3>
                    <p className="text-sm">Tracking Number: <span className="font-medium">{selectedOrder.trackingNumber}</span></p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
