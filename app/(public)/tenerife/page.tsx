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
  heroTitle: 'Tenerife',
  heroSubtitle: 'Het grootste Canarische eiland met de majestueuze Teide vulkaan',
  heroImage: 'https://images.unsplash.com/photo-1508373881411-2e45cf8b2c7e?w=1920&h=800&fit=crop',
  featureSnippetFacts: [
    { label: 'Beste reistijd', value: 'Maart - Oktober' },
    { label: 'Gemiddelde temp.', value: '21-28°C' },
    { label: 'Vliegtijd', value: '4,5 uur' },
    { label: 'Tijdzone', value: 'GMT+0 (WET)' },
    { label: 'Taal', value: 'Spaans' },
    { label: 'Valuta', value: 'Euro (€)' },
  ],
  featureSnippetHighlight: "💡 Tenerife is het grootste en meest gevarieerde eiland van de Canarische Eilanden, met de hoogste berg van Spanje - de Teide vulkaan.",
  introTitle: 'Welkom op Tenerife',
  introParagraph1: 'Tenerife is het grootste en meest bezochte eiland van de Canarische Eilanden. Het biedt een perfecte mix van prachtige stranden, spectaculaire natuur, levendige steden en een rijk cultureel erfgoed. De majestueuze Teide vulkaan domineert het landschap en is met 3.718 meter de hoogste berg van Spanje.',
  introParagraph2: 'Van de bruisende resorts in het zuiden tot de groene valleien in het noorden, Tenerife heeft voor ieder wat wils. Het eiland staat bekend om zijn uitstekende infrastructuur, heerlijke Canarische keuken en het aangename klimaat het hele jaar door.',
  highlights: [
    { icon: 'Mountain', title: 'Teide Nationaal Park', description: 'UNESCO werelderfgoed met spectaculaire vulkanische landschappen' },
    { icon: 'Waves', title: 'Playa de las Teresitas', description: 'Goudkleurig zandstrand met palmbomen' },
    { icon: 'Camera', title: 'Masca vallei', description: 'Pittoresk bergdorpje met adembenemende uitzichten' },
    { icon: 'Palmtree', title: 'Loro Parque', description: 'Wereldberoemd dierenpark met tropische shows' },
  ],
  topicClusters: [
    { title: 'Eten & Drinken', description: 'Ontdek de beste restaurants en lokale gerechten op Tenerife.', href: '/tenerife/eten-drinken', icon: 'UtensilsCrossed', articleCount: 10 },
    { title: 'Cultuur & Geschiedenis', description: 'Verken de rijke geschiedenis en culturele bezienswaardigheden.', href: '/tenerife/cultuur', icon: 'Landmark', articleCount: 7 },
    { title: 'Beste Reistijd', description: 'Wanneer is de beste tijd om Tenerife te bezoeken?', href: '/tenerife/beste-reistijd', icon: 'Calendar', articleCount: 4 },
    { title: 'Hotels & Accommodaties', description: 'Vind uw perfecte verblijf op Tenerife.', href: '/tenerife/hotels', icon: 'Hotel', articleCount: 30 },
    { title: 'Stranden', description: 'De mooiste stranden van Tenerife.', href: '/tenerife/stranden', icon: 'Waves', articleCount: 12 },
    { title: 'Natuur & Wandelen', description: 'Ontdek de diverse natuur van Tenerife.', href: '/tenerife/natuur', icon: 'Mountain', articleCount: 15 },
  ],
  faqItems: [
    {
      question: 'Wat is de beste tijd om Tenerife te bezoeken?',
      answer: 'Tenerife heeft het hele jaar door aangenaam weer. Het zuiden is droger en warmer, terwijl het noorden groener en koeler is. De beste maanden zijn maart tot oktober voor strandvakanties.',
    },
    {
      question: 'Moet ik de Teide vulkaan bezoeken?',
      answer: 'Absoluut! Het Teide Nationaal Park is een must-see. U kunt met de kabelbaan naar boven of wandelen. Boek wel van tevoren een vergunning als u helemaal naar de top wilt.',
    },
    {
      question: 'Is Tenerife geschikt voor gezinnen?',
      answer: 'Ja, Tenerife is zeer kindvriendelijk met vele attracties zoals Siam Park (waterpark), Loro Parque, en veilige stranden met faciliteiten.',
    },
  ],
  ctaTitle: 'Klaar om Tenerife te ontdekken?',
  ctaDescription: 'Bekijk onze selectie van de beste hotels en start uw avontuur',
  ctaButtonText: 'Bekijk hotels op Tenerife',
};

export default function TenerifePage() {
  const [islandData, setIslandData] = useState<IslandData>(defaultData);
  const breadcrumbItems = [{ label: 'Tenerife' }];

  useEffect(() => {
    const savedData = localStorage.getItem('island-tenerife');
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
            href="/tenerife/hotels"
            className="inline-block bg-white hover:bg-gray-100 text-primary font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg"
          >
            {islandData.ctaButtonText}
          </a>
        </div>
      </div>
    </div>
  );
}
