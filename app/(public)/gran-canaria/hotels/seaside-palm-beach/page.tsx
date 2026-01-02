import type { Metadata } from 'next';
import Image from 'next/image';
import Breadcrumb from '@/components/layout/Breadcrumb';
import FeatureSnippet from '@/components/seo/FeatureSnippet';
import ProsConsList from '@/components/seo/ProsConsList';
import FAQ from '@/components/seo/FAQ';
import { Star, MapPin, Wifi, UtensilsCrossed, Dumbbell, Waves, Phone, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Seaside Palm Beach Gran Canaria | 5-Sterren Luxe Resort Review 2026',
  description:
    'Uitgebreide review van Seaside Palm Beach in Maspalomas. Ontdek faciliteiten, prijzen, voor- en nadelen. Expertadvies voor uw perfecte verblijf.',
  keywords: ['Seaside Palm Beach', 'hotel Maspalomas', '5 sterren Gran Canaria', 'luxe resort'],
};

export default function SeasidePalmBeachPage() {
  const breadcrumbItems = [
    { label: 'Gran Canaria', href: '/gran-canaria' },
    { label: 'Hotels', href: '/gran-canaria/hotels' },
    { label: 'Seaside Palm Beach' },
  ];

  const hotelFacts = [
    { label: 'Sterren', value: '⭐⭐⭐⭐⭐' },
    { label: 'Locatie', value: 'Maspalomas' },
    { label: 'Vanaf prijs', value: '€180/nacht' },
    { label: 'Check-in', value: '15:00' },
    { label: 'Check-out', value: '11:00' },
    { label: 'Beoordeling', value: '4.7/5 (2341 reviews)' },
  ];

  const pros = [
    'Directe ligging aan het prachtige strand van Maspalomas',
    'Uitgebreide spa met Turkse bad, sauna en behandelkamers',
    'Meerdere restaurants met internationale en lokale keuken',
    'Groot zwembadcomplex met aparte kinderbaden',
    'Moderne, ruime kamers met balkon of terras',
    'Uitstekende service en vriendelijk personeel',
    'Gratis wifi in het hele resort',
    'Goede fitnessruimte met moderne apparatuur',
  ];

  const cons = [
    'Prijzig, vooral in het hoogseizoen',
    'Sommige kamers hebben geen zeezicht',
    'Kan druk zijn tijdens schoolvakanties',
    'Parkeren kost extra (€15/dag)',
  ];

  const faqItems = [
    {
      question: 'Is Seaside Palm Beach geschikt voor gezinnen?',
      answer:
        'Ja, absoluut! Het hotel beschikt over een apart kinderbad, kinderclub met dagelijkse activiteiten, en een speeltuin. De kamers zijn ruim genoeg voor gezinnen en er zijn familiekamers beschikbaar. Het restaurant heeft een kindermenu en kinderstoelen.',
    },
    {
      question: 'Hoe ver is het hotel van de luchthaven?',
      answer:
        'De afstand van Gran Canaria Airport naar Seaside Palm Beach is ongeveer 32 kilometer. De transfertijd is ongeveer 30-40 minuten, afhankelijk van het verkeer. Het hotel biedt een betaalde shuttleservice aan, of u kunt een taxi/huurauto nemen.',
    },
    {
      question: 'Zijn er all-inclusive opties beschikbaar?',
      answer:
        'Ja, het hotel biedt verschillende opties: half pension (ontbijt + diner), all-inclusive (alle maaltijden en lokale dranken), en all-inclusive premium (inclusief merkdranken en minibar). All-inclusive is vooral voordelig voor gezinnen.',
    },
    {
      question: 'Kan ik de spa faciliteiten gebruiken?',
      answer:
        'De basis spa-faciliteiten (Turkse bad, sauna, jacuzzi) zijn gratis toegankelijk voor hotelgasten. Voor massages en beauty behandelingen moet u wel apart betalen. Reserveren wordt aanbevolen, vooral in het hoogseizoen.',
    },
  ];

  // Schema.org structured data for Hotel
  const hotelSchema = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: 'Seaside Palm Beach',
    description: 'Luxueus 5-sterren resort direct aan het strand van Maspalomas',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Avenida del Oasis',
      addressLocality: 'Maspalomas',
      addressRegion: 'Gran Canaria',
      postalCode: '35100',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '27.7466',
      longitude: '-15.5852',
    },
    starRating: {
      '@type': 'Rating',
      ratingValue: '5',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '2341',
    },
    priceRange: '€€€€',
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Spa' },
      { '@type': 'LocationFeatureSpecification', name: 'Restaurant' },
      { '@type': 'LocationFeatureSpecification', name: 'Pool' },
      { '@type': 'LocationFeatureSpecification', name: 'Fitness Center' },
      { '@type': 'LocationFeatureSpecification', name: 'Free WiFi' },
    ],
  };

  return (
    <div className="bg-background">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }}
      />

      {/* Hero Gallery */}
      <section className="relative h-[500px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=800&fit=crop"
          alt="Seaside Palm Beach Resort"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-secondary text-secondary" />
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Seaside Palm Beach
            </h1>
            <div className="flex items-center gap-2 text-white text-lg">
              <MapPin className="w-5 h-5" />
              <span>Maspalomas, Gran Canaria</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Rating & Booking Bar */}
        <div className="bg-white border border-border rounded-xl p-6 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="bg-primary text-white text-3xl font-bold px-4 py-2 rounded-lg mb-1">
                4.7
              </div>
              <p className="text-sm text-gray-600">Uitstekend</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gebaseerd op</p>
              <p className="text-lg font-semibold">2,341 reviews</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600 mb-1">Vanaf</p>
            <p className="text-3xl font-bold text-primary mb-2">€180</p>
            <p className="text-sm text-gray-600 mb-3">per nacht</p>
            <button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors w-full md:w-auto">
              Boek nu
            </button>
          </div>
        </div>

        {/* Feature Snippet */}
        <FeatureSnippet
          title="Hotel informatie"
          facts={hotelFacts}
          highlight="💡 Beste tip: Boek een kamer met zeezicht voor een spectaculair uitzicht op de Atlantische Oceaan en de beroemde duinen van Maspalomas."
        />

        {/* Description */}
        <div className="prose max-w-none mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Over dit hotel</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Seaside Palm Beach is een luxueus 5-sterren resort gelegen aan het prachtige
            strand van Maspalomas op Gran Canaria. Dit resort combineert moderne elegantie
            met traditionele Canarische gastvrijheid en biedt een onvergetelijke
            vakantie-ervaring.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Het hotel beschikt over 328 ruime kamers en suites, elk voorzien van moderne
            voorzieningen zoals airconditioning, flatscreen-tv, minibar en een privébalkon
            of terras. De meeste kamers bieden een schitterend uitzicht op de oceaan of de
            tropische tuinen.
          </p>
        </div>

        {/* Facilities Grid */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">Faciliteiten</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 bg-white p-6 rounded-xl border border-border">
              <Waves className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Zwembaden</h3>
                <p className="text-sm text-gray-600">
                  3 buitenzwembaden, waarvan 1 verwarmd en 1 kinderbad
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white p-6 rounded-xl border border-border">
              <UtensilsCrossed className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Restaurants</h3>
                <p className="text-sm text-gray-600">
                  4 restaurants met internationale en Canarische gerechten
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white p-6 rounded-xl border border-border">
              <Dumbbell className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Fitness & Wellness</h3>
                <p className="text-sm text-gray-600">
                  Moderne fitnessruimte en uitgebreide spa met massages
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white p-6 rounded-xl border border-border">
              <Wifi className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Gratis WiFi</h3>
                <p className="text-sm text-gray-600">
                  Snel internet in alle kamers en openbare ruimtes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white p-6 rounded-xl border border-border">
              <MapPin className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Toplocatie</h3>
                <p className="text-sm text-gray-600">
                  Direct aan het strand en 5 min van centrum Maspalomas
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white p-6 rounded-xl border border-border">
              <Star className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Kinderclub</h3>
                <p className="text-sm text-gray-600">
                  Dagelijkse activiteiten voor kinderen van 4-12 jaar
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pros & Cons */}
        <ProsConsList pros={pros} cons={cons} />

        {/* FAQ */}
        <FAQ items={faqItems} />

        {/* Contact Information */}
        <section className="bg-muted rounded-xl p-8 mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Contact & Locatie</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Contactgegevens</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+34 928 123 456</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>info@seasidepalmbeach.com</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <span>
                    Avenida del Oasis
                    <br />
                    35100 Maspalomas
                    <br />
                    Gran Canaria, Spanje
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Locatie</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Strand: Direct aan het strand</li>
                <li>• Centrum Maspalomas: 5 minuten</li>
                <li>• Duinen van Maspalomas: 10 minuten lopen</li>
                <li>• Luchthaven: 32 km (30-40 min)</li>
                <li>• Yumbo Centrum: 2 km</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
