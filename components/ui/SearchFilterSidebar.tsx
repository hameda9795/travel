'use client';

import { Search, SlidersHorizontal, MapPin, Euro, Star, Users } from 'lucide-react';
import { useState } from 'react';

interface FilterState {
  searchQuery: string;
  accommodationType: string[];
  budget: string;
  rating: string;
  guests: string;
}

export default function SearchFilterSidebar() {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    accommodationType: [],
    budget: '',
    rating: '',
    guests: '',
  });

  const accommodationTypes = [
    { id: 'hotel', label: 'Hotel' },
    { id: 'resort', label: 'Resort' },
    { id: 'appartement', label: 'Appartement' },
    { id: 'villa', label: 'Villa' },
    { id: 'bungalow', label: 'Bungalow' },
  ];

  const budgetRanges = [
    { value: 'budget', label: '€ - Budget (< €100/nacht)' },
    { value: 'midrange', label: '€€ - Middenklasse (€100-200/nacht)' },
    { value: 'luxury', label: '€€€ - Luxe (€200-400/nacht)' },
    { value: 'ultra', label: '€€€€ - Ultra Luxe (> €400/nacht)' },
  ];

  const toggleAccommodationType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      accommodationType: prev.accommodationType.includes(type)
        ? prev.accommodationType.filter((t) => t !== type)
        : [...prev.accommodationType, type],
    }));
  };

  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm sticky top-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary text-white p-2 rounded-lg">
          <SlidersHorizontal className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Zoek & Boek</h2>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Zoeken
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Zoek accommodatie..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Locatie
        </label>
        <select
          className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          defaultValue=""
        >
          <option value="">Alle eilanden</option>
          <option value="gran-canaria">Gran Canaria</option>
          <option value="tenerife">Tenerife</option>
          <option value="lanzarote">Lanzarote</option>
          <option value="fuerteventura">Fuerteventura</option>
        </select>
      </div>

      {/* Accommodation Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Type accommodatie
        </label>
        <div className="space-y-2">
          {accommodationTypes.map((type) => (
            <label key={type.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.accommodationType.includes(type.id)}
                onChange={() => toggleAccommodationType(type.id)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Euro className="w-4 h-4" />
          Budget
        </label>
        <select
          value={filters.budget}
          onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
        >
          <option value="">Selecteer budget</option>
          {budgetRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Star className="w-4 h-4" />
          Minimale beoordeling
        </label>
        <select
          value={filters.rating}
          onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
        >
          <option value="">Alle beoordelingen</option>
          <option value="4">4+ sterren</option>
          <option value="4.5">4.5+ sterren</option>
          <option value="4.8">4.8+ sterren</option>
        </select>
      </div>

      {/* Guests */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Aantal gasten
        </label>
        <select
          value={filters.guests}
          onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
          className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
        >
          <option value="">Selecteer aantal</option>
          <option value="1">1 persoon</option>
          <option value="2">2 personen</option>
          <option value="3-4">3-4 personen</option>
          <option value="5+">5+ personen</option>
        </select>
      </div>

      {/* Apply Button */}
      <button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg">
        Zoek accommodaties
      </button>

      {/* Reset */}
      <button
        onClick={() =>
          setFilters({
            searchQuery: '',
            accommodationType: [],
            budget: '',
            rating: '',
            guests: '',
          })
        }
        className="w-full mt-3 text-sm text-gray-600 hover:text-primary transition-colors"
      >
        Filters wissen
      </button>
    </div>
  );
}
