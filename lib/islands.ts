/**
 * Island Management
 * Manages islands stored in localStorage for dynamic selection
 */

export interface Island {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'islands';

/**
 * Get all islands
 */
export function getIslands(): Island[] {
  if (typeof window === 'undefined') return getDefaultIslands();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    // Initialize with default islands
    const defaultIslands = getDefaultIslands();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultIslands));
    return defaultIslands;
  } catch (error) {
    console.error('Error loading islands:', error);
    return getDefaultIslands();
  }
}

/**
 * Get active islands only
 */
export function getActiveIslands(): Island[] {
  return getIslands().filter(island => island.isActive);
}

/**
 * Get island by ID
 */
export function getIslandById(id: string): Island | null {
  const islands = getIslands();
  return islands.find(island => island.id === id) || null;
}

/**
 * Save island (create or update)
 */
export function saveIsland(island: Island): void {
  const islands = getIslands();
  const existingIndex = islands.findIndex(i => i.id === island.id);

  if (existingIndex >= 0) {
    // Update existing
    islands[existingIndex] = island;
  } else {
    // Add new
    islands.push(island);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(islands));

  // Dispatch event for listeners
  window.dispatchEvent(new CustomEvent('islands-updated'));
}

/**
 * Delete island
 */
export function deleteIsland(id: string): void {
  const islands = getIslands();
  const filtered = islands.filter(island => island.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

  // Dispatch event for listeners
  window.dispatchEvent(new CustomEvent('islands-updated'));
}

/**
 * Get default islands (Canary Islands)
 */
function getDefaultIslands(): Island[] {
  return [
    {
      id: '1',
      name: 'Gran Canaria',
      slug: 'gran-canaria',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Tenerife',
      slug: 'tenerife',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Lanzarote',
      slug: 'lanzarote',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Fuerteventura',
      slug: 'fuerteventura',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'La Palma',
      slug: 'la-palma',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '6',
      name: 'La Gomera',
      slug: 'la-gomera',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '7',
      name: 'El Hierro',
      slug: 'el-hierro',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];
}

/**
 * Generate slug from name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .trim();
}
