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
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Initialize with seed data
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
function getSeedData(): Accommodation[] {
  return [
    {
      id: '1',
      name: 'Abora Buenaventura by Lopesan',
      slug: 'abora-buenaventura-by-lopesan',
      island: 'Gran Canaria',
      location: 'Playa del Inglés',
      description:
        'Modern hotel met prachtig zwembad en direct toegang tot het strand. Ideaal voor gezinnen en stellen die op zoek zijn naar zon en ontspanning.',
      imageUrl:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      imageAlt: 'Abora Buenaventura hotel met zwembad',
      pricePerNight: 754,
      rating: 8.5,
      reviewCount: 1247,
      stars: 4,
      type: 'Hotel',
      facilities: ['Zwembad', 'WiFi', 'Parkeren', 'Airco'],
      organization: 'TUI',
      isPopular: true,
      homePageOrder: 1,
      status: 'Gepubliceerd',
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z',
    },
    {
      id: '2',
      name: 'Cordial Santa Agueda',
      slug: 'cordial-santa-agueda',
      island: 'Gran Canaria',
      location: 'Arguineguín',
      description:
        'Luxe appartement complex met alle gemakken. Perfect voor wie rust en privacy zoekt op loopafstand van het strand.',
      imageUrl:
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      imageAlt: 'Cordial Santa Agueda resort',
      pricePerNight: 926,
      rating: 9.2,
      reviewCount: 856,
      stars: 5,
      type: 'Appartement',
      facilities: ['Zwembad', 'WiFi', 'Parkeren', 'Airco'],
      organization: 'TUI',
      isPopular: false,
      homePageOrder: 2,
      status: 'Gepubliceerd',
      createdAt: '2024-01-16T10:00:00.000Z',
      updatedAt: '2024-01-16T10:00:00.000Z',
    },
    {
      id: '3',
      name: 'Montemayor',
      slug: 'montemayor',
      island: 'Gran Canaria',
      location: 'Playa del Inglés',
      description:
        'Gezellig appartementencomplex op korte loopafstand van het strand en het centrum. Ideaal voor actieve vakantiegangers.',
      imageUrl:
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
      imageAlt: 'Montemayor appartementen',
      pricePerNight: 829,
      rating: 7.8,
      reviewCount: 623,
      stars: 3,
      type: 'Appartement',
      facilities: ['Zwembad', 'WiFi'],
      organization: 'TUI',
      isPopular: false,
      homePageOrder: 3,
      status: 'Gepubliceerd',
      createdAt: '2024-01-17T10:00:00.000Z',
      updatedAt: '2024-01-17T10:00:00.000Z',
    },
    {
      id: '4',
      name: 'Tajaraste',
      slug: 'tajaraste',
      island: 'Gran Canaria',
      location: 'Playa del Inglés',
      description:
        'Comfortabele appartementen met groot zwembad en zonneterras. Uitstekende prijs-kwaliteit verhouding voor een zorgeloze vakantie.',
      imageUrl:
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
      imageAlt: 'Tajaraste complex',
      pricePerNight: 703,
      rating: 8.1,
      reviewCount: 912,
      stars: 4,
      type: 'Appartement',
      facilities: ['Zwembad', 'WiFi', 'Zeezicht'],
      organization: 'TUI',
      isPopular: false,
      homePageOrder: 4,
      status: 'Gepubliceerd',
      createdAt: '2024-01-18T10:00:00.000Z',
      updatedAt: '2024-01-18T10:00:00.000Z',
    },
    {
      id: '5',
      name: 'Rio Piedras',
      slug: 'rio-piedras',
      island: 'Gran Canaria',
      location: 'Puerto Rico',
      description:
        'Modern appartementencomplex in het levendige Puerto Rico. Direct aan het strand met prachtig uitzicht op de baai.',
      imageUrl:
        'https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800&q=80',
      imageAlt: 'Rio Piedras Puerto Rico',
      pricePerNight: 696,
      rating: 8.7,
      reviewCount: 1534,
      stars: 4,
      type: 'Appartement',
      facilities: ['Zwembad', 'WiFi', 'Parkeren', 'Zeezicht'],
      organization: 'TUI',
      isPopular: false,
      homePageOrder: 5,
      status: 'Gepubliceerd',
      createdAt: '2024-01-19T10:00:00.000Z',
      updatedAt: '2024-01-19T10:00:00.000Z',
    },
    {
      id: '6',
      name: 'Roca Verde',
      slug: 'roca-verde',
      island: 'Gran Canaria',
      location: 'Playa del Inglés',
      description:
        'Rustige appartementen omringd door tropische tuinen. Perfect voor wie zoekt naar ontspanning in een groene omgeving.',
      imageUrl:
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
      imageAlt: 'Roca Verde appartementen',
      pricePerNight: 550,
      rating: 7.5,
      reviewCount: 445,
      stars: 3,
      type: 'Appartement',
      facilities: ['Zwembad', 'WiFi', 'Parkeren'],
      organization: 'TUI',
      isPopular: false,
      homePageOrder: 6,
      status: 'Gepubliceerd',
      createdAt: '2024-01-20T10:00:00.000Z',
      updatedAt: '2024-01-20T10:00:00.000Z',
    },
    {
      id: '7',
      name: 'RIU Gran Canaria Golf',
      slug: 'riu-gran-canaria-golf',
      island: 'Gran Canaria',
      location: 'Meloneras',
      description:
        'Luxe resort hotel met golfbaan, spa en meerdere restaurants. All-inclusive genieten in stijlvolle omgeving.',
      imageUrl:
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
      imageAlt: 'RIU Gran Canaria Golf resort',
      pricePerNight: 1258,
      rating: 9.0,
      reviewCount: 2134,
      stars: 5,
      type: 'Hotel',
      facilities: [
        'Zwembad',
        'WiFi',
        'Restaurant',
        'Spa',
        'Parkeren',
        'All-inclusive',
        'Fitness',
        'Airco',
      ],
      organization: 'TUI',
      isPopular: true,
      homePageOrder: null,
      status: 'Gepubliceerd',
      createdAt: '2024-01-21T10:00:00.000Z',
      updatedAt: '2024-01-21T10:00:00.000Z',
    },
    {
      id: '8',
      name: 'Bull Eugenia Victoria & Spa',
      slug: 'bull-eugenia-victoria-spa',
      island: 'Gran Canaria',
      location: 'Playa del Inglés',
      description:
        'Elegant hotel met uitgebreide spa faciliteiten. Ideaal voor een wellness vakantie met zon, zee en strand.',
      imageUrl:
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
      imageAlt: 'Bull Eugenia Victoria Hotel',
      pricePerNight: 761,
      rating: 8.3,
      reviewCount: 1876,
      stars: 4,
      type: 'Hotel',
      facilities: ['Zwembad', 'WiFi', 'Restaurant', 'Spa', 'Parkeren', 'Fitness', 'Airco'],
      organization: 'TUI',
      isPopular: false,
      homePageOrder: null,
      status: 'Gepubliceerd',
      createdAt: '2024-01-22T10:00:00.000Z',
      updatedAt: '2024-01-22T10:00:00.000Z',
    },
    {
      id: '9',
      name: 'Lopesan Costa Meloneras Resort & Spa',
      slug: 'lopesan-costa-meloneras-resort-spa',
      island: 'Gran Canaria',
      location: 'Meloneras',
      description:
        'Prestigieus 5-sterren resort met spectaculaire architectuur en eersteklas service. Ultieme luxe en comfort aan de kust.',
      imageUrl:
        'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&q=80',
      imageAlt: 'Lopesan Costa Meloneras Resort',
      pricePerNight: 1114,
      rating: 9.3,
      reviewCount: 3245,
      stars: 5,
      type: 'Resort',
      facilities: [
        'Zwembad',
        'WiFi',
        'Restaurant',
        'Spa',
        'Parkeren',
        'Kindvriendelijk',
        'Zeezicht',
        'Fitness',
        'Airco',
      ],
      organization: 'TUI',
      isPopular: true,
      homePageOrder: null,
      status: 'Gepubliceerd',
      createdAt: '2024-01-23T10:00:00.000Z',
      updatedAt: '2024-01-23T10:00:00.000Z',
    },
    {
      id: '10',
      name: 'Babacan',
      slug: 'babacan',
      island: 'Gran Canaria',
      location: 'Playa del Inglés',
      description:
        'Gezellig aparthotel met vriendelijke sfeer en goede faciliteiten. Perfecte uitvalsbasis voor een betaalbare strandvakantie.',
      imageUrl:
        'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&q=80',
      imageAlt: 'Babacan aparthotel',
      pricePerNight: 686,
      rating: 7.9,
      reviewCount: 734,
      stars: 3,
      type: 'Appartement',
      facilities: ['Zwembad', 'WiFi', 'Parkeren', 'Airco'],
      organization: 'TUI',
      isPopular: false,
      homePageOrder: null,
      status: 'Gepubliceerd',
      createdAt: '2024-01-24T10:00:00.000Z',
      updatedAt: '2024-01-24T10:00:00.000Z',
    },
    {
      id: '11',
      name: 'H10 Gran Tinerfe',
      slug: 'h10-gran-tinerfe',
      island: 'Tenerife',
      location: 'Playa de las Américas',
      description:
        'Modern 4-sterren hotel direct aan het strand van Playa de las Américas. Volledige renovatie met eigentijdse kamers en faciliteiten.',
      imageUrl:
        'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800&q=80',
      imageAlt: 'H10 Gran Tinerfe hotel Tenerife',
      pricePerNight: 845,
      rating: 8.6,
      reviewCount: 1923,
      stars: 4,
      type: 'Hotel',
      facilities: ['Zwembad', 'WiFi', 'Restaurant', 'Parkeren', 'Fitness', 'Airco'],
      organization: 'Corendon',
      isPopular: true,
      homePageOrder: null,
      status: 'Gepubliceerd',
      createdAt: '2024-01-25T10:00:00.000Z',
      updatedAt: '2024-01-25T10:00:00.000Z',
    },
    {
      id: '12',
      name: 'Bitacora',
      slug: 'bitacora',
      island: 'Tenerife',
      location: 'Playa de las Américas',
      description:
        'Populair familiehotel met uitstekende all-inclusive formule. Ruime zwembaden en animatie voor alle leeftijden.',
      imageUrl:
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
      imageAlt: 'Hotel Bitacora Tenerife',
      pricePerNight: 892,
      rating: 8.4,
      reviewCount: 2156,
      stars: 4,
      type: 'Hotel',
      facilities: [
        'Zwembad',
        'WiFi',
        'Restaurant',
        'Parkeren',
        'Kindvriendelijk',
        'All-inclusive',
        'Airco',
      ],
      organization: 'TUI',
      isPopular: false,
      homePageOrder: null,
      status: 'Gepubliceerd',
      createdAt: '2024-01-26T10:00:00.000Z',
      updatedAt: '2024-01-26T10:00:00.000Z',
    },
    {
      id: '13',
      name: 'Royal Hideaway Corales Suites',
      slug: 'royal-hideaway-corales-suites',
      island: 'Tenerife',
      location: 'Costa Adeje',
      description:
        'Exclusief 5-sterren resort met Michelinster restaurant en infinity pools. Absolute luxe met spectaculair uitzicht op de Atlantische Oceaan.',
      imageUrl:
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
      imageAlt: 'Royal Hideaway Corales Suites',
      pricePerNight: 1650,
      rating: 9.7,
      reviewCount: 876,
      stars: 5,
      type: 'Resort',
      facilities: [
        'Zwembad',
        'WiFi',
        'Restaurant',
        'Spa',
        'Parkeren',
        'Zeezicht',
        'Fitness',
        'Airco',
      ],
      organization: 'Sunweb',
      isPopular: true,
      homePageOrder: null,
      status: 'Gepubliceerd',
      createdAt: '2024-01-27T10:00:00.000Z',
      updatedAt: '2024-01-27T10:00:00.000Z',
    },
    {
      id: '14',
      name: 'Papagayo Beach Resort',
      slug: 'papagayo-beach-resort',
      island: 'Lanzarote',
      location: 'Playa Blanca',
      description:
        'Luxe strandresort met privéstrand en spa. Moderne kamers met zeezicht en uitstekende Canarische keuken in het restaurant.',
      imageUrl:
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      imageAlt: 'Papagayo Beach Resort Lanzarote',
      pricePerNight: 1120,
      rating: 9.1,
      reviewCount: 1456,
      stars: 5,
      type: 'Resort',
      facilities: [
        'Zwembad',
        'WiFi',
        'Restaurant',
        'Spa',
        'Parkeren',
        'Zeezicht',
        'Fitness',
        'Airco',
      ],
      organization: 'Prijsvrij',
      isPopular: true,
      homePageOrder: null,
      status: 'Gepubliceerd',
      createdAt: '2024-01-28T10:00:00.000Z',
      updatedAt: '2024-01-28T10:00:00.000Z',
    },
    {
      id: '15',
      name: 'Los Hibiscos',
      slug: 'los-hibiscos',
      island: 'Lanzarote',
      location: 'Puerto del Carmen',
      description:
        'Charmante appartementen in tropische tuin met verwarmde zwembaden. Ideale locatie op loopafstand van strand en boulevard.',
      imageUrl:
        'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=800&q=80',
      imageAlt: 'Los Hibiscos Lanzarote',
      pricePerNight: 695,
      rating: 8.2,
      reviewCount: 1087,
      stars: 3,
      type: 'Appartement',
      facilities: ['Zwembad', 'WiFi', 'Parkeren', 'Airco'],
      organization: 'Corendon',
      isPopular: false,
      homePageOrder: null,
      status: 'Gepubliceerd',
      createdAt: '2024-01-29T10:00:00.000Z',
      updatedAt: '2024-01-29T10:00:00.000Z',
    },
    {
      id: '16',
      name: 'Barceló Castillo Beach Resort',
      slug: 'barcelo-castillo-beach-resort',
      island: 'Fuerteventura',
      location: 'Caleta de Fuste',
      description:
        'Groot familieresort direct aan zee met uitgebreid activiteitenprogramma. Perfect voor gezinnen die alles op één plek willen.',
      imageUrl:
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80',
      imageAlt: 'Barceló Castillo Beach Resort',
      pricePerNight: 978,
      rating: 8.8,
      reviewCount: 2345,
      stars: 4,
      type: 'Resort',
      facilities: [
        'Zwembad',
        'WiFi',
        'Restaurant',
        'Spa',
        'Parkeren',
        'Kindvriendelijk',
        'All-inclusive',
        'Fitness',
        'Airco',
      ],
      organization: 'TUI',
      isPopular: true,
      homePageOrder: null,
      status: 'Gepubliceerd',
      createdAt: '2024-01-30T10:00:00.000Z',
      updatedAt: '2024-01-30T10:00:00.000Z',
    },
    {
      id: '17',
      name: 'Atlantis Dunapark',
      slug: 'atlantis-dunapark',
      island: 'Fuerteventura',
      location: 'Corralejo',
      description:
        'Moderne appartementen met zwembadcomplex en alle gemakken. Uitstekende uitvalsbasis om Corralejo en de duinen te ontdekken.',
      imageUrl:
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
      imageAlt: 'Atlantis Dunapark Fuerteventura',
      pricePerNight: 745,
      rating: 8.0,
      reviewCount: 923,
      stars: 4,
      type: 'Appartement',
      facilities: ['Zwembad', 'WiFi', 'Parkeren', 'Airco'],
      organization: 'D-Reizen',
      isPopular: false,
      homePageOrder: null,
      status: 'Gepubliceerd',
      createdAt: '2024-01-31T10:00:00.000Z',
      updatedAt: '2024-01-31T10:00:00.000Z',
    },
    {
      id: '18',
      name: 'Seaside Los Jameos Playa',
      slug: 'seaside-los-jameos-playa',
      island: 'Lanzarote',
      location: 'Puerto del Carmen',
      description:
        'Luxe adults-only resort direct aan het strand. Rust, comfort en service van topniveau voor een zorgeloze vakantie.',
      imageUrl:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      imageAlt: 'Seaside Los Jameos Playa',
      pricePerNight: 1234,
      rating: 9.4,
      reviewCount: 1567,
      stars: 5,
      type: 'Hotel',
      facilities: [
        'Zwembad',
        'WiFi',
        'Restaurant',
        'Spa',
        'Parkeren',
        'Zeezicht',
        'Fitness',
        'Airco',
      ],
      organization: 'Sunweb',
      isPopular: true,
      homePageOrder: null,
      status: 'Gepubliceerd',
      createdAt: '2024-02-01T10:00:00.000Z',
      updatedAt: '2024-02-01T10:00:00.000Z',
    },
  ];
}
