'use client';

import Link from 'next/link';
import { Menu, X, MapPin, ChevronDown, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

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

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [expandedMobileItems, setExpandedMobileItems] = useState<Set<string>>(new Set());

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

  const toggleMobileItem = (itemId: string) => {
    setExpandedMobileItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <MapPin className="w-6 h-6 text-primary group-hover:text-primary-dark transition-colors" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Canarische Eilanden</h1>
              <p className="text-xs text-gray-600 hidden sm:block">Expertise in Canarische Reizen</p>
            </div>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center mx-8">
            {/* Dynamic Menu Items */}
            {menuItems.map((item) => (
              <div key={item.id} className="relative group h-16 flex items-center">
                {item.columns.length > 0 ? (
                  // Menu item with dropdown
                  <>
                    <button className="text-foreground hover:text-primary font-medium transition-colors py-2 h-full flex items-center">
                      {item.title}
                    </button>
                    <div className="fixed left-0 right-0 top-16 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="bg-gray-50 border-t border-gray-200 shadow-2xl w-full">
                        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
                          <div className={`grid gap-8 ${item.columns.length === 1 ? 'grid-cols-1' : item.columns.length === 2 ? 'grid-cols-2' : item.columns.length === 3 ? 'grid-cols-3' : item.columns.length >= 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                            {item.columns.map((column, idx) => (
                              <div
                                key={column.id}
                                className={`p-6 ${idx !== item.columns.length - 1 ? 'border-r border-gray-100' : ''} hover:bg-gray-50/50 transition-colors`}
                              >
                                <h3 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-primary/20 pb-2">
                                  {column.title}
                                </h3>
                                <div className="space-y-2.5">
                                  {column.items.map((subItem) => (
                                    <Link
                                      key={subItem.id}
                                      href={subItem.href}
                                      className="block text-sm text-gray-700 hover:text-primary hover:translate-x-1 transition-all duration-150 py-1.5 px-2 rounded hover:bg-primary/5"
                                    >
                                      {subItem.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Simple menu item without dropdown
                  <Link
                    href={item.slug ? `/${item.slug}` : '/'}
                    className="text-foreground hover:text-primary font-medium transition-colors"
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/accommodaties"
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Zoek & Boek
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="flex flex-col gap-2">
              {/* Dynamic Menu Items */}
              {menuItems.map((item) => {
                const isExpanded = expandedMobileItems.has(item.id);
                return (
                  <div key={item.id} className="border-b border-gray-100 last:border-b-0">
                    {item.columns.length > 0 ? (
                      <>
                        <button
                          onClick={() => toggleMobileItem(item.id)}
                          className="w-full flex items-center justify-between px-4 py-3 text-gray-900 font-medium hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                          <span>{item.title}</span>
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-3">
                            {item.columns.map((column) => (
                              <div key={column.id} className="mb-3 bg-gray-50 rounded-lg p-3">
                                <p className="text-xs font-semibold text-primary mb-2 px-2 uppercase">{column.title}</p>
                                <div className="space-y-1">
                                  {column.items.map((subItem) => (
                                    <Link
                                      key={subItem.id}
                                      href={subItem.href}
                                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-primary rounded-md transition-colors"
                                      onClick={() => {
                                        setIsMenuOpen(false);
                                        setExpandedMobileItems(new Set());
                                      }}
                                    >
                                      {subItem.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.slug ? `/${item.slug}` : '/'}
                        className="block px-4 py-3 text-gray-900 font-medium hover:bg-primary/5 hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.title}
                      </Link>
                    )}
                  </div>
                );
              })}

              {/* Mobile Zoek & Boek Button */}
              <div className="px-4 pt-2">
                <Link
                  href="/accommodaties"
                  className="block text-center bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Zoek & Boek
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
