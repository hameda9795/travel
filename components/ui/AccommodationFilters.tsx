'use client';

import { useState, useEffect } from 'react';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import {
  LOCATIONS_BY_ISLAND,
  ACCOMMODATION_TYPES,
  FACILITIES,
  ORGANIZATIONS,
  type FilterOptions,
} from '@/lib/accommodations';
import { getActiveIslands } from '@/lib/islands';

interface AccommodationFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export default function AccommodationFilters({
  onFilterChange,
}: AccommodationFiltersProps) {
  const [islands, setIslands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIslands, setSelectedIslands] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [minStars, setMinStars] = useState<number>(0);
  const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>([]);

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    islands: true,
    locations: true,
    types: true,
    price: true,
    facilities: true,
    stars: true,
    organizations: true,
  });

  // Get available locations based on selected islands
  const availableLocations = selectedIslands.length > 0
    ? selectedIslands.flatMap((island) => LOCATIONS_BY_ISLAND[island] || [])
    : Object.values(LOCATIONS_BY_ISLAND).flat();

  // Load islands
  useEffect(() => {
    const activeIslands = getActiveIslands();
    const islandNames = activeIslands.map(island => island.name);
    setIslands(islandNames);
  }, []);

  // Apply filters whenever any filter changes
  useEffect(() => {
    const filters: FilterOptions = {
      searchQuery: searchQuery || undefined,
      islands: selectedIslands.length > 0 ? selectedIslands : undefined,
      locations: selectedLocations.length > 0 ? selectedLocations : undefined,
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      priceRange:
        priceRange.min > 0 || priceRange.max < 2000 ? priceRange : undefined,
      facilities: selectedFacilities.length > 0 ? selectedFacilities : undefined,
      minStars: minStars > 0 ? minStars : undefined,
      organizations:
        selectedOrganizations.length > 0 ? selectedOrganizations : undefined,
    };

    onFilterChange(filters);
  }, [
    searchQuery,
    selectedIslands,
    selectedLocations,
    selectedTypes,
    priceRange,
    selectedFacilities,
    minStars,
    selectedOrganizations,
    onFilterChange,
  ]);

  // Reset location selection when islands change
  useEffect(() => {
    if (selectedIslands.length > 0) {
      setSelectedLocations((prev) =>
        prev.filter((loc) => availableLocations.includes(loc))
      );
    }
  }, [selectedIslands, availableLocations]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedIslands([]);
    setSelectedLocations([]);
    setSelectedTypes([]);
    setPriceRange({ min: 0, max: 2000 });
    setSelectedFacilities([]);
    setMinStars(0);
    setSelectedOrganizations([]);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleArrayItem = <T,>(
    array: T[],
    item: T,
    setter: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    if (array.includes(item)) {
      setter(array.filter((i) => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Zoek op naam..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Islands Filter */}
      <div className="mb-6 border-b border-border pb-4">
        <button
          onClick={() => toggleSection('islands')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-foreground">Eiland</h3>
          {expandedSections.islands ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.islands && (
          <div className="space-y-2">
            {islands.map((island) => (
              <label key={island} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIslands.includes(island)}
                  onChange={() =>
                    toggleArrayItem(selectedIslands, island, setSelectedIslands)
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{island}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Locations Filter */}
      <div className="mb-6 border-b border-border pb-4">
        <button
          onClick={() => toggleSection('locations')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-foreground">Locatie</h3>
          {expandedSections.locations ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.locations && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableLocations.map((location) => (
              <label key={location} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(location)}
                  onChange={() =>
                    toggleArrayItem(selectedLocations, location, setSelectedLocations)
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{location}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Type Filter */}
      <div className="mb-6 border-b border-border pb-4">
        <button
          onClick={() => toggleSection('types')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-foreground">Type accommodatie</h3>
          {expandedSections.types ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.types && (
          <div className="space-y-2">
            {ACCOMMODATION_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => toggleArrayItem(selectedTypes, type, setSelectedTypes)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="mb-6 border-b border-border pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-foreground">Prijs per nacht</h3>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.price && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-600">Min</label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({
                      ...prev,
                      min: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-1 border border-border rounded text-sm"
                  min="0"
                  max={priceRange.max}
                />
              </div>
              <span className="text-gray-500 mt-5">-</span>
              <div className="flex-1">
                <label className="text-xs text-gray-600">Max</label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({
                      ...prev,
                      max: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-1 border border-border rounded text-sm"
                  min={priceRange.min}
                  max="5000"
                />
              </div>
            </div>
            <div className="text-xs text-gray-600">
              €{priceRange.min} - €{priceRange.max}
            </div>
          </div>
        )}
      </div>

      {/* Facilities Filter */}
      <div className="mb-6 border-b border-border pb-4">
        <button
          onClick={() => toggleSection('facilities')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-foreground">Faciliteiten</h3>
          {expandedSections.facilities ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.facilities && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {FACILITIES.map((facility) => (
              <label key={facility} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFacilities.includes(facility)}
                  onChange={() =>
                    toggleArrayItem(selectedFacilities, facility, setSelectedFacilities)
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{facility}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Star Rating Filter */}
      <div className="mb-6 border-b border-border pb-4">
        <button
          onClick={() => toggleSection('stars')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-foreground">Sterren</h3>
          {expandedSections.stars ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.stars && (
          <div className="space-y-2">
            {[5, 4, 3].map((stars) => (
              <button
                key={stars}
                onClick={() => setMinStars(minStars === stars ? 0 : stars)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  minStars === stars
                    ? 'bg-primary text-white'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <span className="text-sm font-medium">
                  {stars} {'★'.repeat(stars)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Organizations Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('organizations')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-foreground">Reisorganisatie</h3>
          {expandedSections.organizations ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.organizations && (
          <div className="space-y-2">
            {ORGANIZATIONS.map((org) => (
              <label key={org} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedOrganizations.includes(org)}
                  onChange={() =>
                    toggleArrayItem(selectedOrganizations, org, setSelectedOrganizations)
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{org}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
