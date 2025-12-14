'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { plantAPI } from '@/lib/api';
import { useCart } from '@/context/CartContext';

export default function Catalog() {
  const { addToCart, getTotalItems } = useCart();
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch plants from backend
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await plantAPI.getAll();

        // Extract plants from response
        const plantData = response.data || response;
        setPlants(plantData);
        setFilteredPlants(plantData);
      } catch (err) {
        setError(err.message || 'Failed to load plants');
        console.error('Error fetching plants:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlants();

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
          return b.price - a.price;
        case 'price-high':
          return a.price - b.price;
        default:
          return 0;
      }
    });

    setFilteredPlants(filtered);
  }, [plants, selectedCategory, searchTerm, sortBy]);

  const handleAddToCart = async (plant) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    if (plant.stock_quantity === 0) {
      alert('This item is out of stock');
      return;
    }

    try {
      await addToCart(plant);
      setSuccessMessage(`${plant.name} added to cart!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to add item to cart: ' + err.message);
    }
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

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
            <span>{successMessage}</span>
            <Link
              href="/cart"
              className="font-semibold text-green-700 hover:text-green-900 ml-4"
            >
              View Cart ({getTotalItems()})
            </Link>
          </div>
        )}

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 placeholder:text-slate-400 text-slate-900"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 placeholder:text-slate-400 text-slate-900"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 placeholder:text-slate-400 text-slate-900"
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
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="text-4xl mb-4">🌱</div>
              <p className="text-gray-600">Loading plants...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-8">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-6 mb-12">
              {filteredPlants.map((plant) => (
                <div key={plant.plant_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Plant Image */}
                  <div className="h-48 bg-linear-to-br from-green-100 to-green-200 flex items-center justify-center relative overflow-hidden">
                    {plant.image_url ? (
                      <img
                        src={plant.image_url}
                        alt={plant.image_alt || plant.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = document.createElement('span');
                          fallback.className = 'text-6xl';
                          fallback.textContent = '🌿';
                          e.target.parentElement.appendChild(fallback);
                        }}
                      />
                    ) : (
                      <span className="text-6xl">🌿</span>
                    )}
                    {plant.stock_quantity === 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Plant Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{plant.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${plant.care_level === 'Easy'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {plant.care_level || 'Easy'}
                      </span>
                    </div>

                    {/* Plant Description */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{plant.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Category:</span>
                        <span className="text-gray-800">{plant.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Light:</span>
                        <span className="text-gray-800">{plant.light_requirement || 'Indirect'}</span>
                      </div>
                      {plant.stock_quantity > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">In Stock:</span>
                          <span className="text-gray-800">{plant.stock_quantity} available</span>
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
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${plant.stock_quantity > 0
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      disabled={plant.stock_quantity === 0}
                    >
                      {plant.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* No results */}
            {!isLoading && !error && filteredPlants.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No plants found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters</p>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
