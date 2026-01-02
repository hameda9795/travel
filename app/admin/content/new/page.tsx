'use client';

import { useState } from 'react';
import { Save, Eye, ArrowLeft, Plus, Trash2, Image as ImageIcon, AlertCircle, MoveUp, MoveDown, Columns, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';
import { uploadContentImage } from '@/lib/contentUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface ContentBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'section';
  level?: 'H2' | 'H3' | 'H4';
  heading?: string;
  content?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
  mediaType?: 'url' | 'image-upload' | 'video-upload';
  fileName?: string;
  filePreview?: string;
  // Section fields
  layout?: 'equal' | 'left-wide' | 'right-wide';
  col1Type?: 'text' | 'image';
  col1Content?: string;
  col2Type?: 'text' | 'image';
  col2Content?: string;
  col1ImageAlt?: string;
  col2ImageAlt?: string;
}

export default function NewArticlePage() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    island: 'Gran Canaria',
    category: 'Hotels',
    cluster: 'Hotels & Accommodaties',
    featuredImage: '',
    featuredImageAlt: '',
    featuredMediaType: 'url' as 'url' | 'upload',
    featuredFileName: '',
    featuredFilePreview: '',
    status: 'Concept',
    contentType: 'article',
  });

  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    {
      id: '1',
      type: 'paragraph',
      content: '',
    },
  ]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
      metaTitle: title,
    });
  };

  const addBlock = (type: 'heading' | 'paragraph' | 'image' | 'section') => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      ...(type === 'heading' && { level: 'H2', heading: '', content: '' }),
      ...(type === 'paragraph' && { content: '' }),
      ...(type === 'image' && { imageUrl: '', imageAlt: '', imageCaption: '', mediaType: 'url' }),
      ...(type === 'section' && {
        layout: 'equal',
        col1Type: 'text',
        col1Content: '',
        col2Type: 'image',
        col2Content: ''
      }),
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const handleSectionFileUpload = async (blockId: string, col: 1 | 2, file: File) => {
    const result = await uploadContentImage(file);
    if (result.success && result.url) {
      updateBlock(blockId, {
        [col === 1 ? 'col1Content' : 'col2Content']: result.url
      });
    } else {
      alert('Upload mislukt: ' + (result.error || 'Onbekende fout'));
    }
  };

  const handleFileUpload = async (blockId: string, file: File, type: 'image-upload' | 'video-upload') => {
    const result = await uploadContentImage(file);
    if (result.success && result.url) {
      updateBlock(blockId, {
        mediaType: type,
        fileName: file.name,
        imageUrl: result.url,
      });
    } else {
      alert('Upload mislukt: ' + (result.error || 'Onbekende fout'));
    }
  };

  const handleFeaturedImageUpload = async (file: File) => {
    const result = await uploadContentImage(file);
    if (result.success && result.url) {
      setFormData({
        ...formData,
        featuredMediaType: 'upload',
        featuredFileName: file.name,
        featuredImage: result.url,
      });
    } else {
      alert('Upload mislukt: ' + (result.error || 'Onbekende fout'));
    }
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setContentBlocks(
      contentBlocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      )
    );
  };

  const deleteBlock = (id: string) => {
    setContentBlocks(contentBlocks.filter((block) => block.id !== id));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = contentBlocks.findIndex((block) => block.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === contentBlocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...contentBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [
      newBlocks[targetIndex],
      newBlocks[index],
    ];
    setContentBlocks(newBlocks);
  };

  const handleSave = (status: 'Concept' | 'Gepubliceerd') => {
    if (!formData.title || !formData.slug) {
      alert('Vul tenminste een titel en slug in!');
      return;
    }

    const articleData = {
      ...formData,
      status,
      contentBlocks,
      createdAt: new Date().toISOString(),
    };

    try {
      // Save to localStorage using page-{slug} format
      localStorage.setItem(`page-${formData.slug}`, JSON.stringify(articleData));

      // Trigger update event
      window.dispatchEvent(new Event('content-updated'));

      console.log('Saving article:', articleData);
      alert(`Content opgeslagen als ${status}! Ga naar /${formData.slug} om te bekijken.`);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('Opslag limiet bereikt! Ga naar Opslag Beheer om oude content te verwijderen.');
      } else {
        alert('Fout bij opslaan: ' + (error as Error).message);
      }
      console.error('Error saving:', error);
    }
  };

  const hasImages = contentBlocks.some(b => b.type === 'image');
  const allImagesHaveAlt = contentBlocks
    .filter(b => b.type === 'image')
    .every(b => b.imageAlt);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/content"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nieuwe Content</h1>
            <p className="text-gray-600 mt-1">Maak content aan voor menu items, artikelen, eilanden, of elke pagina met een slug</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave('Concept')}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            Opslaan als Concept
          </button>
          <button
            onClick={() => handleSave('Gepubliceerd')}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <Eye className="w-5 h-5" />
            Publiceren
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Title & SEO Meta */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Basis Informatie & SEO</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titel (H1) *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Bijv. Beste Hotels in Maspalomas 2026"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-lg font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-sm bg-gray-50"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Preview: /{formData.slug}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt (Samenvatting) *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  placeholder="Korte samenvatting (max 160 karakters)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  maxLength={160}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.excerpt.length}/160 karakters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title *
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="Titel voor zoekmachines"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  maxLength={60}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaTitle.length}/60 karakters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description *
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  rows={3}
                  placeholder="Beschrijving in zoekresultaten"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  maxLength={160}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaDescription.length}/160 karakters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              <ImageIcon className="inline w-5 h-5 mr-2" />
              Uitgelichte Afbeelding
            </h2>

            <div className="space-y-4">
              {/* Media Type Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setFormData({ ...formData, featuredMediaType: 'url' })}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${formData.featuredMediaType === 'url'
                    ? 'border-primary bg-primary/10 text-primary font-semibold'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                >
                  URL Link
                </button>
                <button
                  onClick={() => setFormData({ ...formData, featuredMediaType: 'upload' })}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${formData.featuredMediaType === 'upload'
                    ? 'border-primary bg-primary/10 text-primary font-semibold'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                >
                  Afbeelding Upload
                </button>
              </div>

              {/* URL Input */}
              {formData.featuredMediaType === 'url' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Afbeelding URL *
                    </label>
                    <input
                      type="url"
                      value={formData.featuredImage}
                      onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Upload Input */}
              {formData.featuredMediaType === 'upload' && (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFeaturedImageUpload(file);
                      }}
                      className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Ondersteunde formaten: JPG, PNG, WEBP, GIF (max 10MB)
                    </p>
                  </div>
                  {formData.featuredFileName && (
                    <p className="text-sm text-gray-600">
                      <strong>Geselecteerd:</strong> {formData.featuredFileName}
                    </p>
                  )}
                </div>
              )}

              {/* Preview */}
              {formData.featuredImage && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <img
                    src={formData.featuredImage}
                    alt={formData.featuredImageAlt || 'Preview'}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Afbeelding+niet+gevonden';
                    }}
                  />
                </div>
              )}

              {/* Alt Text (for both types) */}
              <div className="pt-3 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text (SEO) *
                  <span className="text-xs text-red-500 ml-2">Verplicht!</span>
                </label>
                <input
                  type="text"
                  value={formData.featuredImageAlt}
                  onChange={(e) => setFormData({ ...formData, featuredImageAlt: e.target.value })}
                  placeholder="Beschrijvende tekst voor zoekmachines"
                  className="w-full px-4 py-2.5 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Content Blocks Builder */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Artikel Inhoud</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => addBlock('heading')}
                  className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Kop (H2/H3)
                </button>
                <button
                  onClick={() => addBlock('paragraph')}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Paragraaf
                </button>
                <button
                  onClick={() => addBlock('image')}
                  className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                  Afbeelding
                </button>
                <button
                  onClick={() => addBlock('section')}
                  className="flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Columns className="w-4 h-4" />
                  Sectie (2 Kolommen)
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>SEO Tip:</strong> Gebruik koppen (H2, H3) om uw artikel te structureren.
                  Voeg onder elke kop de bijbehorende inhoud toe via paragrafen.
                </span>
              </p>
            </div>

            <div className="space-y-4">
              {contentBlocks.map((block, index) => (
                <div
                  key={block.id}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {block.type === 'heading' && (
                        <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                          KOP
                        </span>
                      )}
                      {block.type === 'paragraph' && (
                        <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          TEKST
                        </span>
                      )}
                      {block.type === 'image' && (
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          BEELD
                        </span>
                      )}
                      <span className="text-sm text-gray-500">Blok {index + 1}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => moveBlock(block.id, 'up')}
                        disabled={index === 0}
                        className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Naar boven"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveBlock(block.id, 'down')}
                        disabled={index === contentBlocks.length - 1}
                        className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Naar beneden"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteBlock(block.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                        title="Verwijderen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Heading Block */}
                  {block.type === 'heading' && (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <select
                          value={block.level}
                          onChange={(e) =>
                            updateBlock(block.id, { level: e.target.value as 'H2' | 'H3' | 'H4' })
                          }
                          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white w-28"
                        >
                          <option value="H2">H2</option>
                          <option value="H3">H3</option>
                          <option value="H4">H4</option>
                        </select>
                        <input
                          type="text"
                          value={block.heading || ''}
                          onChange={(e) => updateBlock(block.id, { heading: e.target.value })}
                          placeholder="Kop tekst, bijv: Waarom Maspalomas?"
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none font-semibold"
                        />
                      </div>
                      <textarea
                        value={block.content || ''}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        rows={6}
                        placeholder="Schrijf hier de inhoud die onder deze kop komt..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  )}

                  {/* Paragraph Block */}
                  {block.type === 'paragraph' && (
                    <RichTextEditor
                      value={block.content || ''}
                      onChange={(val) => updateBlock(block.id, { content: val })}
                      className="min-h-[200px]"
                    />
                  )}

                  {/* Section Block */}
                  {block.type === 'section' && (
                    <div className="space-y-4">
                      {/* Controls */}
                      <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 pb-4">
                        {/* Heading Inputs */}
                        <div className="flex items-center gap-2 flex-grow max-w-lg">
                          <select
                            value={block.level || 'H2'}
                            onChange={(e) => updateBlock(block.id, { level: e.target.value as any })}
                            className="text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary p-1.5 bg-gray-50 font-bold w-16"
                          >
                            <option value="H2">H2</option>
                            <option value="H3">H3</option>
                          </select>
                          <input
                            type="text"
                            value={block.heading || ''}
                            onChange={(e) => updateBlock(block.id, { heading: e.target.value })}
                            placeholder="Sectie Titel (Optioneel)"
                            className="flex-grow text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary p-1.5"
                          />
                        </div>

                        <div className="w-px h-6 bg-gray-300 hidden sm:block"></div>

                        <div className="flex items-center gap-2">
                          <LayoutTemplate className="w-4 h-4 text-gray-500" />
                          <select
                            value={block.layout}
                            onChange={(e) => updateBlock(block.id, { layout: e.target.value as any })}
                            className="text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary p-1.5"
                          >
                            <option value="equal">50/50 Verdeling</option>
                            <option value="left-wide">Breed Links (66/33)</option>
                            <option value="right-wide">Breed Rechts (33/66)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Column 1 */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-semibold text-gray-700">Kolom 1</span>
                            <div className="flex bg-gray-100 rounded p-1">
                              <button
                                onClick={() => updateBlock(block.id, { col1Type: 'text' })}
                                className={`px-2 py-0.5 rounded text-xs ${block.col1Type === 'text' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
                              >Tekst</button>
                              <button
                                onClick={() => updateBlock(block.id, { col1Type: 'image' })}
                                className={`px-2 py-0.5 rounded text-xs ${block.col1Type === 'image' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
                              >Beeld</button>
                            </div>
                          </div>

                          {block.col1Type === 'text' ? (
                            <RichTextEditor
                              value={block.col1Content || ''}
                              onChange={(val) => updateBlock(block.id, { col1Content: val })}
                              className="min-h-[150px]"
                            />
                          ) : (
                            <div className="space-y-2">
                              {block.col1Content ? (
                                <div className="relative group">
                                  <img src={block.col1Content} alt="Col 1" className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                                  <button onClick={() => updateBlock(block.id, { col1Content: '' })} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition-colors text-center">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id={`file-col1-${block.id}`}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleSectionFileUpload(block.id, 1, file);
                                    }}
                                  />
                                  <label htmlFor={`file-col1-${block.id}`} className="cursor-pointer text-sm text-primary font-medium hover:text-primary-dark block mb-2">
                                    Upload Afbeelding
                                  </label>
                                  <input
                                    type="url"
                                    className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                    placeholder="of plak URL..."
                                    onBlur={(e) => updateBlock(block.id, { col1Content: e.target.value })}
                                  />
                                </div>
                              )}
                              <input
                                type="text"
                                placeholder="Alt tekst"
                                className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                value={block.col1ImageAlt || ''}
                                onChange={(e) => updateBlock(block.id, { col1ImageAlt: e.target.value })}
                              />
                            </div>
                          )}
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-semibold text-gray-700">Kolom 2</span>
                            <div className="flex bg-gray-100 rounded p-1">
                              <button
                                onClick={() => updateBlock(block.id, { col2Type: 'text' })}
                                className={`px-2 py-0.5 rounded text-xs ${block.col2Type === 'text' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
                              >Tekst</button>
                              <button
                                onClick={() => updateBlock(block.id, { col2Type: 'image' })}
                                className={`px-2 py-0.5 rounded text-xs ${block.col2Type === 'image' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
                              >Beeld</button>
                            </div>
                          </div>

                          {block.col2Type === 'text' ? (
                            <RichTextEditor
                              value={block.col2Content || ''}
                              onChange={(val) => updateBlock(block.id, { col2Content: val })}
                              className="min-h-[150px]"
                            />
                          ) : (
                            <div className="space-y-2">
                              {block.col2Content ? (
                                <div className="relative group">
                                  <img src={block.col2Content} alt="Col 2" className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                                  <button onClick={() => updateBlock(block.id, { col2Content: '' })} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition-colors text-center">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id={`file-col2-${block.id}`}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleSectionFileUpload(block.id, 2, file);
                                    }}
                                  />
                                  <label htmlFor={`file-col2-${block.id}`} className="cursor-pointer text-sm text-primary font-medium hover:text-primary-dark block mb-2">
                                    Upload Afbeelding
                                  </label>
                                  <input
                                    type="url"
                                    className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                    placeholder="of plak URL..."
                                    onBlur={(e) => updateBlock(block.id, { col2Content: e.target.value })}
                                  />
                                </div>
                              )}
                              <input
                                type="text"
                                placeholder="Alt tekst"
                                className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                value={block.col2ImageAlt || ''}
                                onChange={(e) => updateBlock(block.id, { col2ImageAlt: e.target.value })}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image Block */}
                  {block.type === 'image' && (
                    <div className="space-y-4">
                      {/* Media Type Selection */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateBlock(block.id, { mediaType: 'url', filePreview: '', fileName: '' })}
                          className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${block.mediaType === 'url'
                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                            }`}
                        >
                          URL Link
                        </button>
                        <button
                          onClick={() => updateBlock(block.id, { mediaType: 'image-upload', imageUrl: '' })}
                          className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${block.mediaType === 'image-upload'
                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                            }`}
                        >
                          Afbeelding Upload
                        </button>
                        <button
                          onClick={() => updateBlock(block.id, { mediaType: 'video-upload', imageUrl: '' })}
                          className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${block.mediaType === 'video-upload'
                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                            }`}
                        >
                          Video Upload
                        </button>
                      </div>

                      {/* URL Input */}
                      {block.mediaType === 'url' && (
                        <div className="space-y-3">
                          <input
                            type="url"
                            value={block.imageUrl || ''}
                            onChange={(e) => updateBlock(block.id, { imageUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                          />
                          {block.imageUrl && (
                            <div className="relative">
                              <img
                                src={block.imageUrl}
                                alt={block.imageAlt || 'Preview'}
                                className="w-full h-64 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Image Upload */}
                      {block.mediaType === 'image-upload' && (
                        <div className="space-y-3">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(block.id, file, 'image-upload');
                              }}
                              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Ondersteunde formaten: JPG, PNG, WEBP, GIF (max 5MB)
                            </p>
                          </div>
                          {block.filePreview && (
                            <div className="relative">
                              <img
                                src={block.filePreview}
                                alt={block.imageAlt || 'Preview'}
                                className="w-full h-64 object-cover rounded-lg"
                              />
                              <p className="text-sm text-gray-600 mt-2">
                                <strong>Bestand:</strong> {block.fileName}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Video Upload */}
                      {block.mediaType === 'video-upload' && (
                        <div className="space-y-3">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors">
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(block.id, file, 'video-upload');
                              }}
                              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Ondersteunde formaten: MP4, WEBM, MOV (max 50MB)
                            </p>
                          </div>
                          {block.filePreview && (
                            <div className="relative">
                              <video
                                src={block.filePreview}
                                controls
                                className="w-full h-64 rounded-lg bg-black"
                              />
                              <p className="text-sm text-gray-600 mt-2">
                                <strong>Bestand:</strong> {block.fileName}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Alt Text & Caption (for all types) */}
                      <div className="space-y-3 pt-3 border-t border-gray-200">
                        <input
                          type="text"
                          value={block.imageAlt || ''}
                          onChange={(e) => updateBlock(block.id, { imageAlt: e.target.value })}
                          placeholder="Alt Text (VERPLICHT voor SEO!) - Beschrijf wat er op de afbeelding/video staat"
                          className="w-full px-4 py-2.5 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                          required
                        />
                        <input
                          type="text"
                          value={block.imageCaption || ''}
                          onChange={(e) => updateBlock(block.id, { imageCaption: e.target.value })}
                          placeholder="Bijschrift (optioneel)"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {contentBlocks.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>Nog geen content blokken toegevoegd.</p>
                  <p className="text-sm mt-2">Klik op de knoppen hierboven om te beginnen.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Categories */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Categorisatie</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormData({ ...formData, contentType: 'article' })}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${formData.contentType === 'article'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    Artikel
                    <span className="block text-[10px] opacity-80 font-normal">Verschijnt in blog/artikelen</span>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, contentType: 'menu' })}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${formData.contentType === 'menu'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    Menu Pagina
                    <span className="block text-[10px] opacity-80 font-normal">Voor statische menu links</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Checklist */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-6">
            <h3 className="text-lg font-bold text-green-900 mb-4">✓ SEO Checklist</h3>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={!!formData.title} disabled className="rounded" />
                <span className={formData.title ? 'text-green-800' : 'text-gray-600'}>
                  H1 titel ingevuld
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.metaDescription.length >= 150} disabled className="rounded" />
                <span className={formData.metaDescription.length >= 150 ? 'text-green-800' : 'text-gray-600'}>
                  Meta beschrijving (150-160)
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={contentBlocks.some(b => b.type === 'heading')} disabled className="rounded" />
                <span className={contentBlocks.some(b => b.type === 'heading') ? 'text-green-800' : 'text-gray-600'}>
                  H2/H3 koppen toegevoegd
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={!!formData.featuredImageAlt} disabled className="rounded" />
                <span className={formData.featuredImageAlt ? 'text-green-800' : 'text-gray-600'}>
                  Alt tekst hoofdafbeelding
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={!hasImages || allImagesHaveAlt} disabled className="rounded" />
                <span className={!hasImages || allImagesHaveAlt ? 'text-green-800' : 'text-gray-600'}>
                  Alt tekst alle afbeeldingen
                </span>
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
