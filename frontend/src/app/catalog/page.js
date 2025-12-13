'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Catalog() {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [user, setUser] = useState(null);

  // Test data
  useEffect(() => {
    const mockPlants = [
      {
        id: 1,
        name: 'Monstera Deliciosa',
        price: 29.99,
        category: 'Indoor',
        image: '🌿',
        description: 'Perfect for bright, indirect light. Known for its unique split leaves.',
        inStock: true,
        stockQuantity: 15,
        careLevel: 'Easy',
        lightRequirement: 'Bright Indirect'
      },
      {
        id: 2,
        name: 'Fiddle Leaf Fig',
        price: 45.99,
        category: 'Indoor',
        image: '🌳',
        description: 'Statement plant perfect for any room. Requires consistent care.',
        inStock: true,
        stockQuantity: 8,
        careLevel: 'Moderate',
        lightRequirement: 'Bright Light'
      },
      {
        id: 3,
        name: 'Snake Plant',
        price: 19.99,
        category: 'Indoor',
        image: '🐍',
        description: 'Low maintenance and excellent air purifying qualities.',
        inStock: false,
        stockQuantity: 0,
        careLevel: 'Easy',
        lightRequirement: 'Low Light'
      },
      {
        id: 4,
        name: 'Peace Lily',
        price: 24.99,
        category: 'Indoor',
        image: '🕊️',
        description: 'Beautiful white flowers and air purifying properties.',
        inStock: true,
        stockQuantity: 12,
        careLevel: 'Easy',
        lightRequirement: 'Medium Light'
      },
      {
        id: 5,
        name: 'Lavender',
        price: 15.99,
        category: 'Outdoor',
        image: '💜',
        description: 'Fragrant and therapeutic herb perfect for gardens.',
        inStock: true,
        stockQuantity: 20,
        careLevel: 'Easy',
        lightRequirement: 'Full Sun'
      },
      {
        id: 6,
        name: 'Boston Fern',
        price: 22.99,
        category: 'Indoor',
        image: '🌿',
        description: 'Lush green foliage that adds natural beauty to any space.',
        inStock: true,
        stockQuantity: 10,
        careLevel: 'Moderate',
        lightRequirement: 'Medium Light'
      },
      {
        id: 7,
        name: 'Rubber Tree',
        price: 32.99,
        category: 'Indoor',
        image: '🌳',
        description: 'Glossy leaves and easy care make this a popular choice.',
        inStock: true,
        stockQuantity: 6,
        careLevel: 'Easy',
        lightRequirement: 'Bright Indirect'
      },
      {
        id: 8,
        name: 'Rosemary',
        price: 12.99,
        category: 'Outdoor',
        image: '🌿',
        description: 'Aromatic herb perfect for cooking and gardens.',
        inStock: true,
        stockQuantity: 25,
        careLevel: 'Easy',
        lightRequirement: 'Full Sun'
      }
    ];
    setPlants(mockPlants);
    setFilteredPlants(mockPlants);

    // Check if user is logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = plants;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(plant => plant.category.toLowerCase() === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(plant => 
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort plants
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredPlants(filtered);
  }, [plants, selectedCategory, searchTerm, sortBy]);

  const handleAddToCart = (plant) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    
    // Mock add to cart functionality
    alert(`Added ${plant.name} to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} setUser={setUser} />
      
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Plant Catalog</h1>
          <p className="text-gray-600">Discover our complete collection of indoor and outdoor plants</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-4 gap-4">
            {/* Search */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Plants</label>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Categories</option>
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPlants.length} of {plants.length} plants
          </p>
        </div>

        {/* Plants Grid */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {filteredPlants.map((plant) => (
            <div key={plant.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Plant Image */}
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative">
                <span className="text-6xl">{plant.image}</span>
                {!plant.inStock && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Out of Stock
                  </div>
                )}
              </div>
              
              {/* Plant Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{plant.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plant.careLevel === 'Easy' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {plant.careLevel}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{plant.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category:</span>
                    <span className="text-gray-800">{plant.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Light:</span>
                    <span className="text-gray-800">{plant.lightRequirement}</span>
                  </div>
                  {plant.inStock && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">In Stock:</span>
                      <span className="text-gray-800">{plant.stockQuantity} available</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    €{plant.price}
                  </span>
                </div>
                
                <button
                  onClick={() => handleAddToCart(plant)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    plant.inStock
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!plant.inStock}
                >
                  {plant.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredPlants.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No plants found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
