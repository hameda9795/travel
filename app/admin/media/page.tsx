'use client';

import { useState } from 'react';
import { Upload, Video, Image as ImageIcon, Trash2, Link2, Play } from 'lucide-react';

export default function MediaManagementPage() {
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');

  const images = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=400&h=300&fit=crop',
      title: 'Duinen van Maspalomas',
      size: '2.4 MB',
      date: '2026-01-15',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1611391228629-c3742422cef9?w=400&h=300&fit=crop',
      title: 'Mount Teide',
      size: '1.8 MB',
      date: '2026-01-14',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=300&fit=crop',
      title: 'Timanfaya National Park',
      size: '3.1 MB',
      date: '2026-01-12',
    },
  ];

  const videos = [
    {
      id: 1,
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'Gran Canaria Tour 2026',
      platform: 'YouTube',
      thumbnail: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=400&h=225&fit=crop',
      date: '2026-01-13',
    },
    {
      id: 2,
      url: 'https://vimeo.com/123456789',
      title: 'Sunset at Puerto de Mogán',
      platform: 'Vimeo',
      thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=225&fit=crop',
      date: '2026-01-10',
    },
  ];

  const handleVideoAdd = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding video:', { url: videoUrl, title: videoTitle });
    setVideoUrl('');
    setVideoTitle('');
    alert('Video toegevoegd! (In de echte app wordt dit opgeslagen in de database)');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('Uploading images:', files);
      alert(`${files.length} afbeelding(en) uploaden... (In de echte app worden deze opgeslagen)`);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Media Beheer</h1>
        <p className="text-gray-600 mt-2">
          Upload en beheer afbeeldingen en video's voor uw content
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab('images')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'images'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Afbeeldingen
            </div>
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'videos'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Video's
            </div>
          </button>
        </nav>
      </div>

      {/* Images Tab */}
      {activeTab === 'images' && (
        <div>
          {/* Upload Area */}
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 mb-6 hover:border-primary transition-colors">
            <div className="text-center">
              <Upload className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Afbeeldingen
              </h3>
              <p className="text-gray-600 mb-4">
                Sleep bestanden hierheen of klik om te uploaden
              </p>
              <label className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg cursor-pointer transition-colors">
                <Upload className="w-5 h-5" />
                Selecteer Bestanden
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-3">
                PNG, JPG, GIF tot 10MB
              </p>
            </div>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{image.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{image.size}</span>
                    <span>{new Date(image.date).toLocaleDateString('nl-NL')}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                      Kopieer URL
                    </button>
                    <button className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div>
          {/* Add Video Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Video URL Toevoegen
            </h3>
            <form onSubmit={handleVideoAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL (YouTube of Vimeo)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Titel
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Bijv. Gran Canaria Tour 2026"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Video Toevoegen
              </button>
            </form>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-56 bg-gray-100 group">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-black bg-opacity-70 text-white text-xs font-medium rounded-full">
                      {video.platform}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 truncate">{video.url}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                      Kopieer URL
                    </button>
                    <button className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
