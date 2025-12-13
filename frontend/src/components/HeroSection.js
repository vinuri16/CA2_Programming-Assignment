import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-green-600 to-green-800 text-white">
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className="grid grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h1 className="text-6xl font-bold mb-6">
              Bring Nature to Your Urban Space
            </h1>
            <p className="text-xl mb-8 text-green-100">
              Discover our curated collection of indoor and outdoor plants perfect for Dublin homes and businesses. 
              Transform your space with sustainable, beautiful greenery.
            </p>
            <div className="flex gap-4">
              <Link
                href="/catalog"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
              >
                Shop Plants
              </Link>
              <Link
                href="/about"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors text-center"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero Secion Images */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🌿</div>
                  <h3 className="font-semibold mb-1">Indoor Plants</h3>
                  <p className="text-sm text-green-100">Perfect for homes</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🌳</div>
                  <h3 className="font-semibold mb-1">Outdoor Plants</h3>
                  <p className="text-sm text-green-100">Gardens & patios</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🏢</div>
                  <h3 className="font-semibold mb-1">Office Plants</h3>
                  <p className="text-sm text-green-100">Business spaces</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🌱</div>
                  <h3 className="font-semibold mb-1">Care Guide</h3>
                  <p className="text-sm text-green-100">Expert advice</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="#f9fafb"/>
        </svg>
      </div>
    </div>
  );
}
