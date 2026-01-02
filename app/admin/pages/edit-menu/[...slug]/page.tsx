'use client';

import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

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

export default function EditMenuItemPage() {
  const params = useParams();
  const router = useRouter();
  const slugParam = params.slug;
  const slug = Array.isArray(slugParam) ? slugParam.join('/') : slugParam as string;
  
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const loadMenuItems = () => {
      const savedMenu = localStorage.getItem('site-menu');
      if (savedMenu) {
        try {
          const parsed = JSON.parse(savedMenu) as MenuItem[];
          setAllMenuItems(parsed);
          const item = parsed.find((m) => m.slug === slug);
          if (item) {
            setMenuItem(item);
          }
        } catch (error) {
          console.error('Error loading menu:', error);
        }
      }
    };

    loadMenuItems();
  }, [slug]);

  const handleSave = () => {
    if (menuItem && allMenuItems.length > 0) {
      // Update the menu item in the list
      const updatedMenuItems = allMenuItems.map((item) =>
        item.id === menuItem.id ? menuItem : item
      );
      
      // Save to localStorage
      localStorage.setItem('site-menu', JSON.stringify(updatedMenuItems));
      
      // Dispatch update event
      window.dispatchEvent(new Event('menu-updated'));
      
      alert('Menu item opgeslagen!');
      router.push('/admin/pages');
    }
  };

  const addSubItem = (columnId: string) => {
    if (!menuItem) return;
    
    const newSubItem: SubMenuItem = {
      id: Date.now().toString(),
      label: 'Nieuw Sub-item',
      href: `/${slug}/nieuw-item`,
    };

    const updatedColumns = menuItem.columns.map((col) =>
      col.id === columnId
        ? { ...col, items: [...col.items, newSubItem] }
        : col
    );

    setMenuItem({ ...menuItem, columns: updatedColumns });
  };

  const removeSubItem = (columnId: string, subItemId: string) => {
    if (!menuItem) return;

    const updatedColumns = menuItem.columns.map((col) =>
      col.id === columnId
        ? { ...col, items: col.items.filter((item) => item.id !== subItemId) }
        : col
    );

    setMenuItem({ ...menuItem, columns: updatedColumns });
  };

  const updateSubItemLabel = (columnId: string, subItemId: string, label: string) => {
    if (!menuItem) return;

    const updatedColumns = menuItem.columns.map((col) =>
      col.id === columnId
        ? {
            ...col,
            items: col.items.map((item) =>
              item.id === subItemId ? { ...item, label } : item
            ),
          }
        : col
    );

    setMenuItem({ ...menuItem, columns: updatedColumns });
  };

  const updateSubItemHref = (columnId: string, subItemId: string, href: string) => {
    if (!menuItem) return;

    const updatedColumns = menuItem.columns.map((col) =>
      col.id === columnId
        ? {
            ...col,
            items: col.items.map((item) =>
              item.id === subItemId ? { ...item, href } : item
            ),
          }
        : col
    );

    setMenuItem({ ...menuItem, columns: updatedColumns });
  };

  const addColumn = () => {
    if (!menuItem) return;

    const newColumn: MenuColumn = {
      id: Date.now().toString(),
      title: 'Nieuwe Kolom',
      items: [],
    };

    setMenuItem({ ...menuItem, columns: [...menuItem.columns, newColumn] });
  };

  const removeColumn = (columnId: string) => {
    if (!menuItem) return;

    const updatedColumns = menuItem.columns.filter((col) => col.id !== columnId);
    setMenuItem({ ...menuItem, columns: updatedColumns });
  };

  const updateColumnTitle = (columnId: string, title: string) => {
    if (!menuItem) return;

    const updatedColumns = menuItem.columns.map((col) =>
      col.id === columnId ? { ...col, title } : col
    );

    setMenuItem({ ...menuItem, columns: updatedColumns });
  };

  if (!menuItem) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Laden...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/admin/pages"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Menu Item Bewerken</h1>
            <p className="text-gray-600 mt-1">Pas de naam en sub-items aan</p>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            Opslaan
          </button>
        </div>
      </div>

      {/* Main Item Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Menu Item Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Menu Titel
            </label>
            <input
              type="text"
              value={menuItem.title}
              onChange={(e) => setMenuItem({ ...menuItem, title: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Bijv. Vakantie"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug (pad)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">/</span>
              <input
                type="text"
                value={menuItem.slug}
                onChange={(e) => setMenuItem({ ...menuItem, slug: e.target.value })}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Bijv. vakantie"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Let op: Als u de slug wijzigt, werken oude links mogelijk niet meer
            </p>
          </div>
        </div>
      </div>

      {/* Columns and Sub-items */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Kolommen en Sub-items</h2>
          <button
            onClick={addColumn}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Kolom Toevoegen
          </button>
        </div>

        <div className="space-y-6">
          {menuItem.columns.map((column, columnIndex) => (
            <div
              key={column.id}
              className="bg-gray-50 rounded-lg border border-gray-200 p-5"
            >
              {/* Column Header */}
              <div className="flex items-center gap-3 mb-4">
                <GripVertical className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={column.title}
                  onChange={(e) => updateColumnTitle(column.id, e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-semibold"
                  placeholder="Kolom Titel"
                />
                <button
                  onClick={() => removeColumn(column.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Kolom verwijderen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Sub-items */}
              <div className="space-y-3 mb-3">
                {column.items.map((subItem, itemIndex) => (
                  <div
                    key={subItem.id}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400 mt-2 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={subItem.label}
                          onChange={(e) =>
                            updateSubItemLabel(column.id, subItem.id, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          placeholder="Sub-item Label"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">/</span>
                          <input
                            type="text"
                            value={subItem.href.startsWith('/') ? subItem.href.substring(1) : subItem.href}
                            onChange={(e) =>
                              updateSubItemHref(
                                column.id,
                                subItem.id,
                                e.target.value.startsWith('/') ? e.target.value : '/' + e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                            placeholder="pad/naar/pagina"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeSubItem(column.id, subItem.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        title="Sub-item verwijderen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Sub-item Button */}
              <button
                onClick={() => addSubItem(column.id)}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Sub-item Toevoegen
              </button>
            </div>
          ))}

          {menuItem.columns.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Geen kolommen. Klik op "Kolom Toevoegen" om te beginnen.</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
        <h3 className="text-lg font-bold text-blue-900 mb-2">💡 Tips</h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• De menu titel verschijnt in de hoofdnavigatie</li>
          <li>• Sub-items verschijnen in dropdown menu's onder het hoofditem</li>
          <li>• Kolommen helpen bij het organiseren van sub-items in groepen</li>
          <li>• Vergeet niet op "Opslaan" te klikken om uw wijzigingen te bewaren</li>
        </ul>
      </div>
    </div>
  );
}
