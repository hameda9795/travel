'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  getAccommodations,
  deleteAccommodation,
  type Accommodation,
} from '@/lib/accommodations';
import { getActiveIslands } from '@/lib/islands';
import { Plus, Pencil, Trash2, Eye, Search, Database } from 'lucide-react';
import { getDemoData } from '@/app/actions/demo';

export default function AdminAccommodationsPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [islands, setIslands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIsland, setFilterIsland] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [accommodationToDelete, setAccommodationToDelete] = useState<string | null>(null);

  // Load islands
  useEffect(() => {
    loadIslands();

    // Listen for updates
    const handleUpdate = () => loadIslands();
    window.addEventListener('islands-updated', handleUpdate);

    return () => {
      window.removeEventListener('islands-updated', handleUpdate);
    };
  }, []);

  // Load accommodations
  useEffect(() => {
    loadAccommodations();

    // Listen for updates
    const handleUpdate = () => loadAccommodations();
    window.addEventListener('accommodations-updated', handleUpdate);

    return () => {
      window.removeEventListener('accommodations-updated', handleUpdate);
    };
  }, []);

  const loadAccommodations = () => {
    const data = getAccommodations();
    setAccommodations(data);
    setFilteredAccommodations(data);
  };

  const loadIslands = () => {
    const activeIslands = getActiveIslands();
    const islandNames = activeIslands.map(island => island.name);
    setIslands(islandNames);
  };

  const handleLoadDemoData = async () => {
    if (confirm('Weet je zeker dat je de demo data wilt laden? Dit overschrijft alle lokale wijzigingen.')) {
      try {
        const demoData = await getDemoData();
        localStorage.setItem('accommodations', JSON.stringify(demoData));
        window.dispatchEvent(new Event('accommodations-updated'));
        loadAccommodations();
        alert('Demo data succesvol geladen!');
      } catch (error) {
        console.error('Failed to load demo data:', error);
        alert('Er is een fout opgetreden bij het laden van de demo data.');
      }
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...accommodations];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (acc) =>
          acc.name.toLowerCase().includes(query) ||
          acc.location.toLowerCase().includes(query)
      );
    }

    // Island filter
    if (filterIsland) {
      filtered = filtered.filter((acc) => acc.island === filterIsland);
    }

    // Type filter
    if (filterType) {
      filtered = filtered.filter((acc) => acc.type === filterType);
    }

    // Status filter
    if (filterStatus) {
      filtered = filtered.filter((acc) => acc.status === filterStatus);
    }

    setFilteredAccommodations(filtered);
  }, [accommodations, searchQuery, filterIsland, filterType, filterStatus]);

  const handleDelete = (id: string) => {
    setAccommodationToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (accommodationToDelete) {
      deleteAccommodation(accommodationToDelete);
      setDeleteModalOpen(false);
      setAccommodationToDelete(null);
    }
  };

  const updateHomePageOrder = (id: string, order: number | null) => {
    const updatedAccommodations = accommodations.map(acc =>
      acc.id === id ? { ...acc, homePageOrder: order } : acc
    );
    localStorage.setItem('accommodations', JSON.stringify(updatedAccommodations));
    window.dispatchEvent(new Event('accommodations-updated'));
    loadAccommodations();
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterIsland('');
    setFilterType('');
    setFilterStatus('');
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accommodaties Beheer</h1>
          <p className="text-gray-600 mt-1">
            Beheer alle accommodaties ({filteredAccommodations.length} van {accommodations.length})
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleLoadDemoData}
            className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors"
            title="Herstel demo data vanuit database"
          >
            <Database className="w-5 h-5" />
            Demo Data
          </button>
          <Link
            href="/admin/accommodaties/new"
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nieuwe Accommodatie
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek op naam of locatie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Island Filter */}
          <select
            value={filterIsland}
            onChange={(e) => setFilterIsland(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Alle Eilanden</option>
            {islands.map((island) => (
              <option key={island} value={island}>
                {island}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Alle Types</option>
            <option value="Hotel">Hotel</option>
            <option value="Resort">Resort</option>
            <option value="Appartement">Appartement</option>
            <option value="Villa">Villa</option>
            <option value="Bungalow">Bungalow</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Alle Statussen</option>
            <option value="Gepubliceerd">Gepubliceerd</option>
            <option value="Concept">Concept</option>
          </select>
        </div>

        {/* Reset Filters Button */}
        {(searchQuery || filterIsland || filterType || filterStatus) && (
          <div className="mt-4">
            <button
              onClick={resetFilters}
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredAccommodations.length > 0 ? (
          <div className="w-full">
            <table className="w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[5%]">
                    Img
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[25%]">
                    Naam
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[12%]">
                    Locatie
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]">
                    Type
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]">
                    Prijs
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[6%]">
                    Stars
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[12%]">
                    Status
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[8%]">
                    Home P
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[12%]">
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccommodations.map((accommodation) => (
                  <tr key={accommodation.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                        <Image
                          src={accommodation.imageUrl}
                          alt={accommodation.imageAlt}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-semibold text-gray-900 mb-0.5">
                        {accommodation.name}
                        {accommodation.isPopular && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 uppercase tracking-wide">
                            POP
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate font-mono bg-gray-50 inline-block px-1.5 py-0.5 rounded border border-gray-100 max-w-full">
                        {accommodation.slug}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate">{accommodation.location}</div>
                      <div className="text-xs text-gray-500 truncate">{accommodation.island}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {accommodation.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        €{accommodation.pricePerNight}
                        <span className="text-gray-400 font-normal text-xs ml-1">/n</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-sm font-bold text-gray-900">{accommodation.stars}</span>
                        <span className="text-yellow-400 text-sm">★</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${accommodation.status === 'Gepubliceerd'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}
                      >
                        {accommodation.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <select
                        value={accommodation.homePageOrder ?? ''}
                        onChange={(e) => updateHomePageOrder(accommodation.id, e.target.value ? parseInt(e.target.value) : null)}
                        className={`text-xs border rounded-md px-2 py-1.5 focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer outline-none transition-all w-full ${accommodation.homePageOrder
                            ? 'bg-primary/5 border-primary/20 text-primary font-medium'
                            : 'bg-gray-50 border-gray-200 text-gray-400'
                          }`}
                      >
                        <option value="">-</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1 opacity-100">
                        <Link
                          href={`/accommodaties/${accommodation.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                          title="Bekijk"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/accommodaties/edit/${accommodation.id}`}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-teal-50 rounded-md transition-all"
                          title="Bewerk"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(accommodation.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                          title="Verwijder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Geen accommodaties gevonden</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Accommodatie verwijderen
            </h2>
            <p className="text-gray-600 mb-6">
              Weet je zeker dat je deze accommodatie wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Verwijderen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
