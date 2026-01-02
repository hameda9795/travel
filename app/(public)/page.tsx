'use client';

import { useEffect, useState } from 'react';
import IslandCard from '@/components/ui/IslandCard';
import HeroSearchWidget from '@/components/ui/HeroSearchWidget';
import HotelCard from '@/components/ui/HotelCard';
import { Palmtree, Sun, Waves, Mountain, Star, MapPin, ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { getAccommodations, type Accommodation } from '@/lib/accommodations';

export default function HomePage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);

  useEffect(() => {
    const allAccommodations = getAccommodations();
    const published = allAccommodations.filter(acc => acc.status === 'Gepubliceerd');
    
    // Get accommodations with homePageOrder set, sorted by order
    const featured = published
      .filter(acc => acc.homePageOrder !== null && acc.homePageOrder !== undefined)
      .sort((a, b) => (a.homePageOrder || 0) - (b.homePageOrder || 0))
      .slice(0, 6);
    
    setAccommodations(featured);
  }, []);
  const islands = [
    {
      name: 'Gran Canaria',
      slug: 'gran-canaria',
      description:
        'Bekend om zijn diverse landschappen, van zandduinen tot groene bergen. Het perfecte eiland voor strandliefhebbers en avonturiers.',
      imageUrl: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800&h=600&fit=crop',
      highlights: [
        'Duinen van Maspalomas',
        'Pittoresk dorpje Teror',
        'Roque Nublo rotformatie',
        'Puerto de Mogán haventje',
      ],
    },
    {
      name: 'Tenerife',
      slug: 'tenerife',
      description:
        'Het grootste Canarische eiland met de indrukwekkende Teide vulkaan. Perfect voor zowel strandvakanties als bergwandelingen.',
      imageUrl: 'https://images.unsplash.com/photo-1611391228629-c3742422cef9?w=800&h=600&fit=crop',
      highlights: [
        'Mount Teide National Park',
        'Los Gigantes kliffen',
        'Loro Parque dierentuin',
        'Anaga Rural Park',
      ],
    },
    {
      name: 'Lanzarote',
      slug: 'lanzarote',
      description:
        'Een uniek vulkanisch landschap met spectaculaire zwarte stranden en wijngaarden. Ideaal voor kunst- en natuurliefhebbers.',
      imageUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=600&fit=crop',
      highlights: [
        'Timanfaya National Park',
        'César Manrique Foundation',
        'Cueva de los Verdes grotten',
        'Papagayo stranden',
      ],
    },
    {
      name: 'Fuerteventura',
      slug: 'fuerteventura',
      description:
        'Het paradijs voor watersporters en strandliefhebbers met eindeloze zandstranden en turquoise water.',
      imageUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e3?w=800&h=600&fit=crop',
      highlights: [
        'Corralejo duinen',
        'Cofete strand',
        'Betancuria historisch stadje',
        'Jandía natuurpark',
      ],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden py-12">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Ontdek de Canarische Eilanden
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Expertise in Canarische Reizen - Uw betrouwbare specialist voor een
              onvergetelijke vakantie
            </p>
          </div>

          {/* Search Widget */}
          <HeroSearchWidget />

          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <a
              href="#islands"
              className="text-white hover:text-gray-200 font-medium transition-colors flex items-center gap-2"
            >
              <span>of</span>
              <span className="underline">bekijk eerst de eilanden</span>
            </a>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <p className="text-primary-100">Jaar ervaring</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <p className="text-primary-100">Tevreden reizigers</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <p className="text-primary-100">Geselecteerde hotels</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8/5</div>
              <p className="text-primary-100">Klantbeoordeling</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Accommodations Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Populaire Accommodaties
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ontdek onze meest geliefde hotels en resorts, zorgvuldig geselecteerd voor een onvergetelijk verblijf
            </p>
          </div>
          
          {accommodations.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {accommodations.map((accommodation) => (
                  <HotelCard key={accommodation.id} {...accommodation} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  href="/accommodaties"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg"
                >
                  Bekijk alle accommodaties
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">Nog geen accommodaties beschikbaar</p>
            </div>
          )}
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Laatste Artikelen & Tips
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Blijf op de hoogte met onze expertgidsen, reisinspiratie en praktische tips
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Article 1 */}
            <Link href="/artikelen/beste-hotels-maspalomas-2026" className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
              <div className="relative h-56">
                <img
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop"
                  alt="Beste Hotels Maspalomas"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    HOTEL GIDS
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    2 Jan 2026
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Gran Canaria
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  De 10 Beste Hotels in Maspalomas 2026
                </h3>
                <p className="text-gray-600 mb-4">
                  Ontdek de top hotels in Maspalomas met duinen, strand en luxe voorzieningen voor een perfecte vakantie.
                </p>
                <span className="text-primary font-semibold flex items-center gap-2">
                  Lees meer
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>

            {/* Article 2 */}
            <Link href="/gran-canaria" className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
              <div className="relative h-56">
                <img
                  src="https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800&h=600&fit=crop"
                  alt="Gran Canaria Gids"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    EILAND GIDS
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    28 Dec 2025
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Gran Canaria
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  Complete Gids voor Gran Canaria
                </h3>
                <p className="text-gray-600 mb-4">
                  Alles wat u moet weten over Gran Canaria: stranden, bezienswaardigheden, restaurants en meer.
                </p>
                <span className="text-primary font-semibold flex items-center gap-2">
                  Lees meer
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>

            {/* Article 3 */}
            <Link href="/tenerife" className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
              <div className="relative h-56">
                <img
                  src="https://images.unsplash.com/photo-1611391228629-c3742422cef9?w=800&h=600&fit=crop"
                  alt="Tenerife Tips"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    REIS TIPS
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    25 Dec 2025
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Tenerife
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  10 Onmisbare Bezienswaardigheden op Tenerife
                </h3>
                <p className="text-gray-600 mb-4">
                  Van de Teide vulkaan tot de pittoreske dorpjes - ontdek de hoogtepunten van Tenerife.
                </p>
                <span className="text-primary font-semibold flex items-center gap-2">
                  Lees meer
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Waarom Kiezen voor Ons?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Wij zijn uw specialist op het gebied van de Canarische Eilanden
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Beste Prijzen</h3>
              <p className="text-gray-600">
                Scherpe prijzen en exclusieve deals. Wij garanderen de beste prijs-kwaliteitverhouding.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Lokale Kennis</h3>
              <p className="text-gray-600">
                Jarenlange ervaring en diepgaande kennis van alle eilanden en hun beste locaties.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Persoonlijke service en ondersteuning tijdens uw hele reis, wanneer u ons nodig heeft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Canary Islands */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Waarom de Canarische Eilanden?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Het hele jaar door zon, diverse landschappen en unieke cultuur maken
              de Canarische Eilanden tot de perfecte vakantiebestemming.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Eeuwige Lente</h3>
              <p className="text-gray-600">
                300+ dagen zon per jaar met temperaturen tussen 20-28°C
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Prachtige Stranden</h3>
              <p className="text-gray-600">
                Van zwarte vulkanische stranden tot gouden zandduinen
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Diverse Natuur</h3>
              <p className="text-gray-600">
                Van vulkanen en bergen tot subtropische bossen
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-green-600/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palmtree className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Rijke Cultuur</h3>
              <p className="text-gray-600">
                Spaanse charme gecombineerd met lokale tradities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Islands Section */}
      <section id="islands" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Ontdek de Eilanden
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Elk eiland heeft zijn eigen unieke karakter en charme. Ontdek welk
              eiland het beste bij uw wensen past.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {islands.map((island) => (
              <IslandCard key={island.slug} {...island} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Klaar voor uw Canarische avontuur?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Laat ons u helpen de perfecte vakantie te plannen op de Canarische
            Eilanden
          </p>
          <a
            href="/contact"
            className="inline-block bg-white hover:bg-gray-100 text-primary font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg"
          >
            Neem contact op
          </a>
        </div>
      </section>
    </div>
  );
}
