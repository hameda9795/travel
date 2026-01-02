'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Breadcrumb from '@/components/layout/Breadcrumb';
import UploadedImage from '@/components/ui/UploadedImage';
import { getUploadedImage } from '@/lib/contentUpload';
import PopularAccommodations from '@/components/sections/PopularAccommodations';

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
  // Section fields
  layout?: 'equal' | 'left-wide' | 'right-wide';
  col1Type?: 'text' | 'image';
  col1Content?: string;
  col2Type?: 'text' | 'image';
  col2Content?: string;
  col1ImageAlt?: string;
  col2ImageAlt?: string;
}

interface PageData {
  title: string;
  slug: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  island?: string;
  category?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  featuredMediaType?: 'url' | 'upload';
  status?: string;
  contentBlocks?: ContentBlock[];
  createdAt?: string;
  // Old structure compatibility
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
}

export default function DynamicPage() {
  const params = useParams();
  const slugParam = params.slug;

  // Handle both string and string[] from catch-all route
  const slug = Array.isArray(slugParam) ? slugParam.join('/') : slugParam || '';

  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPageData();
  }, [slug]);

  const loadPageData = () => {
    setLoading(true);

    // Try to load content from localStorage
    const savedContent = localStorage.getItem(`page-${slug}`);

    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent) as PageData;
        setPageData(parsed);
        setLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing page data:', error);
      }
    }

    // If no content found, show 404
    setPageData(null);
    setLoading(false);
  };

  const renderContentBlock = (block: ContentBlock, index: number) => {
    const isOdd = index % 2 !== 0;
    const bgClass = isOdd ? 'bg-gray-50/80' : 'bg-white';

    // Wrapper component to handle full-width background and centered content
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <div className={`w-full py-10 ${bgClass}`}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
          {children}
        </div>
      </div>
    );

    if (block.type === 'heading') {
      const HeadingTag = block.level === 'H2' ? 'h2' : block.level === 'H3' ? 'h3' : 'h4';
      const className = block.level === 'H2'
        ? 'text-3xl font-bold text-gray-900 mb-4 mt-8'
        : block.level === 'H3'
          ? 'text-2xl font-bold text-gray-900 mb-3 mt-6'
          : 'text-xl font-semibold text-gray-900 mb-2 mt-4';

      return (
        <Wrapper key={block.id}>
          <HeadingTag className={className}>{block.heading}</HeadingTag>
          {block.content && <p className="text-lg text-gray-700 leading-relaxed mb-4">{block.content}</p>}
        </Wrapper>
      );
    }

    if (block.type === 'paragraph') {
      return (
        <Wrapper key={block.id}>
          <div
            className="text-lg text-gray-700 leading-relaxed prose max-w-none prose-a:text-[#f47f25] prose-headings:text-gray-900"
            dangerouslySetInnerHTML={{ __html: block.content || '' }}
          />
        </Wrapper>
      );
    }

    if (block.type === 'section') {
      const renderColumn = (type?: 'text' | 'image', content?: string, alt?: string) => {
        if (!content) return null;
        if (type === 'image') {
          const src = content.startsWith('/uploads/') ? getUploadedImage(content) || content : content;
          return (
            <div className="relative isolate px-4 md:px-0">
              <div className="absolute -right-2 -bottom-2 md:-right-4 md:-bottom-4 w-full h-full bg-[#f47f25] rounded-[2rem] -z-10 transform rotate-1" />
              <img src={src} alt={alt || ''} className="w-full h-auto rounded-[2rem] shadow-xl object-cover relative z-10 bg-white" />
            </div>
          );
        }
        return <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed prose-a:text-[#f47f25] prose-headings:text-gray-900 prose-headings:font-bold" dangerouslySetInnerHTML={{ __html: content }} />;
      };

      let gridCols = 'md:grid-cols-2';
      let col1Span = '';
      let col2Span = '';

      if (block.layout === 'left-wide') {
        gridCols = 'md:grid-cols-12';
        col1Span = 'md:col-span-7';
        col2Span = 'md:col-span-5';
      } else if (block.layout === 'right-wide') {
        gridCols = 'md:grid-cols-12';
        col1Span = 'md:col-span-5';
        col2Span = 'md:col-span-7';
      }

      return (
        <Wrapper key={block.id}>
          {block.heading && (
            block.level === 'H2' ? <h2 className="text-4xl font-extrabold text-gray-900 mb-8">{block.heading}</h2> :
              block.level === 'H3' ? <h3 className="text-3xl font-bold text-gray-900 mb-6">{block.heading}</h3> :
                <h4 className="text-2xl font-bold text-gray-900 mb-4">{block.heading}</h4>
          )}
          <div className={`grid grid-cols-1 ${gridCols} gap-12 md:gap-24 items-center`}>
            <div className={col1Span}>{renderColumn(block.col1Type, block.col1Content, block.col1ImageAlt)}</div>
            <div className={col2Span}>{renderColumn(block.col2Type, block.col2Content, block.col2ImageAlt)}</div>
          </div>
        </Wrapper>
      );
    }

    if (block.type === 'image' && block.imageUrl) {
      const imageSrc = block.imageUrl.startsWith('/uploads/')
        ? getUploadedImage(block.imageUrl) || block.imageUrl
        : block.imageUrl;

      return (
        <Wrapper key={block.id}>
          <figure>
            <img
              src={imageSrc}
              alt={block.imageAlt || ''}
              className="w-full h-auto rounded-lg shadow-lg"
            />
            {block.imageCaption && (
              <figcaption className="text-sm text-gray-600 mt-2 text-center italic">
                {block.imageCaption}
              </figcaption>
            )}
          </figure>
        </Wrapper>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pagina niet gevonden</h1>
          <p className="text-gray-600 mb-8">Deze pagina bestaat niet of is nog niet gemaakt.</p>
          <a href="/" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg inline-block">
            Terug naar home
          </a>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [{ label: pageData.title || 'Pagina' }];

  // Get featured image source
  const featuredImageSrc = pageData.featuredImage
    ? (pageData.featuredImage.startsWith('/uploads/')
      ? getUploadedImage(pageData.featuredImage) || pageData.featuredImage
      : pageData.featuredImage)
    : null;

  return (
    <div className="bg-background">
      {/* Hero Section */}
      {featuredImageSrc && (
        <section className="relative h-[500px] flex items-end overflow-hidden">
          <img
            src={featuredImageSrc}
            alt={pageData.featuredImageAlt || pageData.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-white w-full">
            <Breadcrumb items={breadcrumbItems} />
            <h1 className="text-5xl font-bold mb-4 mt-6">{pageData.title}</h1>
            {pageData.excerpt && (
              <p className="text-xl text-white/90 max-w-3xl">{pageData.excerpt}</p>
            )}
          </div>
        </section>
      )}

      {/* Content Section */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        {!featuredImageSrc && (
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
            <h1 className="text-5xl font-bold text-gray-900 mb-4 mt-6">{pageData.title}</h1>
            {pageData.excerpt && (
              <p className="text-xl text-gray-600 max-w-3xl">{pageData.excerpt}</p>
            )}
          </div>
        )}

        {/* Content Blocks */}
        <article className="w-full">
          {pageData.contentBlocks && pageData.contentBlocks.map((block, index) => renderContentBlock(block, index))}

          {(!pageData.contentBlocks || pageData.contentBlocks.length === 0) && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                Deze pagina heeft nog geen content. Ga naar Content Beheer om content toe te voegen.
              </p>
            </div>
          )}
        </article>

        {/* Meta Info */}
        {pageData.island && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Eiland:</span>
                <span>{pageData.island}</span>
              </div>
              {pageData.category && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Categorie:</span>
                  <span>{pageData.category}</span>
                </div>
              )}
              {pageData.createdAt && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Gepubliceerd:</span>
                  <span>{new Date(pageData.createdAt).toLocaleDateString('nl-NL')}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <PopularAccommodations />
    </div>
  );
}
