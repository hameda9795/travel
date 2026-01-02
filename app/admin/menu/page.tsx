'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, GripVertical } from 'lucide-react';

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

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Form states for new menu item
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemSlug, setNewItemSlug] = useState('');
  const [newItemColumns, setNewItemColumns] = useState<MenuColumn[]>([]);

  // Form states for editing
  const [editTitle, setEditTitle] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editColumns, setEditColumns] = useState<MenuColumn[]>([]);

  useEffect(() => {
    loadMenuItems();
  }, []);

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

  const saveMenuItems = (items: MenuItem[]) => {
    localStorage.setItem('site-menu', JSON.stringify(items));
    window.dispatchEvent(new Event('menu-updated'));
    setMenuItems(items);
  };

  const addMenuItem = () => {
    if (!newItemTitle.trim()) {
      alert('Vul een titel in voor het menu item');
      return;
    }

    // Allow empty slug for home page, default to empty string
    const finalSlug = newItemSlug.trim();

    // Check if slug already exists
    if (menuItems.some(item => item.slug === finalSlug)) {
      alert('Deze slug bestaat al. Kies een unieke slug.');
      return;
    }

    const newItem: MenuItem = {
      id: Date.now().toString(),
      title: newItemTitle.trim(),
      slug: finalSlug,
      columns: newItemColumns,
    };

    saveMenuItems([...menuItems, newItem]);
    setNewItemTitle('');
    setNewItemSlug('');
    setNewItemColumns([]);
    setShowAddDialog(false);
  };

  const deleteMenuItem = (id: string) => {
    if (confirm('Weet u zeker dat u dit menu item wilt verwijderen?')) {
      saveMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  const startEditing = (item: MenuItem) => {
    setEditingItem(item.id);
    setEditTitle(item.title);
    setEditSlug(item.slug);
    setEditColumns(JSON.parse(JSON.stringify(item.columns))); // Deep copy
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditTitle('');
    setEditSlug('');
    setEditColumns([]);
  };

  const saveEditing = () => {
    if (!editTitle.trim()) {
      alert('Titel mag niet leeg zijn');
      return;
    }

    // Allow empty slug for home page
    const finalSlug = editSlug.trim();

    // Check if slug already exists (excluding current item)
    if (menuItems.some(item => item.slug === finalSlug && item.id !== editingItem)) {
      alert('Deze slug bestaat al. Kies een unieke slug.');
      return;
    }

    const updatedItems = menuItems.map(item => {
      if (item.id === editingItem) {
        return {
          ...item,
          title: editTitle.trim(),
          slug: finalSlug,
          columns: editColumns,
        };
      }
      return item;
    });

    saveMenuItems(updatedItems);
    cancelEditing();
  };

  const addColumn = () => {
    const newColumn: MenuColumn = {
      id: Date.now().toString(),
      title: 'Nieuwe Kolom',
      items: [],
    };
    setEditColumns([...editColumns, newColumn]);
  };

  const updateColumn = (columnId: string, title: string) => {
    setEditColumns(editColumns.map(col =>
      col.id === columnId ? { ...col, title } : col
    ));
  };

  const deleteColumn = (columnId: string) => {
    setEditColumns(editColumns.filter(col => col.id !== columnId));
  };

  const addSubItem = (columnId: string) => {
    const newSubItem: SubMenuItem = {
      id: Date.now().toString(),
      label: '',
      href: '',
    };

    setEditColumns(editColumns.map(col => {
      if (col.id === columnId) {
        return { ...col, items: [...col.items, newSubItem] };
      }
      return col;
    }));
  };

  const updateSubItem = (columnId: string, itemId: string, field: 'label' | 'href', value: string) => {
    setEditColumns(editColumns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          items: col.items.map(item => {
            if (item.id === itemId) {
              const updates: any = { [field]: value };

              // Auto-generate href when label changes
              if (field === 'label') {
                const subSlug = value.toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9-]/g, '');

                // Remove leading slash from editSlug if present to avoid double slashes
                const cleanParentSlug = editSlug.replace(/^\//, '');
                updates.href = cleanParentSlug ? `/${cleanParentSlug}/${subSlug}` : `/${subSlug}`;
              }

              return { ...item, ...updates };
            }
            return item;
          }),
        };
      }
      return col;
    }));
  };

  const deleteSubItem = (columnId: string, itemId: string) => {
    setEditColumns(editColumns.map(col => {
      if (col.id === columnId) {
        return { ...col, items: col.items.filter(item => item.id !== itemId) };
      }
      return col;
    }));
  };

  // Functions for new item columns
  const addNewColumn = () => {
    const newColumn: MenuColumn = {
      id: Date.now().toString(),
      title: 'Nieuwe Kolom',
      items: [],
    };
    setNewItemColumns([...newItemColumns, newColumn]);
  };

  const updateNewColumn = (columnId: string, title: string) => {
    setNewItemColumns(newItemColumns.map(col =>
      col.id === columnId ? { ...col, title } : col
    ));
  };

  const deleteNewColumn = (columnId: string) => {
    setNewItemColumns(newItemColumns.filter(col => col.id !== columnId));
  };

  const addNewSubItem = (columnId: string) => {
    const newSubItem: SubMenuItem = {
      id: Date.now().toString(),
      label: '',
      href: '',
    };

    setNewItemColumns(newItemColumns.map(col => {
      if (col.id === columnId) {
        return { ...col, items: [...col.items, newSubItem] };
      }
      return col;
    }));
  };

  const updateNewSubItem = (columnId: string, itemId: string, field: 'label' | 'href', value: string) => {
    setNewItemColumns(newItemColumns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          items: col.items.map(item => {
            if (item.id === itemId) {
              const updates: any = { [field]: value };

              // Auto-generate href when label changes
              if (field === 'label') {
                const subSlug = value.toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9-]/g, '');

                // Remove leading slash from newItemSlug if present
                const cleanParentSlug = newItemSlug.replace(/^\//, '');
                updates.href = cleanParentSlug ? `/${cleanParentSlug}/${subSlug}` : `/${subSlug}`;
              }

              return { ...item, ...updates };
            }
            return item;
          }),
        };
      }
      return col;
    }));
  };

  const deleteNewSubItem = (columnId: string, itemId: string) => {
    setNewItemColumns(newItemColumns.map(col => {
      if (col.id === columnId) {
        return { ...col, items: col.items.filter(item => item.id !== itemId) };
      }
      return col;
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Menu Beheer</h1>
          <p className="text-muted-foreground mt-2">
            Beheer de navigatiemenu items van uw website. Voor content: gebruik Content Beheer.
          </p>
        </div>
        <button
          onClick={() => setShowAddDialog(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nieuw Menu Item
        </button>
      </div>

      {/* Info Box */}
      <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Let op:</strong> Menu Beheer is alleen voor structuur (namen, slugs, volgorde).
              Voor het maken van content voor een menu item, ga naar <strong>Content Beheer</strong> en gebruik de slug die u hier hebt aangemaakt.
            </p>
          </div>
        </div>
      </div>

      {/* Add Dialog */}
      {showAddDialog && (
        <div className="mb-6 bg-white border border-border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Nieuw Menu Item Toevoegen</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titel *</label>
                <input
                  type="text"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Bijv. Vakantie"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug * (URL-vriendelijk)</label>
                <input
                  type="text"
                  value={newItemSlug}
                  onChange={(e) => setNewItemSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Bijv. vakantie"
                />
                <p className="text-xs text-gray-500 mt-1">URL: /{newItemSlug || 'slug'}</p>
              </div>
            </div>

            {/* Columns Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Kolommen (zoals in screenshot)</h4>
                <button
                  onClick={addNewColumn}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Kolom Toevoegen
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {newItemColumns.map((column) => (
                  <div key={column.id} className="border border-border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <input
                        type="text"
                        value={column.title}
                        onChange={(e) => updateNewColumn(column.id, e.target.value)}
                        className="flex-1 px-3 py-1 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                        placeholder="Kolom titel (bijv. Type vakantie)"
                      />
                      <button
                        onClick={() => deleteNewColumn(column.id)}
                        className="ml-2 text-red-600 hover:text-red-700"
                        title="Kolom verwijderen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 mb-3">
                      {column.items.map((subItem) => (
                        <div key={subItem.id} className="bg-white rounded p-2 space-y-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={subItem.label}
                              onChange={(e) => updateNewSubItem(column.id, subItem.id, 'label', e.target.value)}
                              className="flex-1 px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Label (bijv. All inclusive)"
                            />
                            <button
                              onClick={() => deleteNewSubItem(column.id, subItem.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Verwijderen"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={subItem.href}
                            onChange={(e) => updateNewSubItem(column.id, subItem.id, 'href', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Link (bijv. /vakantie/all-inclusive)"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => addNewSubItem(column.id)}
                      className="w-full bg-white hover:bg-gray-100 border border-dashed border-gray-300 text-gray-600 px-3 py-2 rounded text-sm flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Sub-item toevoegen
                    </button>
                  </div>
                ))}
              </div>

              {newItemColumns.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded">
                  Nog geen kolommen. Klik op "Kolom Toevoegen" om kolommen toe te voegen zoals "Type vakantie", "Type accommodatie", etc.
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={addMenuItem}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
              >
                Menu Item Aanmaken
              </button>
              <button
                onClick={() => {
                  setShowAddDialog(false);
                  setNewItemTitle('');
                  setNewItemSlug('');
                  setNewItemColumns([]);
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items List */}
      <div className="space-y-4">
        {menuItems.length === 0 ? (
          <div className="bg-white border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">Geen menu items gevonden. Voeg een nieuw menu item toe om te beginnen.</p>
          </div>
        ) : (
          menuItems.map((item) => (
            <div key={item.id} className="bg-white border border-border rounded-lg overflow-hidden">
              {editingItem === item.id ? (
                // Edit Mode
                <div className="p-6">
                  <div className="mb-6 flex justify-between items-start">
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Menu Item Titel *</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Slug *</label>
                        <input
                          type="text"
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="vakantie"
                        />
                        <p className="text-xs text-gray-500 mt-1">URL: /{editSlug}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={saveEditing}
                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                        title="Opslaan"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-lg transition-colors"
                        title="Annuleren"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Columns Section */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold">Kolommen</h4>
                      <button
                        onClick={addColumn}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Kolom Toevoegen
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {editColumns.map((column) => (
                        <div key={column.id} className="border border-border rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-3">
                            <input
                              type="text"
                              value={column.title}
                              onChange={(e) => updateColumn(column.id, e.target.value)}
                              className="flex-1 px-3 py-1 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                              placeholder="Kolom titel"
                            />
                            <button
                              onClick={() => deleteColumn(column.id)}
                              className="ml-2 text-red-600 hover:text-red-700"
                              title="Kolom verwijderen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-2 mb-3">
                            {column.items.map((subItem) => (
                              <div key={subItem.id} className="bg-white rounded p-2 space-y-1">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={subItem.label}
                                    onChange={(e) => updateSubItem(column.id, subItem.id, 'label', e.target.value)}
                                    className="flex-1 px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Label"
                                  />
                                  <button
                                    onClick={() => deleteSubItem(column.id, subItem.id)}
                                    className="text-red-600 hover:text-red-700"
                                    title="Verwijderen"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={subItem.href}
                                  onChange={(e) => updateSubItem(column.id, subItem.id, 'href', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                  placeholder="Link (bijv. /pagina)"
                                />
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => addSubItem(column.id)}
                            className="w-full bg-white hover:bg-gray-100 border border-dashed border-gray-300 text-gray-600 px-3 py-2 rounded text-sm flex items-center justify-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            Sub-item toevoegen
                          </button>
                        </div>
                      ))}
                    </div>

                    {editColumns.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded">
                        Geen kolommen. Klik op "Kolom Toevoegen" om te beginnen.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">Slug: /{item.slug}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.columns.length} kolom(men), {item.columns.reduce((sum, col) => sum + col.items.length, 0)} sub-item(s)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(item)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                        title="Bewerken"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteMenuItem(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                        title="Verwijderen"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {item.columns.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 bg-gray-50 p-4 rounded-lg">
                      {item.columns.map((column) => (
                        <div key={column.id}>
                          <h4 className="font-semibold text-sm mb-2">{column.title}</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {column.items.map((subItem) => (
                              <li key={subItem.id} className="truncate">
                                {subItem.label} → {subItem.href}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
