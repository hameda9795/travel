'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  getIslands,
  saveIsland,
  deleteIsland,
  generateSlug,
  type Island,
} from '@/lib/islands';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';

export default function EilandenBeheerPage() {
  const [islands, setIslands] = useState<Island[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [islandToDelete, setIslandToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    isActive: true,
  });

  // Load islands
  useEffect(() => {
    loadIslands();

    // Listen for updates
    const handleUpdate = () => loadIslands();
    window.addEventListener('islands-updated', handleUpdate);

    return () => {
      window.removeEventListener('islands-updated', handleUpdate);
    };
  }, []);

  const loadIslands = () => {
    const data = getIslands();
    setIslands(data);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      isActive: true,
    });
  };

  const handleEdit = (island: Island) => {
    setEditingId(island.id);
    setIsCreating(false);
    setFormData({
      name: island.name,
      slug: island.slug,
      isActive: island.isActive,
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      isActive: true,
    });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Naam is verplicht');
      return;
    }

    const island: Island = {
      id: editingId || Date.now().toString(),
      name: formData.name.trim(),
      slug: formData.slug || generateSlug(formData.name),
      isActive: formData.isActive,
      createdAt: editingId
        ? islands.find(i => i.id === editingId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
    };

    saveIsland(island);
    handleCancel();
  };

  const handleDelete = (id: string) => {
    setIslandToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (islandToDelete) {
      deleteIsland(islandToDelete);
      setDeleteModalOpen(false);
      setIslandToDelete(null);
    }
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Eilanden Beheer</h1>
          <p className="text-gray-600 mt-1">
            Beheer alle beschikbare eilanden ({islands.length} eilanden)
          </p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nieuw Eiland
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {isCreating ? 'Nieuw Eiland Toevoegen' : 'Eiland Bewerken'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Naam *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="bijv. Gran Canaria"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (automatisch gegenereerd)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                placeholder="gran-canaria"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.isActive ? 'active' : 'inactive'}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.value === 'active' })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="active">Actief</option>
                <option value="inactive">Inactief</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Annuleren
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Opslaan
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {islands.length > 0 ? (
          <div className="w-full">
            <table className="w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[30%]">
                    Naam
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[30%]">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">
                    Aangemaakt
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]">
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {islands.map((island) => (
                  <tr key={island.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{island.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-500 font-mono bg-gray-50 inline-block px-1.5 py-0.5 rounded border border-gray-100">
                        {island.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${island.isActive
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                          }`}
                      >
                        {island.isActive ? 'Actief' : 'Inactief'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(island.createdAt).toLocaleDateString('nl-NL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(island)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-teal-50 rounded-md transition-all"
                          title="Bewerk"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(island.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                          title="Verwijder"
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Geen eilanden gevonden</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Eiland verwijderen
            </h2>
            <p className="text-gray-600 mb-6">
              Weet je zeker dat je dit eiland wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Verwijderen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
