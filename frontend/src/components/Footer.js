import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🌱</span>
              </div>
              <span className="font-bold text-xl">Urban Plant Life</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your premier destination for indoor and outdoor plants in Dublin. 
              We're committed to bringing sustainable greenery to urban spaces across Ireland.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <div className="text-gray-300 space-y-2">
              <p>📍 Cork Street, Dublin, Ireland</p>
              <p>📞 +353 1 234 5678</p>
              <p>✉️ info@urbanplantlife.ie</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/catalog" className="hover:text-green-400 transition-colors">
                  Plant Catalog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex justify-center items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Urban Plant Life. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
