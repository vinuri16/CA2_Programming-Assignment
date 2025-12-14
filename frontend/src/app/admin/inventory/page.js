'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ImageUploader from '@/components/ImageUploader';
import { plantAPI } from '@/lib/api';

export default function AdminInventory() {
  const [plants, setPlants] = useState([]);
  const [isAddingPlant, setIsAddingPlant] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const [newPlant, setNewPlant] = useState({
    name: '',
    price: '',
    category: 'Indoor',
    description: '',
    stock_quantity: '',
    care_level: 'Easy',
    light_requirement: 'Bright Indirect',
    image_url: ''
  });

  // Load plants from backend
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if user is admin
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          if (userData.role !== 'admin' && userData.role !== 'staff') {
            router.push('/');
            return;
          }
          setUser(userData);
        } else {
          router.push('/login');
          return;
        }

        // Fetch plants
        const response = await plantAPI.getAll();
        const plantData = response.data || response;
        setPlants(plantData);
      } catch (err) {
        setError(err.message || 'Failed to load plants');
        console.error('Error loading plants:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlants();
  }, [router]);

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowStock = lowStockFilter ? plant.stock_quantity <= 5 : true;
    return matchesSearch && matchesLowStock;
  });

  const handleAddPlant = async (e) => {
    e.preventDefault();
    try {
      const plantData = {
        ...newPlant,
        price: parseFloat(newPlant.price),
        stock_quantity: parseInt(newPlant.stock_quantity)
      };

      if (editingPlant) {
        // Update existing plant
        await plantAPI.update(editingPlant.plant_id, plantData);
        setSuccessMessage('Plant updated successfully!');
      } else {
        // Create new plant
        await plantAPI.create(plantData);
        setSuccessMessage('Plant added successfully!');
      }

      // Refresh plants list
      const response = await plantAPI.getAll();
      const plantDataList = response.data || response;
      setPlants(plantDataList);

      // Reset form
      setNewPlant({
        name: '',
        price: '',
        category: 'Indoor',
        description: '',
        stock_quantity: '',
        care_level: 'Easy',
        light_requirement: 'Bright Indirect',
        image_url: ''
      });
      setEditingPlant(null);
      setIsAddingPlant(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save plant');
    }
  };

  const handleUpdateStock = async (plantId, newStock) => {
    try {
      const plant = plants.find(p => p.plant_id === plantId);
      if (!plant) return;

      await plantAPI.update(plantId, {
        ...plant,
        stock_quantity: newStock
      });

      // Update local state
      setPlants(plants.map(p =>
        p.plant_id === plantId ? { ...p, stock_quantity: newStock } : p
      ));
      setSuccessMessage('Stock updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update stock');
    }
  };

  const handleDeletePlant = async (plantId) => {
    if (!confirm('Are you sure you want to delete this plant?')) return;

    try {
      await plantAPI.delete(plantId);
      setPlants(plants.filter(p => p.plant_id !== plantId));
      setSuccessMessage('Plant deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete plant');
    }
  };

  const handleEditPlant = (plant) => {
    setEditingPlant(plant);
    setNewPlant({
      name: plant.name,
      price: plant.price,
      category: plant.category,
      description: plant.description,
      stock_quantity: plant.stock_quantity.toString(),
      care_level: plant.care_level,
      light_requirement: plant.light_requirement,
      image_url: plant.image_url || ''
    });
    setIsAddingPlant(true);
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (quantity <= 5) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} setUser={setUser} />

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Plant Inventory Management</h1>
          <p className="text-gray-600">Manage your plant stock levels and inventory</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-8">
            {successMessage}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🌱</div>
            <p className="text-gray-600">Loading inventory...</p>
          </div>
        ) : (
          <>


            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-blue-600">{plants.length}</div>
                <div className="text-gray-600">Total Plants</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-green-600">
                  {plants.filter(p => p.stockQuantity > 5).length}
                </div>
                <div className="text-gray-600">In Stock</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-yellow-600">
                  {plants.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5).length}
                </div>
                <div className="text-gray-600">Low Stock</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-red-600">
                  {plants.filter(p => p.stock_quantity === 0).length}
                </div>
                <div className="text-gray-600">Out of Stock</div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-black">
              <div className="flex justify-between items-center gap-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Search plants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={lowStockFilter}
                      onChange={(e) => setLowStockFilter(e.target.checked)}
                      className="mr-2"
                    />
                    Low Stock Only
                  </label>
                </div>
                <button
                  onClick={() => {
                    setIsAddingPlant(true);
                    setEditingPlant(null);
                    setNewPlant({
                      name: '',
                      price: '',
                      category: 'Indoor',
                      description: '',
                      stock_quantity: '',
                      care_level: 'Easy',
                      light_requirement: 'Bright Indirect'
                    });
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add New Plant
                </button>
              </div>
            </div>

            {/* Add/Edit Plant Form */}
            {isAddingPlant && (
              <div className="bg-white text-black rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">
                  {editingPlant ? 'Edit Plant' : 'Add New Plant'}
                </h2>
                <form onSubmit={handleAddPlant} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Plant Name</label>
                      <input
                        type="text"
                        required
                        value={newPlant.name}
                        onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={newPlant.price}
                        onChange={(e) => setNewPlant({ ...newPlant, price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={newPlant.category}
                        onChange={(e) => setNewPlant({ ...newPlant, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="Indoor">Indoor</option>
                        <option value="Outdoor">Outdoor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={newPlant.stock_quantity}
                        onChange={(e) => setNewPlant({ ...newPlant, stock_quantity: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Care Level</label>
                      <select
                        value={newPlant.care_level}
                        onChange={(e) => setNewPlant({ ...newPlant, care_level: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Light Requirement</label>
                      <select
                        value={newPlant.light_requirement}
                        onChange={(e) => setNewPlant({ ...newPlant, light_requirement: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="Low Light">Low Light</option>
                        <option value="Medium Light">Medium Light</option>
                        <option value="Bright Indirect">Bright Indirect</option>
                        <option value="Bright Light">Bright Light</option>
                        <option value="Full Sun">Full Sun</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      required
                      value={newPlant.description}
                      onChange={(e) => setNewPlant({ ...newPlant, description: e.target.value })}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <ImageUploader
                      label="Plant Image (Uploadcare CDN)"
                      value={newPlant.image_url}
                      onImageSelect={(imageUrl) => setNewPlant({ ...newPlant, image_url: imageUrl })}
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {editingPlant ? 'Update Plant' : 'Add Plant'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingPlant(false);
                        setEditingPlant(null);
                        setNewPlant({
                          name: '',
                          price: '',
                          category: 'Indoor',
                          description: '',
                          stock_quantity: '',
                          care_level: 'Easy',
                          light_requirement: 'Bright Indirect',
                          image_url: ''
                        });
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Plants Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPlants.map((plant) => {
                      const stockStatus = getStockStatus(plant.stock_quantity);
                      return (
                        <tr key={plant.plant_id} className='text-black'>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {plant.image_url ? (
                                <img
                                  src={plant.image_url}
                                  alt={plant.image_alt || plant.name}
                                  className="w-10 h-10 rounded-full object-cover mr-3"
                                  onError={(e) => {
                                    e.target.src = '🌱';
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <span className="text-2xl mr-3">🌱</span>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">{plant.name}</div>
                                <div className="text-sm text-gray-500">{plant.care_level} care</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {plant.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            € {plant.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              value={plant.stock_quantity}
                              onChange={(e) => handleUpdateStock(plant.plant_id, parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.color}`}>
                              {stockStatus.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(plant.created_at || plant.updated_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditPlant(plant)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeletePlant(plant.plant_id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredPlants.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No plants found</h3>
                <p className="text-gray-600">Try adjusting your search terms or add a new plant</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
