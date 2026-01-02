'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';
import Link from 'next/link';

export default function ContentManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    const loadArticles = () => {
      const loaded: any[] = [];
      if (typeof window !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('page-')) {
            try {
              const item = localStorage.getItem(key);
              if (item) {
                const parsed = JSON.parse(item);
                loaded.push({
                  ...parsed,
                  id: parsed.slug,
                  author: 'Admin',
                  views: 0,
                  date: parsed.createdAt || new Date().toISOString()
                });
              }
            } catch (e) {
              console.error('Failed to load article', key);
            }
          }
        }
      }
      setArticles(loaded.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    loadArticles();
    window.addEventListener('content-updated', loadArticles);
    return () => window.removeEventListener('content-updated', loadArticles);
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesStatus = filterStatus === 'all' || article.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (slug: string, title: string) => {
    if (confirm(`Weet u zeker dat u "${title}" wilt verwijderen?`)) {
      localStorage.removeItem(`page-${slug}`);
      window.dispatchEvent(new Event('content-updated'));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Beheer</h1>
          <p className="text-gray-600 mt-2">
            Beheer alle content: artikelen, menu items, sub-items, eilanden - alles met een slug
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (confirm('Waarschuwing: Dit verwijdert ALLE bestaande artikelen en genereert nieuwe content gebaseerd op de MENU structuur. Doorgaan?')) {
                // 1. Gather all slugs we need to generate content for from the Menu
                const menuString = localStorage.getItem('site-menu');
                const menuItems = menuString ? JSON.parse(menuString) : [];

                // Helper to generate a random image
                const getRandomImage = (keyword: string) => {
                  const images = [
                    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=1600", // Dunes
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600", // Beach
                    "https://images.unsplash.com/photo-1542488661-ca31d798670d?auto=format&fit=crop&q=80&w=1600", // Teide
                    "https://images.unsplash.com/photo-1588523326164-889814c8182f?auto=format&fit=crop&q=80&w=1600", // Volcano
                    "https://images.unsplash.com/photo-1533560649706-d0cb65862b5d?auto=format&fit=crop&q=80&w=1600", // Beach 2
                    "https://images.unsplash.com/photo-1589139890693-e4d3c63865d2?auto=format&fit=crop&q=80&w=1600", // Nature
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop", // Hotel pool
                    "https://images.unsplash.com/photo-1611391228629-c3742422cef9?w=800&h=500&fit=crop", // Beach 3
                    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop", // Food
                    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=500&fit=crop", // Hiking
                    "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=500&fit=crop", // Landscape
                    "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&h=500&fit=crop"  // Surfing
                  ];
                  return images[Math.floor(Math.random() * images.length)];
                };

                const generateArticle = (title: string, slug: string, category: string) => {
                  // Extract island name if present in title or slug, default to Gran Canaria
                  let island = "Gran Canaria";
                  if (title.includes("Tenerife") || slug.includes("tenerife")) island = "Tenerife";
                  if (title.includes("Lanzarote") || slug.includes("lanzarote")) island = "Lanzarote";
                  if (title.includes("Fuerteventura") || slug.includes("fuerteventura")) island = "Fuerteventura";
                  if (title.includes("Gomera") || slug.includes("gomera")) island = "La Gomera";
                  if (title.includes("Palma") || slug.includes("palma")) island = "La Palma";
                  if (title.includes("Hierro") || slug.includes("hierro")) island = "El Hierro";

                  return {
                    title: title,
                    slug: slug.replace(/^\//, ''), // Remove leading slash
                    excerpt: `Ontdek alles over ${title}. De beste tips, bezienswaardigheden en informatie voor uw vakantie naar de Canarische Eilanden.`,
                    metaTitle: `${title} | Canarische Eilanden Tips`,
                    metaDescription: `Alles wat u moet weten over ${title}. Lees onze uitgebreide gids met tips en bezienswaardigheden.`,
                    keywords: `${title}, vakantie, Canarische Eilanden, ${island}`,
                    island: island,
                    category: category || "Algemeen",
                    cluster: "Algemeen",
                    featuredImage: getRandomImage(title),
                    featuredImageAlt: title,
                    featuredMediaType: "url",
                    status: "Gepubliceerd",
                    createdAt: new Date().toISOString(),
                    contentBlocks: [
                      {
                        id: Date.now().toString() + Math.random(),
                        type: "heading",
                        level: "H2",
                        heading: `Waarom ${title}?`,
                        content: `De Canarische Eilanden zijn een fantastische bestemming, en ${title} is daarop geen uitzondering. Of u nu op zoek bent naar rust, natuur, strand of cultuur, hier vindt u het allemaal.`
                      },
                      {
                        id: Date.now().toString() + Math.random(),
                        type: "paragraph",
                        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                      },
                      {
                        id: Date.now().toString() + Math.random(),
                        type: "image",
                        mediaType: "url",
                        imageUrl: getRandomImage(title),
                        imageAlt: `Sfeerimpressie ${title}`
                      },
                      {
                        id: Date.now().toString() + Math.random(),
                        type: "heading",
                        level: "H2",
                        heading: "Tips en Bezienswaardigheden",
                        content: "Hieronder vindt u enkele hoogtepunten die u niet mag missen."
                      },
                      {
                        id: Date.now().toString() + Math.random(),
                        type: "paragraph",
                        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident."
                      }
                    ]
                  };
                };

                const newArticles: any[] = [];

                // 2. Iterate Menu Items (Roots)
                menuItems.forEach((item: any) => {
                  // Create page for the main menu item itself
                  if (item.slug) {
                    newArticles.push(generateArticle(item.title, item.slug, "Algemeen"));
                  }

                  // Iterate Columns
                  if (item.columns) {
                    item.columns.forEach((col: any) => {
                      const categoryName = col.title || "Algemeen";
                      if (col.items) {
                        col.items.forEach((sub: any) => {
                          if (sub.href) {
                            newArticles.push(generateArticle(sub.label, sub.href, categoryName));
                          }
                        });
                      }
                    });
                  }
                });

                // If no menu items exist, add the basic demo set as fallback + some generic pages
                if (newArticles.length === 0) {
                  // Fallback to the previous hardcoded list if menu is empty
                  const demoArticles = [
                    { title: "Gran Canaria", slug: "gran-canaria", category: "Eiland" },
                    { title: "Tenerife", slug: "tenerife", category: "Eiland" },
                    { title: "Maspalomas", slug: "gran-canaria/maspalomas", category: "Plaatsen" },
                    { title: "Playa del Ingles", slug: "gran-canaria/playa-del-ingles", category: "Plaatsen" },
                    { title: "Teide Nationaal Park", slug: "tenerife/teide", category: "Natuur" },
                  ];
                  demoArticles.forEach(a => newArticles.push(generateArticle(a.title, a.slug, a.category)));
                }

                // 3. Clear existing articles
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  if (key && key.startsWith('page-')) keysToRemove.push(key);
                }
                keysToRemove.forEach(k => localStorage.removeItem(k));

                // 4. Save new articles
                newArticles.forEach(article => {
                  // Ensure no double slashes in keys just in case
                  const safeSlug = article.slug.replace(/^\/+/, '');
                  localStorage.setItem(`page-${safeSlug}`, JSON.stringify(article));
                });

                window.dispatchEvent(new Event('content-updated'));
                alert(`${newArticles.length} demo artikelen aangemaakt gebaseerd op het menu!`);
              }
            }}
            className="inline-flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            title="Genereer content voor ALLE menu items"
          >
            <Trash2 className="w-5 h-5" />
            Genereer Menu Content
          </button>

          <Link
            href="/admin/content/new"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nieuwe Content
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek artikelen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
          >
            <option value="all">Alle Statussen</option>
            <option value="Gepubliceerd">Gepubliceerd</option>
            <option value="Concept">Concept</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weergaves
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datum
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {article.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Door {article.author}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full border ${article.contentType === 'menu'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                    >
                      {article.contentType === 'menu' ? 'Menu' : 'Artikel'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${article.status === 'Gepubliceerd'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Eye className="w-4 h-4" />
                      {article.views.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(article.date).toLocaleDateString('nl-NL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/content/${article.slug}`}
                        className="text-primary hover:text-primary-dark p-2 rounded-lg hover:bg-primary/10 transition-colors"
                        title="Bewerken"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Verwijderen"
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

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Geen artikelen gevonden</p>
          </div>
        )}
      </div>
    </div>
  );
}
