'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Home, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getActiveIslands } from '@/lib/islands';

export default function HeroSearchWidget() {
  const router = useRouter();
  const [islands, setIslands] = useState<Array<{ name: string; slug: string }>>([]);
  const [searchData, setSearchData] = useState({
    location: '',
    accommodationType: '',
    checkIn: '',
    checkOut: '',
  });

  // Load islands
  useEffect(() => {
    const activeIslands = getActiveIslands();
    setIslands(activeIslands.map(island => ({ name: island.name, slug: island.slug })));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Build query parameters
    const params = new URLSearchParams();
    if (searchData.location) params.set('location', searchData.location);
    if (searchData.accommodationType) params.set('type', searchData.accommodationType);
    if (searchData.checkIn) params.set('checkIn', searchData.checkIn);
    if (searchData.checkOut) params.set('checkOut', searchData.checkOut);

    // Redirect to accommodaties page with filters
    const queryString = params.toString();
    const url = `/accommodaties${queryString ? `?${queryString}` : ''}`;

    router.push(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Location */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Bestemming
            </label>
            <select
              value={searchData.location}
              onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
            >
              <option value="">Kies eiland</option>
              {islands.map((island) => (
                <option key={island.slug} value={island.slug}>
                  {island.name}
                </option>
              ))}
            </select>
          </div>

          {/* Accommodation Type */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Home className="inline w-4 h-4 mr-1" />
              Type accommodatie
            </label>
            <select
              value={searchData.accommodationType}
              onChange={(e) => setSearchData({ ...searchData, accommodationType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
            >
              <option value="">Alle types</option>
              <option value="hotel">Hotel</option>
              <option value="resort">Resort</option>
              <option value="appartement">Appartement</option>
              <option value="villa">Villa</option>
              <option value="bungalow">Bungalow</option>
            </select>
          </div>

          {/* Check-in Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Check-in
            </label>
            <input
              type="date"
              value={searchData.checkIn}
              onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>

          {/* Check-out Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Check-out
            </label>
            <input
              type="date"
              value={searchData.checkOut}
              onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-4">
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
          >
            <Search className="w-5 h-5" />
            Zoek accommodaties
          </button>
        </div>
      </form>
    </div>
  );
}
