'use client';

import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Eye, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface IslandData {
  name: string;
  slug: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  featureSnippetFacts: { label: string; value: string }[];
  featureSnippetHighlight: string;
  introTitle: string;
  introParagraph1: string;
  introParagraph2: string;
  highlights: { icon: string; title: string; description: string }[];
  topicClusters: { title: string; description: string; href: string; icon: string; articleCount: number }[];
  faqItems: { question: string; answer: string }[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
}

export default function EditIslandPage() {
  const params = useParams();
  const slugParam = params.slug;
  const slug = Array.isArray(slugParam) ? slugParam.join('/') : slugParam as string;
  const [islandData, setIslandData] = useState<IslandData | null>(null);
  const [pageType, setPageType] = useState<'island' | 'menu'>('island');

  useEffect(() => {
    // Check if it's an island or menu item
    const islands = JSON.parse(localStorage.getItem('canary-islands') || '[]');
    const isIsland = islands.some((island: string) =>
      island.toLowerCase().replace(/\s+/g, '-') === slug
    );

    if (isIsland) {
      setPageType('island');
    } else {
      // Check if it's a menu item
      const menuItems = JSON.parse(localStorage.getItem('site-menu') || '[]');
      const isMenuItem = menuItems.some((item: any) => item.slug === slug);
      if (isMenuItem) {
        setPageType('menu');
      }
    }

    // Load page data from localStorage
    const savedIslandData = localStorage.getItem(`island-${slug}`);
    const savedPageData = localStorage.getItem(`page-${slug}`);

    if (savedIslandData) {
      setIslandData(JSON.parse(savedIslandData));
    } else if (savedPageData) {
      setIslandData(JSON.parse(savedPageData));
    } else {
      // Initialize with default data
      const pageName = slug.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      setIslandData({
        name: pageName,
        slug: slug,
        heroTitle: pageName,
        heroSubtitle: 'Ontdek de schoonheid van ' + pageName,
        heroImage: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=1920&h=800&fit=crop',
        featureSnippetFacts: [
          { label: 'Beste reistijd', value: 'Maart - Oktober' },
          { label: 'Gemiddelde temp.', value: '22-26°C' },
          { label: 'Vliegtijd', value: '4,5 uur' },
          { label: 'Tijdzone', value: 'GMT+0 (WET)' },
          { label: 'Taal', value: 'Spaans' },
          { label: 'Valuta', value: 'Euro (€)' },
        ],
        featureSnippetHighlight: `💡 ${pageName} - ontdek de mogelijkheden en plan uw perfecte reis.`,
        introTitle: `Welkom bij ${pageName}`,
        introParagraph1: `Ontdek alles wat u moet weten over ${pageName}. Deze pagina biedt uitgebreide informatie en tips.`,
        introParagraph2: 'Met zijn unieke karakter en diversiteit biedt dit voor elk wat wils...',
        highlights: [
          { icon: 'Palmtree', title: 'Hoogtepunt 1', description: 'Beschrijving van het eerste hoogtepunt' },
          { icon: 'Mountain', title: 'Hoogtepunt 2', description: 'Beschrijving van het tweede hoogtepunt' },
          { icon: 'Waves', title: 'Hoogtepunt 3', description: 'Beschrijving van het derde hoogtepunt' },
          { icon: 'Camera', title: 'Hoogtepunt 4', description: 'Beschrijving van het vierde hoogtepunt' },
        ],
        topicClusters: [
          { title: 'Eten & Drinken', description: 'Ontdek de beste restaurants en lokale gerechten', href: `/${slug}/eten-drinken`, icon: 'UtensilsCrossed', articleCount: 8 },
          { title: 'Cultuur & Geschiedenis', description: 'Verken de rijke geschiedenis en cultuur', href: `/${slug}/cultuur`, icon: 'Landmark', articleCount: 6 },
          { title: 'Beste Reistijd', description: 'Wanneer is de beste tijd om te bezoeken?', href: `/${slug}/beste-reistijd`, icon: 'Calendar', articleCount: 4 },
          { title: 'Hotels & Accommodaties', description: 'Vind uw perfecte verblijf', href: `/${slug}/hotels`, icon: 'Hotel', articleCount: 20 },
          { title: 'Activiteiten', description: 'De leukste dingen om te doen', href: `/${slug}/activiteiten`, icon: 'Waves', articleCount: 12 },
          { title: 'Natuur & Wandelen', description: 'Ontdek de diverse natuur', href: `/${slug}/natuur`, icon: 'Mountain', articleCount: 10 },
        ],
        faqItems: [
          {
            question: `Wat is de beste tijd om ${pageName} te bezoeken?`,
            answer: 'Het hele jaar door aangenaam weer...',
          },
          {
            question: `Hoeveel dagen heb ik nodig?`,
            answer: 'Minimaal 7 dagen voor een compleet beeld...',
          },
          {
            question: `Is dit geschikt voor gezinnen met kinderen?`,
            answer: 'Absoluut! Er zijn vele faciliteiten...',
          },
        ],
        ctaTitle: `Klaar om ${pageName} te ontdekken?`,
        ctaDescription: 'Bekijk onze selectie en start uw avontuur',
        ctaButtonText: `Meer over ${pageName}`,
      });
    }
  }, [slug]);

  const handleSave = () => {
    if (islandData) {
      if (pageType === 'island') {
        localStorage.setItem(`island-${slug}`, JSON.stringify(islandData));
        alert('Eiland gegevens opgeslagen!');
      } else {
        localStorage.setItem(`page-${slug}`, JSON.stringify(islandData));
        alert('Pagina gegevens opgeslagen!');
      }
    }
  };

  if (!islandData) return <div>Laden...</div>;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/islands"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{islandData.name} Bewerken</h1>
            <p className="text-gray-600 mt-1">Beheer alle content voor de {islandData.name} pagina</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/${slug}`}
            target="_blank"
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <Eye className="w-5 h-5" />
            Preview
          </Link>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            Opslaan
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Hero Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hero Sectie</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titel
                </label>
                <input
                  type="text"
                  value={islandData.heroTitle}
                  onChange={(e) => setIslandData({ ...islandData, heroTitle: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-xl font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ondertitel
                </label>
                <textarea
                  value={islandData.heroSubtitle}
                  onChange={(e) => setIslandData({ ...islandData, heroSubtitle: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Afbeelding URL
                </label>
                <input
                  type="url"
                  value={islandData.heroImage}
                  onChange={(e) => setIslandData({ ...islandData, heroImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
                {islandData.heroImage && (
                  <img src={islandData.heroImage} alt="Hero preview" className="w-full h-48 object-cover rounded-lg mt-2" />
                )}
              </div>
            </div>
          </div>

          {/* Feature Snippet */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Feature Snippet Feiten</h2>
            <div className="space-y-3 mb-4">
              {islandData.featureSnippetFacts.map((fact, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Label"
                    value={fact.label}
                    onChange={(e) => {
                      const newFacts = [...islandData.featureSnippetFacts];
                      newFacts[index].label = e.target.value;
                      setIslandData({ ...islandData, featureSnippetFacts: newFacts });
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Waarde"
                    value={fact.value}
                    onChange={(e) => {
                      const newFacts = [...islandData.featureSnippetFacts];
                      newFacts[index].value = e.target.value;
                      setIslandData({ ...islandData, featureSnippetFacts: newFacts });
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Highlight Tip
              </label>
              <input
                type="text"
                value={islandData.featureSnippetHighlight}
                onChange={(e) => setIslandData({ ...islandData, featureSnippetHighlight: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Introductie</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sectie Titel
                </label>
                <input
                  type="text"
                  value={islandData.introTitle}
                  onChange={(e) => setIslandData({ ...islandData, introTitle: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paragraaf 1
                </label>
                <textarea
                  value={islandData.introParagraph1}
                  onChange={(e) => setIslandData({ ...islandData, introParagraph1: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paragraaf 2
                </label>
                <textarea
                  value={islandData.introParagraph2}
                  onChange={(e) => setIslandData({ ...islandData, introParagraph2: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hoogtepunten (4 items)</h2>
            <div className="space-y-4">
              {islandData.highlights.map((highlight, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500 mb-3">Hoogtepunt {index + 1}</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Icon (bijv. Palmtree, Mountain, Waves, Camera)</label>
                      <input
                        type="text"
                        value={highlight.icon}
                        onChange={(e) => {
                          const newHighlights = [...islandData.highlights];
                          newHighlights[index].icon = e.target.value;
                          setIslandData({ ...islandData, highlights: newHighlights });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Titel</label>
                      <input
                        type="text"
                        value={highlight.title}
                        onChange={(e) => {
                          const newHighlights = [...islandData.highlights];
                          newHighlights[index].title = e.target.value;
                          setIslandData({ ...islandData, highlights: newHighlights });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Beschrijving</label>
                      <textarea
                        value={highlight.description}
                        onChange={(e) => {
                          const newHighlights = [...islandData.highlights];
                          newHighlights[index].description = e.target.value;
                          setIslandData({ ...islandData, highlights: newHighlights });
                        }}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Clusters Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Topic Clusters (6 items)</h2>
              <button
                onClick={() => {
                  if (islandData.topicClusters.length < 6) {
                    const newClusters = [...islandData.topicClusters, {
                      title: '',
                      description: '',
                      href: `/${slug}/nieuw-onderwerp`,
                      icon: 'Calendar',
                      articleCount: 0
                    }];
                    setIslandData({ ...islandData, topicClusters: newClusters });
                  }
                }}
                disabled={islandData.topicClusters.length >= 6}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Cluster Toevoegen
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Deze sectie toont de verschillende onderwerpen voor {islandData.name}. Normaal 6 clusters.
            </p>
            <div className="space-y-4">
              {islandData.topicClusters.map((cluster, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-sm font-medium text-gray-500">Cluster {index + 1}</p>
                    <button
                      onClick={() => {
                        const newClusters = islandData.topicClusters.filter((_, i) => i !== index);
                        setIslandData({ ...islandData, topicClusters: newClusters });
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Titel</label>
                        <input
                          type="text"
                          value={cluster.title}
                          onChange={(e) => {
                            const newClusters = [...islandData.topicClusters];
                            newClusters[index].title = e.target.value;
                            setIslandData({ ...islandData, topicClusters: newClusters });
                          }}
                          placeholder="bijv. Eten & Drinken"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Icon naam (bijv. UtensilsCrossed, Landmark, Calendar, Hotel, Waves, Mountain)</label>
                        <input
                          type="text"
                          value={cluster.icon}
                          onChange={(e) => {
                            const newClusters = [...islandData.topicClusters];
                            newClusters[index].icon = e.target.value;
                            setIslandData({ ...islandData, topicClusters: newClusters });
                          }}
                          placeholder="bijv. UtensilsCrossed"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Beschrijving</label>
                      <textarea
                        value={cluster.description}
                        onChange={(e) => {
                          const newClusters = [...islandData.topicClusters];
                          newClusters[index].description = e.target.value;
                          setIslandData({ ...islandData, topicClusters: newClusters });
                        }}
                        rows={2}
                        placeholder="Korte beschrijving van dit onderwerp"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Link URL (relatief)</label>
                        <input
                          type="text"
                          value={cluster.href}
                          onChange={(e) => {
                            const newClusters = [...islandData.topicClusters];
                            newClusters[index].href = e.target.value;
                            setIslandData({ ...islandData, topicClusters: newClusters });
                          }}
                          placeholder={`/${slug}/eten-drinken`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Aantal artikelen</label>
                        <input
                          type="number"
                          value={cluster.articleCount}
                          onChange={(e) => {
                            const newClusters = [...islandData.topicClusters];
                            newClusters[index].articleCount = parseInt(e.target.value) || 0;
                            setIslandData({ ...islandData, topicClusters: newClusters });
                          }}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">FAQ Items</h2>
              <button
                onClick={() => {
                  const newFAQs = [...islandData.faqItems, { question: '', answer: '' }];
                  setIslandData({ ...islandData, faqItems: newFAQs });
                }}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                FAQ Toevoegen
              </button>
            </div>
            <div className="space-y-4">
              {islandData.faqItems.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-sm font-medium text-gray-500">FAQ {index + 1}</p>
                    <button
                      onClick={() => {
                        const newFAQs = islandData.faqItems.filter((_, i) => i !== index);
                        setIslandData({ ...islandData, faqItems: newFAQs });
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Vraag</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          const newFAQs = [...islandData.faqItems];
                          newFAQs[index].question = e.target.value;
                          setIslandData({ ...islandData, faqItems: newFAQs });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Antwoord</label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => {
                          const newFAQs = [...islandData.faqItems];
                          newFAQs[index].answer = e.target.value;
                          setIslandData({ ...islandData, faqItems: newFAQs });
                        }}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Call-to-Action Sectie</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTA Titel
                </label>
                <input
                  type="text"
                  value={islandData.ctaTitle}
                  onChange={(e) => setIslandData({ ...islandData, ctaTitle: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTA Beschrijving
                </label>
                <textarea
                  value={islandData.ctaDescription}
                  onChange={(e) => setIslandData({ ...islandData, ctaDescription: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Tekst
                </label>
                <input
                  type="text"
                  value={islandData.ctaButtonText}
                  onChange={(e) => setIslandData({ ...islandData, ctaButtonText: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 sticky top-6">
            <h3 className="text-lg font-bold text-green-900 mb-4">✓ Status</h3>
            <div className="space-y-2 text-sm">
              <p className="text-green-800">
                <strong>Eiland:</strong> {islandData.name}
              </p>
              <p className="text-green-800">
                <strong>URL:</strong> /{slug}
              </p>
              <p className="text-green-800">
                <strong>Hero afbeelding:</strong> {islandData.heroImage ? '✓' : '✗'}
              </p>
              <p className="text-green-800">
                <strong>Feiten:</strong> {islandData.featureSnippetFacts.length}
              </p>
              <p className="text-green-800">
                <strong>Hoogtepunten:</strong> {islandData.highlights.length}
              </p>
              <p className="text-green-800">
                <strong>Topic Clusters:</strong> {islandData.topicClusters.length}
              </p>
              <p className="text-green-800">
                <strong>FAQ items:</strong> {islandData.faqItems.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
