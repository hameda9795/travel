'use client';

import { useState, useEffect } from 'react';
import { Edit, Eye, Menu as MenuIcon, FileText, ChevronDown, ChevronRight, Settings } from 'lucide-react';
import Link from 'next/link';

interface SubMenuItem {
  id: string;
  label: string;
  href: string;
}

interface MenuColumn {
  id: string;
  title: string;
  items: SubMenuItem[];
}

interface MenuItem {
  id: string;
  title: string;
  slug: string;
  columns: MenuColumn[];
}

export default function PagesManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Load menu items from localStorage
  useEffect(() => {
    const loadMenuItems = () => {
      const savedMenu = localStorage.getItem('site-menu');
      if (savedMenu) {
        try {
          const parsed = JSON.parse(savedMenu) as MenuItem[];
          setMenuItems(parsed);
        } catch (error) {
          console.error('Error loading menu:', error);
        }
      }
    };

    loadMenuItems();

    // Listen for menu updates
    const handleMenuUpdate = () => loadMenuItems();
    window.addEventListener('menu-updated', handleMenuUpdate);

    return () => {
      window.removeEventListener('menu-updated', handleMenuUpdate);
    };
  }, []);

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const getSlugFromHref = (href: string) => {
    return href.startsWith('/') ? href.substring(1) : href;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pagina Beheer</h1>
        <p className="text-gray-600 mt-2">
          Beheer de content van uw website pagina's
        </p>
      </div>

      {/* Menu Items Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Menu Pagina's</h2>
        <div className="space-y-6">
          {menuItems.map((item) => {
            const isExpanded = expandedItems.has(item.id);
            const hasSubItems = item.columns.some((col) => col.items.length > 0);

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Main Item Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-3 bg-blue-600/10 rounded-lg">
                        <MenuIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">/{item.slug}</p>
                        {hasSubItems && (
                          <p className="text-xs text-gray-400 mt-1">
                            {item.columns.reduce((total, col) => total + col.items.length, 0)} sub-items
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/pages/edit-menu/${item.slug || 'home'}`}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors"
                        title="Bewerk menu structuur"
                      >
                        <Settings className="w-4 h-4" />
                        Bewerken
                      </Link>
                      <Link
                        href={item.slug ? `/${item.slug}` : '/'}
                        target="_blank"
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {hasSubItems && (
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-lg transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sub-Items (Expanded) */}
                {isExpanded && hasSubItems && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
                      Sub-Items
                    </h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {item.columns.map((column) =>
                        column.items.map((subItem) => {
                          const slug = getSlugFromHref(subItem.href);
                          return (
                            <div
                              key={subItem.id}
                              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start gap-2 mb-3">
                                <div className="p-2 bg-blue-600/10 rounded">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-gray-900 text-sm truncate">
                                    {subItem.label}
                                  </h5>
                                  <p className="text-xs text-gray-500 truncate">/{slug}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Kolom: {column.title}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Link
                                  href={subItem.href}
                                  target="_blank"
                                  className="flex-1 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span className="ml-1 text-sm">Bekijk</span>
                                </Link>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {menuItems.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <MenuIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nog geen menu pagina's toegevoegd</p>
              <p className="text-sm text-gray-400 mt-2">
                Ga naar Menu Beheer om menu items toe te voegen
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
        <h3 className="text-lg font-bold text-blue-900 mb-2">💡 Tip</h3>
        <p className="text-blue-800">
          Klik op de pijl-knop aan de rechterkant van een menu item om de sub-items te bekijken en te bewerken.
          Klik op "Bewerken" om de content van een pagina aan te passen.
        </p>
      </div>
    </div>
  );
}
