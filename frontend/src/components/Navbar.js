'use client';

import Link from 'next/link';

export default function Navbar({ user, setUser }) {
  const handleLogout = () => {
    setUser(null);
    // Clear localStorage or session storage
    localStorage.removeItem('user');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🌱</span>
              </div>
              <span className="font-bold text-xl text-gray-800">Urban Plant Life</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/catalog" className="text-gray-600 hover:text-green-600 transition-colors">
              Plant Catalog
            </Link>
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <>
                    <Link href="/admin/inventory" className="text-gray-600 hover:text-green-600 transition-colors">
                      Inventory
                    </Link>
                    <Link href="/admin/orders" className="text-gray-600 hover:text-green-600 transition-colors">
                      Orders
                    </Link>
                  </>
                ) : (
                  <Link href="/orders" className="text-gray-600 hover:text-green-600 transition-colors">
                    My Orders
                  </Link>
                )}
                <Link href="/profile" className="text-gray-600 hover:text-green-600 transition-colors">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-green-600 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
