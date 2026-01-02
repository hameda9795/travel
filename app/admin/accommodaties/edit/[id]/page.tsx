'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  getAccommodationById,
  saveAccommodation,
  generateSlug,
  LOCATIONS_BY_ISLAND,
  ACCOMMODATION_TYPES,
  FACILITIES,
  ORGANIZATIONS,
  type Accommodation,
} from '@/lib/accommodations';
import { getActiveIslands } from '@/lib/islands';
import { saveImage } from '@/lib/upload';
import { ArrowLeft, Upload, X } from 'lucide-react';

export default function EditAccommodationPage() {
  const params = useParams();
  const router = useRouter();
  const accommodationId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [islands, setIslands] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadError, setUploadError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState<Omit<Accommodation, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    slug: '',
    island: 'Gran Canaria',
    location: '',
    description: '',
    imageUrl: '',
    imageAlt: '',
    pricePerNight: 0,
    rating: 8.0,
    reviewCount: 0,
    stars: 4,
    type: 'Hotel',
    facilities: [],
    organization: 'TUI',
    isPopular: false,
    status: 'Gepubliceerd',
  });

  // Load islands
  useEffect(() => {
    const activeIslands = getActiveIslands();
    const islandNames = activeIslands.map(island => island.name);
    setIslands(islandNames);
  }, []);

  // Load accommodation data
  useEffect(() => {
    const accommodation = getAccommodationById(accommodationId);

    if (!accommodation) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setFormData({
      name: accommodation.name,
      slug: accommodation.slug,
      island: accommodation.island,
      location: accommodation.location,
      description: accommodation.description,
      imageUrl: accommodation.imageUrl,
      imageAlt: accommodation.imageAlt,
      pricePerNight: accommodation.pricePerNight,
      rating: accommodation.rating,
      reviewCount: accommodation.reviewCount,
      stars: accommodation.stars,
      type: accommodation.type,
      facilities: accommodation.facilities,
      organization: accommodation.organization,
      isPopular: accommodation.isPopular,
      status: accommodation.status,
    });

    setImagePreview(accommodation.imageUrl);
    setLoading(false);
  }, [accommodationId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Auto-generate slug from name
    if (name === 'name') {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleFacilityChange = (facility: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setUploadError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setUploadError('');

    try {
      let imageUrl = formData.imageUrl;

      // Upload new image if selected
      if (imageFile) {
        const uploadResult = await saveImage(imageFile, formData.slug);
        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
        } else {
          setUploadError(uploadResult.error || 'Image upload failed');
          setSaving(false);
          return;
        }
      }

      // Get original accommodation for timestamps
      const original = getAccommodationById(accommodationId);
      if (!original) {
        setSaving(false);
        return;
      }

      // Update accommodation object
      const accommodation: Accommodation = {
        id: accommodationId,
        ...formData,
        imageUrl,
        createdAt: original.createdAt,
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage
      saveAccommodation(accommodation);

      // Redirect to list
      router.push('/admin/accommodaties');
    } catch (error) {
      console.error('Error updating accommodation:', error);
      setUploadError('Er is een fout opgetreden bij het opslaan');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Laden...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (notFound) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Accommodatie niet gevonden
            </h1>
            <p className="text-gray-600 mb-6">
              De gevraagde accommodatie kon niet worden gevonden.
            </p>
            <Link
              href="/admin/accommodaties"
              className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Terug naar overzicht
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/accommodaties"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar overzicht
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Accommodatie bewerken</h1>
          <p className="text-gray-600 mt-1">Wijzig de gegevens van de accommodatie</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basis Informatie */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Basis Informatie
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Naam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Automatisch gegenereerd vanuit naam
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Eiland <span className="text-red-500">*</span>
                </label>
                <select
                  name="island"
                  value={formData.island}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Selecteer eiland</option>
                  {islands.map((island) => (
                    <option key={island} value={island}>
                      {island}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Locatie <span className="text-red-500">*</span>
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Selecteer locatie</option>
                  {LOCATIONS_BY_ISLAND[formData.island]?.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {ACCOMMODATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Gepubliceerd">Gepubliceerd</option>
                  <option value="Concept">Concept</option>
                </select>
              </div>
            </div>
          </div>

          {/* Afbeelding */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Afbeelding</h2>

            {uploadError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {uploadError}
              </div>
            )}

            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-primary hover:text-primary-dark font-medium">
                      Upload een afbeelding
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    JPG, PNG of WebP (max 5MB)
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Of gebruik een externe URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt tekst <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="imageAlt"
                  value={formData.imageAlt}
                  onChange={handleChange}
                  required
                  placeholder="Beschrijving van de afbeelding"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Beschrijving */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Beschrijving</h2>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              maxLength={300}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/300 karakters
            </p>
          </div>

          {/* Prijzen & Beoordelingen */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Prijzen & Beoordelingen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prijs per nacht (€) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="pricePerNight"
                  value={formData.pricePerNight}
                  onChange={handleChange}
                  required
                  min="0"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sterren <span className="text-red-500">*</span>
                </label>
                <select
                  name="stars"
                  value={formData.stars}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={3}>3 ★★★</option>
                  <option value={4}>4 ★★★★</option>
                  <option value={5}>5 ★★★★★</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beoordeling (1-10)
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aantal reviews
                </label>
                <input
                  type="number"
                  name="reviewCount"
                  value={formData.reviewCount}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Markeer als populair
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Faciliteiten */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Faciliteiten</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {FACILITIES.map((facility) => (
                <label key={facility} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.facilities.includes(facility)}
                    onChange={() => handleFacilityChange(facility)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{facility}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reisorganisatie */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Reisorganisatie
            </h2>
            <select
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {ORGANIZATIONS.map((org) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/admin/accommodaties"
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuleren
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Opslaan...' : 'Wijzigingen opslaan'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
