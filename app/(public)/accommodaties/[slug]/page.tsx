'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProsConsList from '@/components/seo/ProsConsList';
import FAQ from '@/components/seo/FAQ';
import { Star, MapPin, Wifi, UtensilsCrossed, Dumbbell, Waves, Euro } from 'lucide-react';
import { getAccommodationBySlug, type Accommodation } from '@/lib/accommodations';

export default function AccommodationDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccommodation = () => {
      const data = getAccommodationBySlug(slug);
      setAccommodation(data);
      setLoading(false);
    };

    loadAccommodation();

    // Listen for accommodation updates
    const handleUpdate = () => loadAccommodation();
    window.addEventListener('accommodations-updated', handleUpdate);

    return () => {
      window.removeEventListener('accommodations-updated', handleUpdate);
    };
  }, [slug]);

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

  if (!accommodation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Accommodatie niet gevonden
          </h1>
          <p className="text-gray-600 mb-6">
            De gevraagde accommodatie kon niet worden gevonden.
          </p>
          <a
            href="/accommodaties"
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-block"
          >
            Terug naar accommodaties
          </a>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Accommodaties', href: '/accommodaties' },
    { label: accommodation.name },
  ];

  const pros = [
    `Gelegen in ${accommodation.location} op ${accommodation.island}`,
    `${accommodation.stars}-sterren ${accommodation.type.toLowerCase()}`,
    `Uitstekende beoordeling: ${accommodation.rating}/10`,
    ...accommodation.facilities.slice(0, 5).map((f) => `${f} beschikbaar`),
  ];

  const cons = [
    'Beschikbaarheid kan beperkt zijn in het hoogseizoen',
    'Prijzen kunnen variëren per seizoen',
  ];

  const faqItems = [
    {
      question: `Is ${accommodation.name} geschikt voor gezinnen?`,
      answer: accommodation.facilities.includes('Kindvriendelijk')
        ? 'Ja, deze accommodatie is kindvriendelijk en geschikt voor gezinnen.'
        : 'Deze accommodatie is geschikt voor alle types reizigers.',
    },
    {
      question: 'Wat zijn de check-in en check-out tijden?',
      answer: 'De standaard check-in tijd is 15:00 uur en check-out is 11:00 uur. Neem contact op met de accommodatie voor mogelijke flexibiliteit.',
    },
    {
      question: 'Is er WiFi beschikbaar?',
      answer: accommodation.facilities.includes('WiFi')
        ? 'Ja, gratis WiFi is beschikbaar in de hele accommodatie.'
        : 'Neem contact op met de accommodatie voor informatie over internetfaciliteiten.',
    },
  ];

  // Facility icons mapping
  const facilityIcons: Record<string, JSX.Element> = {
    Zwembad: <Waves className="w-8 h-8 text-primary flex-shrink-0" />,
    WiFi: <Wifi className="w-8 h-8 text-primary flex-shrink-0" />,
    Restaurant: <UtensilsCrossed className="w-8 h-8 text-primary flex-shrink-0" />,
    Fitness: <Dumbbell className="w-8 h-8 text-primary flex-shrink-0" />,
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Gallery */}
      <section className="relative h-[500px] overflow-hidden">
        <Image
          src={accommodation.imageUrl}
          alt={accommodation.imageAlt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-3">
              {[...Array(accommodation.stars)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-secondary text-secondary" />
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              {accommodation.name}
            </h1>
            <div className="flex items-center gap-2 text-white text-lg">
              <MapPin className="w-5 h-5" />
              <span>{accommodation.location}, {accommodation.island}</span>
            </div>
            {accommodation.isPopular && (
              <div className="inline-block mt-3 bg-orange-500 text-white px-4 py-2 text-sm font-bold rounded shadow-lg">
                POPULAIR!
              </div>
            )}
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
                {accommodation.rating.toFixed(1)}
              </div>
              <p className="text-sm text-gray-600">
                {accommodation.rating >= 9
                  ? 'Uitstekend'
                  : accommodation.rating >= 8
                  ? 'Zeer goed'
                  : accommodation.rating >= 7
                  ? 'Goed'
                  : 'Gemiddeld'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gebaseerd op</p>
              <p className="text-lg font-semibold">
                {accommodation.reviewCount.toLocaleString()} reviews
              </p>
            </div>
            <div className="hidden md:block">
              <p className="text-sm text-gray-600">Reisorganisatie</p>
              <p className="text-lg font-semibold">{accommodation.organization}</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600 mb-1">Vanaf</p>
            <div className="flex items-baseline gap-1 justify-center md:justify-end mb-2">
              <Euro className="w-5 h-5 text-primary" />
              <p className="text-3xl font-bold text-primary">
                {accommodation.pricePerNight}
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-3">per nacht</p>
            <button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors w-full md:w-auto">
              Bekijk beschikbaarheid
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="prose max-w-none mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Over deze accommodatie
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            {accommodation.description}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-900">
              <strong>💡 Beste tip:</strong> Boek vroeg voor de beste prijzen en
              beschikbaarheid, vooral tijdens het hoogseizoen en schoolvakanties.
            </p>
          </div>
        </div>

        {/* Facilities Grid */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">Faciliteiten</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accommodation.facilities.map((facility) => (
              <div
                key={facility}
                className="flex items-start gap-4 bg-white p-6 rounded-xl border border-border"
              >
                {facilityIcons[facility] || (
                  <Star className="w-8 h-8 text-primary flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-bold mb-1">{facility}</h3>
                  <p className="text-sm text-gray-600">Beschikbaar in deze accommodatie</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pros & Cons */}
        <ProsConsList pros={pros} cons={cons} />

        {/* FAQ */}
        <FAQ items={faqItems} />

        {/* Additional Information */}
        <section className="bg-muted rounded-xl p-8 mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Aanvullende informatie
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Type & Classificatie</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Type: {accommodation.type}</li>
                <li>• Sterren: {accommodation.stars} ★</li>
                <li>• Locatie: {accommodation.location}</li>
                <li>• Eiland: {accommodation.island}</li>
                <li>• Reisorganisatie: {accommodation.organization}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Populaire kenmerken</h3>
              <div className="flex flex-wrap gap-2">
                {accommodation.facilities.map((facility) => (
                  <span
                    key={facility}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
