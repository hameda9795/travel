'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';

interface ArticleItem {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  island: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
  featuredImage?: string; // fallback
  featured: boolean;
  status?: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIsland, setFilterIsland] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    // Load articles from localStorage
    const loadArticles = () => {
      const loaded: ArticleItem[] = [];
      if (typeof window !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('page-')) {
            try {
              const item = JSON.parse(localStorage.getItem(key) || '{}');

              // Only show published items that are NOT menu pages
              // We default to 'article' if contentType is missing for backward compatibility
              const isArticle = !item.contentType || item.contentType === 'article';

              if (item.status === 'Gepubliceerd' && isArticle) {
                loaded.push({
                  slug: item.slug,
                  title: item.title,
                  excerpt: item.excerpt,
                  island: item.island || 'Overig',
                  category: item.category || 'Algemeen',
                  author: 'Redactie', // Default as we don't save author yet
                  date: item.createdAt || new Date().toISOString(),
                  readTime: '5 min', // Mock read time
                  imageUrl: item.featuredImage || 'https://via.placeholder.com/800x600',
                  featured: false, // Could add logic for this later
                });
              }
            } catch (e) {
              console.error("Error parsing article", key, e);
            }
          }
        }
      }
      // Sort by date desc
      loaded.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Mark newest as featured if exists
      if (loaded.length > 0) loaded[0].featured = true;

      setArticles(loaded);
      setLoading(false);
    };

    loadArticles();
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIsland = !filterIsland || article.island.toLowerCase() === filterIsland.toLowerCase();
    const matchesCategory = !filterCategory || article.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesIsland && matchesCategory;
  });

  const featuredArticle = filteredArticles.find(a => a.featured);
  const regularArticles = filteredArticles.filter(a => a !== featuredArticle);

  if (loading) {
    return (
      <div className="bg-background min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl text-gray-500">Artikelen laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Reisartikelen & Tips
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert advies, inspiratie en praktische tips voor uw reis naar de Canarische Eilanden
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl border border-border p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoek artikelen..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <select
              value={filterIsland}
              onChange={(e) => setFilterIsland(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
            >
              <option value="">Alle Eilanden</option>
              <option value="Gran Canaria">Gran Canaria</option>
              <option value="Tenerife">Tenerife</option>
              <option value="Lanzarote">Lanzarote</option>
              <option value="Fuerteventura">Fuerteventura</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
            >
              <option value="">Alle Categorieën</option>
              <option value="Hotels">Hotels</option>
              <option value="Stranden">Stranden</option>
              <option value="Eten & Drinken">Eten & Drinken</option>
              <option value="Natuur & Wandelen">Natuur & Wandelen</option>
              <option value="Cultuur">Cultuur</option>
              <option value="Activiteiten">Activiteiten</option>
            </select>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">Nog geen artikelen beschikbaar.</p>
            <div className="mt-4">
              <Link href="/admin/content" className="text-primary hover:underline">
                Ga naar content beheer om artikelen toe te voegen of demo data te laden.
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredArticle && (
              <Link
                href={`/${featuredArticle.slug}`}
                className="block mb-12 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-border"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-80 md:h-auto">
                    <Image
                      src={featuredArticle.imageUrl}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-secondary text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Uitgelicht
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {featuredArticle.island}
                      </span>
                      <span className="text-gray-500 text-sm">{featuredArticle.category}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-gray-700 mb-6 line-clamp-3">{featuredArticle.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(featuredArticle.date).toLocaleDateString('nl-NL')}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {featuredArticle.author}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        Lees meer
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Regular Articles Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/${article.slug}`}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-border group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                        {article.island}
                      </span>
                      <span className="text-gray-500 text-xs">{article.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                      </div>
                      <span>{article.readTime} leestijd</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

