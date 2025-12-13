'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturedPlants from '../components/FeaturedPlants';
import Footer from '../components/Footer';

export default function Home() {
  const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} setUser={setUser} />
      <HeroSection />
      <FeaturedPlants />
      <Footer />
    </div>
  );
}
