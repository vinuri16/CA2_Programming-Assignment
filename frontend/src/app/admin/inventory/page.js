'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';

export default function AdminInventory() {
  const [plants, setPlants] = useState([]);
  const [isAddingPlant, setIsAddingPlant] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const router = useRouter();

  const [newPlant, setNewPlant] = useState({
    name: '',
    price: '',
    category: 'Indoor',
    description: '',
    stockQuantity: '',
    careLevel: 'Easy',
    lightRequirement: 'Bright Indirect',
    image: '🌱'
  });

  // Test data for plants
  useEffect(() => {
    const mockPlants = [
      {
        id: 1,
        name: 'Monstera Deliciosa',
        price: 29.99,
        category: 'Indoor',
        image: '🌿',
        description: 'Perfect for bright, indirect light.',
        stockQuantity: 15,
        careLevel: 'Easy',
        lightRequirement: 'Bright Indirect',
        dateAdded: '2024-01-15',
        lastUpdated: '2024-12-10'
      },
      {
        id: 2,
        name: 'Fiddle Leaf Fig',
        price: 45.99,
        category: 'Indoor',
        image: '🌳',
        description: 'Statement plant for any room.',
        stockQuantity: 3,
        careLevel: 'Moderate',
        lightRequirement: 'Bright Light',
        dateAdded: '2024-02-01',
        lastUpdated: '2024-12-08'
      },
      {
        id: 3,
        name: 'Snake Plant',
        price: 19.99,
        category: 'Indoor',
        image: '🐍',
        description: 'Low maintenance and air purifying.',
        stockQuantity: 0,
        careLevel: 'Easy',
        lightRequirement: 'Low Light',
        dateAdded: '2024-01-20',
        lastUpdated: '2024-12-05'
      },
      {
        id: 4,
        name: 'Lavender',
        price: 15.99,
        category: 'Outdoor',
        image: '💜',
        description: 'Fragrant and therapeutic.',
        stockQuantity: 2,
        careLevel: 'Easy',
        lightRequirement: 'Full Sun',
        dateAdded: '2024-03-10',
        lastUpdated: '2024-12-12'
      }
    ];
    setPlants(mockPlants);

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

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowStock = lowStockFilter ? plant.stockQuantity <= 5 : true;
    return matchesSearch && matchesLowStock;
  });

  const handleAddPlant = (e) => {
    e.preventDefault();
    const plant = {
      ...newPlant,
      id: Date.now(),
      price: parseFloat(newPlant.price),
      stockQuantity: parseInt(newPlant.stockQuantity),
      dateAdded: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setPlants([...plants, plant]);
    setNewPlant({
      name: '',
      price: '',
      category: 'Indoor',
      description: '',
      stockQuantity: '',
      careLevel: 'Easy',
      lightRequirement: 'Bright Indirect',
      image: '🌱'
    });
    setIsAddingPlant(false);
  };

  const handleUpdateStock = (plantId, newStock) => {
    setPlants(plants.map(plant => 
      plant.id === plantId 
        ? { ...plant, stockQuantity: newStock, lastUpdated: new Date().toISOString().split('T')[0] }
        : plant
    ));
  };

  const handleDeletePlant = (plantId) => {
    if (confirm('Are you sure you want to delete this plant?')) {
      setPlants(plants.filter(plant => plant.id !== plantId));
    }
  };

  const handleEditPlant = (plant) => {
    setEditingPlant(plant);
    setNewPlant({
      name: plant.name,
      price: plant.price.toString(),
      category: plant.category,
      description: plant.description,
      stockQuantity: plant.stockQuantity.toString(),
      careLevel: plant.careLevel,
      lightRequirement: plant.lightRequirement,
      image: plant.image
    });
    setIsAddingPlant(true);
  };

  const handleUpdatePlant = (e) => {
    e.preventDefault();
    const updatedPlant = {
      ...editingPlant,
      ...newPlant,
      price: parseFloat(newPlant.price),
      stockQuantity: parseInt(newPlant.stockQuantity),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setPlants(plants.map(plant => 
      plant.id === editingPlant.id ? updatedPlant : plant
    ));
    setEditingPlant(null);
    setNewPlant({
      name: '',
      price: '',
      category: 'Indoor',
      description: '',
      stockQuantity: '',
      careLevel: 'Easy',
      lightRequirement: 'Bright Indirect',
      image: '🌱'
    });
    setIsAddingPlant(false);
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (quantity <= 5) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  if (!user) {
    return <div>Loading...</div>;
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
              {plants.filter(p => p.stockQuantity === 0).length}
            </div>
            <div className="text-gray-600">Out of Stock</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
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
              onClick={() => setIsAddingPlant(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add New Plant
            </button>
          </div>
        </div>

        {/* Add/Edit Plant Form */}
        {isAddingPlant && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingPlant ? 'Edit Plant' : 'Add New Plant'}
            </h2>
            <form onSubmit={editingPlant ? handleUpdatePlant : handleAddPlant} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plant Name</label>
                  <input
                    type="text"
                    required
                    value={newPlant.name}
                    onChange={(e) => setNewPlant({...newPlant, name: e.target.value})}
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
                    onChange={(e) => setNewPlant({...newPlant, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newPlant.category}
                    onChange={(e) => setNewPlant({...newPlant, category: e.target.value})}
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
                    value={newPlant.stockQuantity}
                    onChange={(e) => setNewPlant({...newPlant, stockQuantity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Care Level</label>
                  <select
                    value={newPlant.careLevel}
                    onChange={(e) => setNewPlant({...newPlant, careLevel: e.target.value})}
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
                    value={newPlant.lightRequirement}
                    onChange={(e) => setNewPlant({...newPlant, lightRequirement: e.target.value})}
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
                  onChange={(e) => setNewPlant({...newPlant, description: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                      stockQuantity: '',
                      careLevel: 'Easy',
                      lightRequirement: 'Bright Indirect',
                      image: '🌱'
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
                  const stockStatus = getStockStatus(plant.stockQuantity);
                  return (
                    <tr key={plant.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{plant.image}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{plant.name}</div>
                            <div className="text-sm text-gray-500">{plant.careLevel} care</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {plant.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        €{plant.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          value={plant.stockQuantity}
                          onChange={(e) => handleUpdateStock(plant.id, parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {plant.lastUpdated}
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
                            onClick={() => handleDeletePlant(plant.id)}
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
      </div>
    </div>
  );
}
