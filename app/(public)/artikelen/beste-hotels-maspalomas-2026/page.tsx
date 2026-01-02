import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import FeatureSnippet from '@/components/seo/FeatureSnippet';
import FAQ from '@/components/seo/FAQ';
import { Calendar, User, Clock, Share2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Beste Hotels in Maspalomas 2026 | Complete Gids',
  description: 'Ontdek de 10 beste hotels in Maspalomas voor 2026. Van luxe resorts tot budgetvriendelijke opties. Expert reviews en boekingstips.',
  keywords: ['Maspalomas hotels', 'Gran Canaria accommodatie', 'beste hotels Maspalomas'],
};

export default function BestHotelsMaspalomasArticle() {
  const breadcrumbItems = [
    { label: 'Artikelen', href: '/artikelen' },
    { label: 'Beste Hotels in Maspalomas 2026' },
  ];

  const featureFacts = [
    { label: 'Beste periode', value: 'Maart - Oktober' },
    { label: 'Gemiddelde prijs', value: '€120-250/nacht' },
    { label: 'Top locatie', value: 'Playa del Inglés' },
    { label: 'Boek van tevoren', value: '3-6 maanden' },
  ];

  const faqItems = [
    {
      question: 'Wat is het beste gebied om te verblijven in Maspalomas?',
      answer: 'De beste gebieden zijn Playa del Inglés voor levendigheid en faciliteiten, Maspalomas zelf voor rust en de duinen, en Meloneras voor luxe en exclusiviteit. Kies op basis van uw voorkeuren voor strand, restaurants en nachtleven.',
    },
    {
      question: 'Wanneer zijn de hotels in Maspalomas het goedkoopst?',
      answer: 'De laagste prijzen vindt u in november, januari en februari (buiten de kerstvakantie). Mei en juni zijn ook voordelig en hebben aangenaam weer. Vermijd schoolvakanties en de periode december-februari voor de beste deals.',
    },
    {
      question: 'Zijn all-inclusive hotels in Maspalomas de moeite waard?',
      answer: 'All-inclusive kan voordelig zijn voor gezinnen en wie graag zorgeloos vakantie houdt. Maspalomas heeft echter uitstekende restaurants, dus half-pension biedt meer flexibiliteit om de lokale keuken te ontdekken. Overweeg uw reisbudget en voorkeuren.',
    },
  ];

  return (
    <div className="bg-background">
      {/* Hero Image */}
      <div className="relative h-[500px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=800&fit=crop"
          alt="Hotels in Maspalomas"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        {/* Article Header */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <Breadcrumb items={breadcrumbItems} />

          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
              Gran Canaria
            </span>
            <span className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-sm font-medium">
              Hotels
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Beste Hotels in Maspalomas 2026
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>15 januari 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>Redactie</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>8 min leestijd</span>
            </div>
          </div>

          <p className="text-xl text-gray-700 leading-relaxed">
            Maspalomas is een van de populairste vakantiebestemmingen op Gran Canaria, bekend
            om zijn iconische duinen, prachtige stranden en uitstekende hotels. In deze
            uitgebreide gids ontdek je de beste hotels in Maspalomas voor 2026, van luxe
            resorts tot budgetvriendelijke opties.
          </p>

          <div className="flex gap-3 mt-6">
            <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              <Share2 className="w-4 h-4" />
              Delen
            </button>
          </div>
        </div>

        {/* Feature Snippet */}
        <FeatureSnippet
          title="Snel overzicht Hotels Maspalomas"
          description="De belangrijkste informatie voor uw hotelkeuze"
          facts={featureFacts}
          highlight="💡 Tip: Boek direct bij het hotel of via betrouwbare platforms zoals Booking.com voor de beste deals en flexibiliteit"
        />

        {/* Article Content */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8 prose max-w-none">
          <h2>Waarom Maspalomas?</h2>
          <p>
            Maspalomas ligt aan de zuidkust van Gran Canaria en biedt het perfecte klimaat
            voor een strandvakantie. Met meer dan 300 dagen zon per jaar, prachtige
            zandstranden en de beroemde duinen is het een ideale bestemming voor
            strandliefhebbers en zonvereerders.
          </p>

          <h2>Top 10 Hotels in Maspalomas</h2>

          <h3>1. Seaside Palm Beach (5 sterren)</h3>
          <p>
            Dit luxe resort ligt direct aan het strand en biedt uitgebreide spa-faciliteiten,
            meerdere restaurants en moderne kamers. Perfect voor een ontspannen vakantie met
            hoogwaardig comfort.
          </p>
          <ul>
            <li>Prijs: vanaf €180/nacht</li>
            <li>Locatie: Playa del Inglés, direct aan zee</li>
            <li>Highlight: Uitgebreide spa en wellness</li>
          </ul>

          <h3>2. Hotel Riu Palace Oasis (4 sterren)</h3>
          <p>
            Een all-inclusive resort met prachtige tuinen en directe toegang tot de duinen
            van Maspalomas. Ideaal voor gezinnen en wie een zorgeloze vakantie zoekt.
          </p>
          <ul>
            <li>Prijs: vanaf €145/nacht</li>
            <li>Locatie: Bij de duinen van Maspalomas</li>
            <li>Highlight: All-inclusive met topkwaliteit</li>
          </ul>

          <h3>3. Bohemia Suites & Spa (5 sterren)</h3>
          <p>
            Modern designhotel met minimalistische stijl en spectaculair rooftop zwembad.
            Perfect voor wie houdt van eigentijdse luxe en stijl.
          </p>

          <h2>Tips voor het Boeken</h2>
          <p>
            Om de beste deal te krijgen, raden we aan minimaal 3-6 maanden van tevoren te
            boeken, vooral voor de populaire maanden maart tot oktober. Vergelijk altijd
            prijzen tussen verschillende platforms en check of directe boeking via het hotel
            voordelen biedt.
          </p>

          <h2>Beste Reistijd</h2>
          <p>
            Hoewel Maspalomas het hele jaar door aangenaam weer heeft, zijn maart tot juni
            en september tot november ideaal. Het weer is perfect, de hotels zijn minder
            vol en de prijzen zijn voordeliger dan in het hoogseizoen (juli-augustus).
          </p>
        </div>

        {/* FAQ */}
        <FAQ items={faqItems} />

        {/* Related Articles */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Gerelateerde Artikelen</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/artikelen/top-10-stranden-tenerife"
              className="group flex gap-4 p-4 border border-border rounded-xl hover:border-primary hover:shadow-md transition-all"
            >
              <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1611391228629-c3742422cef9?w=200&h=200&fit=crop"
                  alt="Stranden Tenerife"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors mb-1">
                  Top 10 Stranden op Tenerife
                </h3>
                <p className="text-sm text-gray-600">De mooiste stranden van Tenerife</p>
              </div>
            </Link>
            <Link
              href="/artikelen/culinaire-hotspots-las-palmas"
              className="group flex gap-4 p-4 border border-border rounded-xl hover:border-primary hover:shadow-md transition-all"
            >
              <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop"
                  alt="Las Palmas restaurants"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors mb-1">
                  Culinaire Hotspots Las Palmas
                </h3>
                <p className="text-sm text-gray-600">Beste restaurants en tapas bars</p>
              </div>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-8 text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Klaar om te boeken?</h2>
          <p className="text-xl mb-6 text-white/90">
            Bekijk onze selectie van tophotels in Maspalomas
          </p>
          <Link
            href="/accommodaties"
            className="inline-block bg-white hover:bg-gray-100 text-primary font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Bekijk Hotels
          </Link>
        </div>
      </div>
    </div>
  );
}
