export interface Accommodation {
  id: string;
  name: string;
  slug: string;
  island: string;
  location: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  pricePerNight: number;
  rating: number; // 1-10
  reviewCount: number;
  stars: number; // 3, 4, or 5
  type: string;
  facilities: string[];
  organization: string;
  isPopular: boolean;
  homePageOrder: number | null; // null = not shown on homepage, 1-6 = display order
  status: 'Gepubliceerd' | 'Concept';
  createdAt: string;
  updatedAt: string;
}

export interface FilterOptions {
  searchQuery?: string;
  islands?: string[];
  locations?: string[];
  types?: string[];
  priceRange?: { min: number; max: number };
  facilities?: string[];
  minStars?: number;
  organizations?: string[];
}

export type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'rating';

// Constants
export const ISLANDS = ['Gran Canaria', 'Tenerife', 'Lanzarote', 'Fuerteventura'];

export const LOCATIONS_BY_ISLAND: Record<string, string[]> = {
  'Gran Canaria': [
    'Playa del Inglés',
    'Puerto Rico',
    'Maspalomas',
    'Puerto de Mogán',
    'Las Palmas',
    'Meloneras',
  ],
  Tenerife: [
    'Playa de las Américas',
    'Los Cristianos',
    'Costa Adeje',
    'Puerto de la Cruz',
  ],
  Lanzarote: ['Puerto del Carmen', 'Playa Blanca', 'Costa Teguise', 'Arrecife'],
  Fuerteventura: ['Corralejo', 'Caleta de Fuste', 'Costa Calma', 'Jandía'],
};

export const ACCOMMODATION_TYPES = [
  'Hotel',
  'Resort',
  'Appartement',
  'Villa',
  'Bungalow',
];

export const FACILITIES = [
  'Zwembad',
  'WiFi',
  'Restaurant',
  'Spa',
  'Parkeren',
  'Kindvriendelijk',
  'All-inclusive',
  'Zeezicht',
  'Fitness',
  'Airco',
];

export const ORGANIZATIONS = ['TUI', 'Corendon', 'Sunweb', 'Prijsvrij', 'D-Reizen'];

const STORAGE_KEY = 'accommodations';

// CRUD Functions
export function getAccommodations(): Accommodation[] {
  // Always allow reading data, even on server
  if (typeof window === 'undefined') {
    return accommodationsData as unknown as Accommodation[];
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with seed data (which is now the json file)
    const seedData = getSeedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData;
  }

  return JSON.parse(stored);
}

export function getAccommodationById(id: string): Accommodation | null {
  const accommodations = getAccommodations();
  return accommodations.find((acc) => acc.id === id) || null;
}

export function getAccommodationBySlug(slug: string): Accommodation | null {
  const accommodations = getAccommodations();
  return accommodations.find((acc) => acc.slug === slug) || null;
}

export function saveAccommodation(accommodation: Accommodation): void {
  const accommodations = getAccommodations();
  const index = accommodations.findIndex((acc) => acc.id === accommodation.id);

  if (index >= 0) {
    // Update existing
    accommodations[index] = {
      ...accommodation,
      updatedAt: new Date().toISOString(),
    };
  } else {
    // Add new
    accommodations.push({
      ...accommodation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(accommodations));
  window.dispatchEvent(new Event('accommodations-updated'));
}

export function deleteAccommodation(id: string): void {
  const accommodations = getAccommodations();
  const filtered = accommodations.filter((acc) => acc.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new Event('accommodations-updated'));
}

// Filter Utilities
export function filterAccommodations(
  accommodations: Accommodation[],
  filters: FilterOptions
): Accommodation[] {
  let filtered = [...accommodations];

  // Only show published on public pages
  if (filters.searchQuery !== undefined) {
    filtered = filtered.filter((acc) => acc.status === 'Gepubliceerd');
  }

  // Search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (acc) =>
        acc.name.toLowerCase().includes(query) ||
        acc.location.toLowerCase().includes(query) ||
        acc.description.toLowerCase().includes(query)
    );
  }

  // Islands
  if (filters.islands && filters.islands.length > 0) {
    filtered = filtered.filter((acc) => filters.islands!.includes(acc.island));
  }

  // Locations
  if (filters.locations && filters.locations.length > 0) {
    filtered = filtered.filter((acc) => filters.locations!.includes(acc.location));
  }

  // Types
  if (filters.types && filters.types.length > 0) {
    filtered = filtered.filter((acc) => filters.types!.includes(acc.type));
  }

  // Price range
  if (filters.priceRange) {
    filtered = filtered.filter(
      (acc) =>
        acc.pricePerNight >= filters.priceRange!.min &&
        acc.pricePerNight <= filters.priceRange!.max
    );
  }

  // Facilities (accommodation must have ALL selected facilities)
  if (filters.facilities && filters.facilities.length > 0) {
    filtered = filtered.filter((acc) =>
      filters.facilities!.every((facility) => acc.facilities.includes(facility))
    );
  }

  // Min stars
  if (filters.minStars) {
    filtered = filtered.filter((acc) => acc.stars >= filters.minStars!);
  }

  // Organizations
  if (filters.organizations && filters.organizations.length > 0) {
    filtered = filtered.filter((acc) =>
      filters.organizations!.includes(acc.organization)
    );
  }

  return filtered;
}

// Sort Utilities
export function sortAccommodations(
  accommodations: Accommodation[],
  sortBy: SortOption
): Accommodation[] {
  const sorted = [...accommodations];

  switch (sortBy) {
    case 'recommended':
      // Sort by popular first, then by rating
      return sorted.sort((a, b) => {
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return b.rating - a.rating;
      });

    case 'price-asc':
      return sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);

    case 'price-desc':
      return sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);

    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);

    default:
      return sorted;
  }
}

// Helper: Generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Seed Data
import accommodationsData from '@/data/accommodations.json';

function getSeedData(): Accommodation[] {
  return accommodationsData as unknown as Accommodation[];
}
