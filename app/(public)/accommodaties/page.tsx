'use client';

import { useState, useEffect, useMemo } from 'react';
import { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import HotelCard from '@/components/ui/HotelCard';
import AccommodationFilters from '@/components/ui/AccommodationFilters';
import Pagination from '@/components/ui/Pagination';
import {
  getAccommodations,
  filterAccommodations,
  sortAccommodations,
  type Accommodation,
  type FilterOptions,
  type SortOption,
} from '@/lib/accommodations';
import { ArrowUpDown } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export default function AccommodatiesPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [currentPage, setCurrentPage] = useState(1);

  // Load accommodations from localStorage
  useEffect(() => {
    const loadAccommodations = () => {
      const data = getAccommodations();
      setAccommodations(data);
    };

    loadAccommodations();

    // Listen for accommodation updates
    const handleUpdate = () => loadAccommodations();
    window.addEventListener('accommodations-updated', handleUpdate);

    return () => {
      window.removeEventListener('accommodations-updated', handleUpdate);
    };
  }, []);

  // Apply filters and sorting
  const processedAccommodations = useMemo(() => {
    let result = filterAccommodations(accommodations, filters);
    result = sortAccommodations(result, sortBy);
    return result;
  }, [accommodations, filters, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(processedAccommodations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedAccommodations = processedAccommodations.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Accommodaties', href: '/accommodaties' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with Filters */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-4">
              <AccommodationFilters onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Accommodaties
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-gray-600">
                  {processedAccommodations.length} resultaten gevonden
                </p>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-500" />
                  <label htmlFor="sort" className="text-sm text-gray-600">
                    Sorteer op:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                  >
                    <option value="recommended">Aanbevolen</option>
                    <option value="price-asc">Prijs: Laag - Hoog</option>
                    <option value="price-desc">Prijs: Hoog - Laag</option>
                    <option value="rating">Beoordeling</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Accommodations Grid */}
            {displayedAccommodations.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 mb-8">
                  {displayedAccommodations.map((accommodation) => (
                    <HotelCard
                      key={accommodation.id}
                      name={accommodation.name}
                      slug={`/accommodaties/${accommodation.slug}`}
                      location={`${accommodation.location}, ${accommodation.island}`}
                      description={accommodation.description}
                      imageUrl={accommodation.imageUrl}
                      rating={accommodation.rating}
                      reviewCount={accommodation.reviewCount}
                      pricePerNight={accommodation.pricePerNight}
                      stars={accommodation.stars}
                      isPopular={accommodation.isPopular}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-md border border-border p-12 text-center">
                <p className="text-gray-600 text-lg">
                  Geen accommodaties gevonden met de huidige filters.
                </p>
                <p className="text-gray-500 mt-2">
                  Probeer andere filters te selecteren.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
