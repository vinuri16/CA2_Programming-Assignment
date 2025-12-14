'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ user, setUser }) {
  const pathname = usePathname();

  const handleLogout = () => {
    setUser(null);
    // Clear localStorage or session storage
    localStorage.removeItem('user');
  };

  const isActive = (path) => pathname === path;

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
            <Link 
              href="/catalog" 
              className={`transition-colors ${
                isActive('/catalog') 
                  ? 'text-green-600 font-medium border-b-2 border-green-600 pb-1' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              Plant Catalog
            </Link>
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <>
                    <Link 
                      href="/admin/inventory" 
                      className={`transition-colors ${
                        isActive('/admin/inventory') 
                          ? 'text-green-600 font-medium border-b-2 border-green-600 pb-1' 
                          : 'text-gray-600 hover:text-green-600'
                      }`}
                    >
                      Inventory
                    </Link>
                    <Link 
                      href="/admin/orders" 
                      className={`transition-colors ${
                        isActive('/admin/orders') 
                          ? 'text-green-600 font-medium border-b-2 border-green-600 pb-1' 
                          : 'text-gray-600 hover:text-green-600'
                      }`}
                    >
                      Orders
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/orders" 
                      className={`transition-colors ${
                        isActive('/orders') 
                          ? 'text-green-600 font-medium border-b-2 border-green-600 pb-1' 
                          : 'text-gray-600 hover:text-green-600'
                      }`}
                    >
                      My Orders
                    </Link>
                    <Link 
                      href="/profile" 
                      className={`transition-colors ${
                        isActive('/profile') 
                          ? 'text-green-600 font-medium border-b-2 border-green-600 pb-1' 
                          : 'text-gray-600 hover:text-green-600'
                      }`}
                    >
                      Profile
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={`transition-colors ${
                    isActive('/login') 
                      ? 'text-green-600 font-medium border-b-2 border-green-600 pb-1' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isActive('/register')
                      ? 'bg-green-700 text-white'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
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
