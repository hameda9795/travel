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
  heroTitle: 'Fuerteventura',
  heroSubtitle: 'Het paradijs voor strandliefhebbers en watersporters met eindeloze stranden',
  heroImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1920&h=800&fit=crop',
  featureSnippetFacts: [
    { label: 'Beste reistijd', value: 'Mei - Oktober' },
    { label: 'Gemiddelde temp.', value: '20-27°C' },
    { label: 'Vliegtijd', value: '4,5 uur' },
    { label: 'Tijdzone', value: 'GMT+0 (WET)' },
    { label: 'Taal', value: 'Spaans' },
    { label: 'Valuta', value: 'Euro (€)' },
  ],
  featureSnippetHighlight: "💡 Fuerteventura heeft meer dan 150 km aan prachtige stranden en is een UNESCO Biosfeereservaat - perfect voor watersport en strandvakanties.",
  introTitle: 'Welkom op Fuerteventura',
  introParagraph1: 'Fuerteventura is het op één na grootste eiland van de Canarische Eilanden en staat bekend om zijn eindeloze stranden, kristalhelder water en perfecte condities voor watersport. Met meer dan 150 kilometer kustlijn is dit een waar paradijs voor strandliefhebbers en surfers.',
  introParagraph2: 'Het eiland combineert een relaxte sfeer met adembenemende natuurlijke schoonheid. Van de gouden duinen van Corralejo tot de rustige baaien van de zuidkust, Fuerteventura biedt een ontspannen eilandervaring met 300 dagen zon per jaar.',
  highlights: [
    { icon: 'Waves', title: 'Corralejo Duinen', description: 'Spectaculair natuurpark met witte zandduinen' },
    { icon: 'Palmtree', title: 'Playa de Sotavento', description: 'Kilometers lang strand perfect voor kitesurfen' },
    { icon: 'Mountain', title: 'Betancuria', description: 'Historische hoofdstad in de bergen' },
    { icon: 'Camera', title: 'Cofete Beach', description: 'Wilde en ongerepte kust met dramatische bergen' },
  ],
  topicClusters: [
    { title: 'Eten & Drinken', description: 'Ontdek de beste restaurants en lokale gerechten op Fuerteventura.', href: '/fuerteventura/eten-drinken', icon: 'UtensilsCrossed', articleCount: 7 },
    { title: 'Cultuur & Geschiedenis', description: 'Verken de geschiedenis en charme van Fuerteventura.', href: '/fuerteventura/cultuur', icon: 'Landmark', articleCount: 6 },
    { title: 'Beste Reistijd', description: 'Wanneer is de beste tijd om Fuerteventura te bezoeken?', href: '/fuerteventura/beste-reistijd', icon: 'Calendar', articleCount: 4 },
    { title: 'Hotels & Accommodaties', description: 'Vind uw perfecte strandhotel op Fuerteventura.', href: '/fuerteventura/hotels', icon: 'Hotel', articleCount: 22 },
    { title: 'Stranden', description: 'Meer dan 150km aan prachtige stranden.', href: '/fuerteventura/stranden', icon: 'Waves', articleCount: 18 },
    { title: 'Watersport', description: 'Surfen, kitesurfen en meer op Fuerteventura.', href: '/fuerteventura/watersport', icon: 'Mountain', articleCount: 14 },
  ],
  faqItems: [
    {
      question: 'Wat is de beste tijd om Fuerteventura te bezoeken?',
      answer: 'Fuerteventura heeft het hele jaar door mooi weer. De beste maanden zijn mei tot oktober voor strandvakanties. Voor windsurfen en kitesurfen zijn juli en augustus ideaal vanwege de constante wind.',
    },
    {
      question: 'Is Fuerteventura goed voor watersport?',
      answer: 'Ja! Fuerteventura wordt beschouwd als een van de beste plekken in Europa voor windsurfen en kitesurfen. De constante passaatwinden en uitgestrekte stranden maken het perfect voor alle niveaus.',
    },
    {
      question: 'Zijn er bezienswaardigheden naast stranden?',
      answer: 'Zeker! Bezoek het historische Betancuria, ontdek de duinen van Corralejo, verken de grottekerk Ermita de la Peña, of maak een boottocht naar Isla de Lobos.',
    },
  ],
  ctaTitle: 'Klaar om Fuerteventura te ontdekken?',
  ctaDescription: 'Bekijk onze selectie van de beste hotels en start uw avontuur',
  ctaButtonText: 'Bekijk hotels op Fuerteventura',
};

export default function FuerteventuraPage() {
  const [islandData, setIslandData] = useState<IslandData>(defaultData);
  const breadcrumbItems = [{ label: 'Fuerteventura' }];

  useEffect(() => {
    const savedData = localStorage.getItem('island-fuerteventura');
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
            href="/fuerteventura/hotels"
            className="inline-block bg-white hover:bg-gray-100 text-primary font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg"
          >
            {islandData.ctaButtonText}
          </a>
        </div>
      </div>
    </div>
  );
}
