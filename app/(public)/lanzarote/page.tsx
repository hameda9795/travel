'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Breadcrumb from '@/components/layout/Breadcrumb';
import FeatureSnippet from '@/components/seo/FeatureSnippet';
import FAQ from '@/components/seo/FAQ';
import TopicCluster from '@/components/ui/TopicCluster';
import { UtensilsCrossed, Landmark, Calendar, Hotel, Palmtree, Waves, Mountain, Camera } from 'lucide-react';

interface IslandData {
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

const defaultData: IslandData = {
  heroTitle: 'Lanzarote',
  heroSubtitle: 'Het vulkanische wonder met unieke zwarte stranden en kunstwerken van César Manrique',
  heroImage: 'https://images.unsplash.com/photo-1611676083992-8d4d9f3a3c0d?w=1920&h=800&fit=crop',
  featureSnippetFacts: [
    { label: 'Beste reistijd', value: 'April - Oktober' },
    { label: 'Gemiddelde temp.', value: '20-26°C' },
    { label: 'Vliegtijd', value: '4 uur' },
    { label: 'Tijdzone', value: 'GMT+0 (WET)' },
    { label: 'Taal', value: 'Spaans' },
    { label: 'Valuta', value: 'Euro (€)' },
  ],
  featureSnippetHighlight: "💡 Lanzarote is een UNESCO Biosfeereservaat met een uniek vulkanisch landschap en prachtige kunstwerken van lokale kunstenaar César Manrique.",
  introTitle: 'Welkom op Lanzarote',
  introParagraph1: 'Lanzarote is het meest noordoostelijke eiland van de Canarische Eilanden en staat bekend om zijn dramatische vulkanische landschappen, zwarte stranden en unieke architectuur. Het eiland is een levend museum van vulkanische activiteit met meer dan 300 vulkaankraters.',
  introParagraph2: 'De visie van kunstenaar César Manrique heeft het eiland getransformeerd in een harmonieuze mix van natuur en kunst. Van de spectaculaire Jameos del Agua tot de indrukwekkende Cueva de los Verdes, Lanzarote biedt unieke ervaringen die u nergens anders zult vinden.',
  highlights: [
    { icon: 'Mountain', title: 'Timanfaya Nationaal Park', description: 'Maanachtig vulkanisch landschap met geothermische demonstraties' },
    { icon: 'Waves', title: 'Papagayo Stranden', description: 'Beschermde baai met kristalhelder water' },
    { icon: 'Camera', title: 'Jameos del Agua', description: 'Spectaculaire lavagrot omgevormd tot cultureel centrum' },
    { icon: 'Palmtree', title: 'La Geria Wijnstreek', description: 'Unieke wijngaarden in vulkanische grond' },
  ],
  topicClusters: [
    { title: 'Eten & Drinken', description: 'Ontdek de beste restaurants en lokale gerechten op Lanzarote.', href: '/lanzarote/eten-drinken', icon: 'UtensilsCrossed', articleCount: 8 },
    { title: 'Cultuur & Geschiedenis', description: 'Verken de kunstwerken van César Manrique en de geschiedenis.', href: '/lanzarote/cultuur', icon: 'Landmark', articleCount: 9 },
    { title: 'Beste Reistijd', description: 'Wanneer is de beste tijd om Lanzarote te bezoeken?', href: '/lanzarote/beste-reistijd', icon: 'Calendar', articleCount: 4 },
    { title: 'Hotels & Accommodaties', description: 'Vind uw perfecte verblijf op Lanzarote.', href: '/lanzarote/hotels', icon: 'Hotel', articleCount: 20 },
    { title: 'Stranden', description: 'Van zwarte vulkanische tot gouden zandstranden.', href: '/lanzarote/stranden', icon: 'Waves', articleCount: 10 },
    { title: 'Natuur & Wandelen', description: 'Ontdek de vulkanische landschappen van Lanzarote.', href: '/lanzarote/natuur', icon: 'Mountain', articleCount: 12 },
  ],
  faqItems: [
    {
      question: 'Wat is de beste tijd om Lanzarote te bezoeken?',
      answer: 'Lanzarote heeft het hele jaar door een aangenaam klimaat. De beste maanden zijn april tot oktober, met weinig neerslag en aangename temperaturen tussen 20-26°C.',
    },
    {
      question: 'Moet ik Timanfaya Nationaal Park bezoeken?',
      answer: 'Absoluut! Het is een unieke ervaring om het vulkanische landschap te zien. De geothermische demonstraties tonen de kracht die nog steeds onder het oppervlak ligt.',
    },
    {
      question: 'Zijn er goede stranden op Lanzarote?',
      answer: 'Ja! Naast de bekende zwarte vulkanische stranden heeft Lanzarote ook prachtige gouden stranden zoals Playa Blanca en de Papagayo stranden.',
    },
  ],
  ctaTitle: 'Klaar om Lanzarote te ontdekken?',
  ctaDescription: 'Bekijk onze selectie van de beste hotels en start uw avontuur',
  ctaButtonText: 'Bekijk hotels op Lanzarote',
};

export default function LanzarotePage() {
  const [islandData, setIslandData] = useState<IslandData>(defaultData);
  const breadcrumbItems = [{ label: 'Lanzarote' }];

  useEffect(() => {
    const savedData = localStorage.getItem('island-lanzarote');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as IslandData;
        setIslandData(parsedData);
      } catch (error) {
        console.error('Error loading island data:', error);
      }
    }
  }, []);

  // Icon mapping for highlights
  const getHighlightIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Palmtree,
      Mountain,
      Waves,
      Camera,
    };
    return icons[iconName] || Camera;
  };

  // Icon mapping for topic clusters
  const getTopicIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      UtensilsCrossed,
      Landmark,
      Calendar,
      Hotel,
      Waves,
      Mountain,
    };
    return icons[iconName] || Calendar;
  };

  // Convert topic clusters with string icon names to actual icon components
  const topicClusters = islandData.topicClusters.map(cluster => ({
    ...cluster,
    icon: getTopicIconComponent(cluster.icon),
  }));

  return (
    <div className="bg-background">
      <section className="relative h-[500px] flex items-end overflow-hidden">
        <Image
          src={islandData.heroImage}
          alt={`${islandData.heroTitle} landschap`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-white w-full">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{islandData.heroTitle}</h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-3xl">
            {islandData.heroSubtitle}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb items={breadcrumbItems} />

        <FeatureSnippet
          title={`Snel overzicht ${islandData.heroTitle}`}
          description={`De belangrijkste informatie voor uw reis naar ${islandData.heroTitle}`}
          facts={islandData.featureSnippetFacts}
          highlight={islandData.featureSnippetHighlight}
        />

        <div className="prose max-w-none mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {islandData.introTitle}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            {islandData.introParagraph1}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            {islandData.introParagraph2}
          </p>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Hoogtepunten</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {islandData.highlights.map((highlight, index) => {
              const IconComponent = getHighlightIconComponent(highlight.icon);
              return (
                <div key={index} className="bg-white p-6 rounded-xl border border-border shadow-sm">
                  <IconComponent className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{highlight.title}</h3>
                  <p className="text-gray-600">{highlight.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <TopicCluster
          title={`Ontdek meer over ${islandData.heroTitle}`}
          subtitle="Verdiep u in specifieke onderwerpen en plan uw perfecte reis"
          topics={topicClusters}
        />

        <FAQ items={islandData.faqItems} />

        <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-8 md:p-12 text-center mt-12">
          <h2 className="text-3xl font-bold mb-4">
            {islandData.ctaTitle}
          </h2>
          <p className="text-xl mb-6 text-white/90">
            {islandData.ctaDescription}
          </p>
          <a
            href="/lanzarote/hotels"
            className="inline-block bg-white hover:bg-gray-100 text-primary font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg"
          >
            {islandData.ctaButtonText}
          </a>
        </div>
      </div>
    </div>
  );
}
