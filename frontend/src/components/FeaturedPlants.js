'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FeaturedPlants() {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    // Test data
    const mockPlants = [
      {
        id: 1,
        name: 'Monstera Deliciosa',
        price: 29.99,
        category: 'Indoor',
        image: '🌿',
        description: 'Perfect for bright, indirect light',
        inStock: true
      },
      {
        id: 2,
        name: 'Fiddle Leaf Fig',
        price: 45.99,
        category: 'Indoor',
        image: '🌳',
        description: 'Statement plant for any room',
        inStock: true
      },
      {
        id: 3,
        name: 'Snake Plant',
        price: 19.99,
        category: 'Indoor',
        image: '🐍',
        description: 'Low maintenance and air purifying',
        inStock: false
      },
      {
        id: 4,
        name: 'Peace Lily',
        price: 24.99,
        category: 'Indoor',
        image: '🕊️',
        description: 'Beautiful white flowers',
        inStock: true
      },
      {
        id: 5,
        name: 'Lavender',
        price: 15.99,
        category: 'Outdoor',
        image: '💜',
        description: 'Fragrant and therapeutic',
        inStock: true
      },
      {
        id: 6,
        name: 'Boston Fern',
        price: 22.99,
        category: 'Indoor',
        image: '🌿',
        description: 'Lush green foliage',
        inStock: true
      }
    ];
    setPlants(mockPlants);
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Featured Plants
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our most popular plants, carefully selected for Dublin's climate and urban living spaces.
          </p>
        </div>

        {/* Plants Grid */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          {plants.map((plant) => (
            <div key={plant.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Plant Image */}
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <span className="text-6xl">{plant.image}</span>
              </div>
              
              {/* Plant Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{plant.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plant.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {plant.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">{plant.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    €{plant.price}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {plant.category}
                  </span>
                </div>
                
                <button
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

        <div className="text-center">
          <Link
            href="/catalog"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-block"
          >
            View All Plants
          </Link>
        </div>
      </div>
    </section>
  );
}
