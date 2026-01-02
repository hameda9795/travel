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
  heroTitle: 'Gran Canaria',
  heroSubtitle: 'Een continent in miniatuur - van gouden stranden tot groene bergen',
  heroImage: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=1920&h=800&fit=crop',
  featureSnippetFacts: [
    { label: 'Beste reistijd', value: 'Maart - Oktober' },
    { label: 'Gemiddelde temp.', value: '22-26°C' },
    { label: 'Vliegtijd', value: '4,5 uur' },
    { label: 'Tijdzone', value: 'GMT+0 (WET)' },
    { label: 'Taal', value: 'Spaans' },
    { label: 'Valuta', value: 'Euro (€)' },
  ],
  featureSnippetHighlight: "💡 Gran Canaria wordt ook wel 'een continent in miniatuur' genoemd vanwege de diverse klimaten en landschappen op het relatief kleine eiland.",
  introTitle: 'Welkom op Gran Canaria',
  introParagraph1: 'Gran Canaria is het derde grootste eiland van de Canarische Eilanden en biedt een unieke mix van spectaculaire stranden, indrukwekkende bergen, charmante dorpjes en een bruisend nachtleven. Het eiland staat bekend om zijn diverse landschappen - van de iconische duinen van Maspalomas tot de groene bergdorpen in het binnenland.',
  introParagraph2: 'Met meer dan 60 kilometer kustlijn en 300 dagen zon per jaar is Gran Canaria een paradijs voor strandliefhebbers. Maar het eiland heeft veel meer te bieden: wandelaars kunnen hun hart ophalen in de bergen, cultuurliefhebbers genieten van de historische wijken van Las Palmas, en foodies ontdekken de heerlijke Canarische keuken.',
  highlights: [
    { icon: 'Palmtree', title: 'Duinen van Maspalomas', description: 'Spectaculaire zandduinen die tot 10 meter hoog zijn' },
    { icon: 'Mountain', title: 'Roque Nublo', description: 'Iconische rotformatie op 1813 meter hoogte' },
    { icon: 'Waves', title: 'Puerto de Mogán', description: "Charmant haventje, ook wel 'Klein Venetië' genoemd" },
    { icon: 'Camera', title: 'Teror', description: 'Pittoresk dorpje met traditionele Canarische architectuur' },
  ],
  topicClusters: [
    { title: 'Eten & Drinken', description: 'Ontdek de beste restaurants, tapas bars en lokale gerechten op Gran Canaria.', href: '/gran-canaria/eten-drinken', icon: 'UtensilsCrossed', articleCount: 12 },
    { title: 'Cultuur & Geschiedenis', description: 'Verken de rijke geschiedenis en culturele bezienswaardigheden van het eiland.', href: '/gran-canaria/cultuur', icon: 'Landmark', articleCount: 8 },
    { title: 'Beste Reistijd', description: 'Wanneer is de beste tijd om Gran Canaria te bezoeken? Klimaat en weersinfo.', href: '/gran-canaria/beste-reistijd', icon: 'Calendar', articleCount: 5 },
    { title: 'Hotels & Accommodaties', description: 'Van luxe resorts tot budgetvriendelijke appartementen - vind uw perfecte verblijf.', href: '/accommodaties', icon: 'Hotel', articleCount: 25 },
    { title: 'Stranden', description: 'De mooiste stranden van Gran Canaria, van Maspalomas tot Amadores Beach.', href: '/gran-canaria/stranden', icon: 'Waves', articleCount: 15 },
    { title: 'Natuur & Wandelen', description: 'Ontdek de diverse natuur, van bergen tot groene valleien en botanische tuinen.', href: '/gran-canaria/natuur', icon: 'Mountain', articleCount: 10 },
  ],
  faqItems: [
    {
      question: 'Wat is de beste tijd om Gran Canaria te bezoeken?',
      answer: 'Gran Canaria heeft het hele jaar door aangenaam weer, maar de beste periode is van maart tot oktober. In deze maanden zijn de temperaturen ideaal (22-28°C) en is er weinig neerslag. Voor strandvakanties zijn juni tot september perfect. Voor wandelingen zijn het voorjaar (maart-mei) en najaar (september-november) ideaal vanwege de mildere temperaturen.',
    },
    {
      question: 'Hoeveel dagen heb ik nodig voor Gran Canaria?',
      answer: 'Voor een compleet beeld van Gran Canaria raden we minimaal 7 dagen aan. Dit geeft u voldoende tijd om de stranden te bezoeken, de bergen te verkennen, historische plaatsen te zien en van de lokale gastronomie te genieten. Voor een ontspannen strandvakantie zijn 5 dagen ook voldoende.',
    },
    {
      question: 'Is Gran Canaria geschikt voor gezinnen met kinderen?',
      answer: 'Absoluut! Gran Canaria is zeer kindvriendelijk met veel familiehotels, veilige stranden met rustig water, waterpretparken zoals Aqualand Maspalomas, en attracties zoals Palmitos Park. Het eiland heeft ook uitstekende gezondheidszorg en moderne faciliteiten.',
    },
    {
      question: 'Welke stranden zijn het mooiste op Gran Canaria?',
      answer: 'De populairste stranden zijn Playa de Maspalomas met zijn iconische duinen, Playa de Amadores voor gezinnen, Puerto de Mogán Beach in het charmante vissersdorpje, en Playa de las Canteras in Las Palmas. Elk strand heeft zijn eigen unieke karakter en faciliteiten.',
    },
    {
      question: 'Heb ik een auto nodig op Gran Canaria?',
      answer: 'Hoewel niet strikt noodzakelijk, is een huurauto wel aan te raden als u het eiland volledig wilt verkennen. Het openbaar vervoer (guaguas) is goed, maar met een auto bent u flexibeler en kunt u afgelegen stranden en bergdorpjes makkelijker bereiken. Parkeren is over het algemeen niet moeilijk.',
    },
  ],
  ctaTitle: 'Klaar om Gran Canaria te ontdekken?',
  ctaDescription: 'Bekijk onze selectie van de beste hotels en start uw avontuur',
  ctaButtonText: 'Bekijk hotels op Gran Canaria',
};

export default function GranCanariaPage() {
  const [islandData, setIslandData] = useState<IslandData>(defaultData);
  const breadcrumbItems = [{ label: 'Gran Canaria' }];

  useEffect(() => {
    // Load island data from localStorage
    const savedData = localStorage.getItem('island-gran-canaria');
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
      {/* Hero Section */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb items={breadcrumbItems} />

        {/* Feature Snippet */}
        <FeatureSnippet
          title={`Snel overzicht ${islandData.heroTitle}`}
          description={`De belangrijkste informatie voor uw reis naar ${islandData.heroTitle}`}
          facts={islandData.featureSnippetFacts}
          highlight={islandData.featureSnippetHighlight}
        />

        {/* Introduction */}
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

        {/* Highlights Grid */}
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

        {/* Topic Clusters */}
        <TopicCluster
          title={`Ontdek meer over ${islandData.heroTitle}`}
          subtitle="Verdiep u in specifieke onderwerpen en plan uw perfecte reis"
          topics={topicClusters}
        />

        {/* FAQ Section */}
        <FAQ items={islandData.faqItems} />

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-8 md:p-12 text-center mt-12">
          <h2 className="text-3xl font-bold mb-4">
            {islandData.ctaTitle}
          </h2>
          <p className="text-xl mb-6 text-white/90">
            {islandData.ctaDescription}
          </p>
          <a
            href="/accommodaties"
            className="inline-block bg-white hover:bg-gray-100 text-primary font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg"
          >
            {islandData.ctaButtonText}
          </a>
        </div>
      </div>
    </div>
  );
}
