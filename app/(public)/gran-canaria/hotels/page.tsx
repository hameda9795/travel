import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SearchFilterSidebar from '@/components/ui/SearchFilterSidebar';
import HotelCard from '@/components/ui/HotelCard';
import ProsConsList from '@/components/seo/ProsConsList';
import FAQ from '@/components/seo/FAQ';

export const metadata: Metadata = {
  title: 'Beste Hotels op Gran Canaria 2026 | Top Accommodaties',
  description:
    'Ontdek de beste hotels op Gran Canaria. Van luxe resorts tot budgetvriendelijke opties. Eerlijke reviews en expert adviezen voor uw perfecte verblijf.',
  keywords: ['Gran Canaria hotels', 'hotels Maspalomas', 'resorts Gran Canaria', 'accommodatie'],
};

export default function GranCanariaHotelsPage() {
  const breadcrumbItems = [
    { label: 'Gran Canaria', href: '/gran-canaria' },
    { label: 'Hotels' },
  ];

  const hotels = [
    {
      name: 'Seaside Palm Beach',
      slug: '/gran-canaria/hotels/seaside-palm-beach',
      location: 'Maspalomas',
      description:
        'Luxueus 5-sterren resort direct aan het strand met uitgebreide spa-faciliteiten en meerdere restaurants. Perfect voor een ontspannen vakantie.',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      rating: 4.7,
      reviewCount: 2341,
      pricePerNight: 180,
      stars: 5,
    },
    {
      name: 'Hotel Riu Palace Oasis',
      slug: '/gran-canaria/hotels/riu-palace-oasis',
      location: 'Maspalomas',
      description:
        'All-inclusive resort met prachtige tuinen, meerdere zwembaden en directe toegang tot de duinen van Maspalomas.',
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
      rating: 4.5,
      reviewCount: 1872,
      pricePerNight: 145,
      stars: 4,
    },
    {
      name: 'Cordial Mogán Playa',
      slug: '/gran-canaria/hotels/cordial-mogan-playa',
      location: 'Puerto de Mogán',
      description:
        'Charmant adults-only hotel in het pittoreske Puerto de Mogán. Modern design met traditionele Canarische elementen.',
      imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
      rating: 4.8,
      reviewCount: 987,
      pricePerNight: 210,
      stars: 4,
    },
    {
      name: 'Bohemia Suites & Spa',
      slug: '/gran-canaria/hotels/bohemia-suites-spa',
      location: 'Playa del Inglés',
      description:
        'Designhotel met een moderne, minimalistische stijl. Rooftop zwembad met spectaculair uitzicht over de Atlantische Oceaan.',
      imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
      rating: 4.6,
      reviewCount: 1543,
      pricePerNight: 165,
      stars: 5,
    },
  ];

  const hotelChoicePros = [
    'Uitgebreide keuze van budget tot luxe',
    'Veel all-inclusive opties beschikbaar',
    'Moderne faciliteiten en goede service',
    'Strategische locaties bij stranden',
    'Kindvriendelijke resorts met animatie',
    'Adults-only opties voor rust en ontspanning',
  ];

  const hotelChoiceCons = [
    'Populaire hotels vaak snel volgeboekt',
    'Prijzen hoger in het hoogseizoen',
    'Sommige resorts kunnen druk zijn',
    'Extra kosten voor zeezicht kamers',
  ];

  const faqItems = [
    {
      question: 'Wat is de beste locatie om te verblijven op Gran Canaria?',
      answer:
        'Dit hangt af van uw voorkeuren. Maspalomas en Playa del Inglés zijn perfect voor strandliefhebbers en bieden veel faciliteiten. Puerto de Mogán is ideaal voor rust en een authentieke sfeer. Las Palmas is geschikt als u een stedelijke ervaring wilt met cultuur en winkelen.',
    },
    {
      question: 'Zijn all-inclusive hotels de moeite waard?',
      answer:
        'All-inclusive kan zeer voordelig zijn, vooral voor gezinnen. U heeft geen zorgen over maaltijden en drankjes. Wel mist u mogelijk de kans om lokale restaurants te ontdekken. Veel hotels bieden tegenwoordig "soft all-inclusive" waar u flexibiliteit heeft.',
    },
    {
      question: 'Wanneer boek ik het beste mijn hotel?',
      answer:
        'Voor de beste deals boekt u 3-6 maanden van tevoren. Last minute kan ook voordelig zijn, maar u heeft minder keuze. Vermijd het boeken tijdens schoolvakanties voor lagere prijzen. December-februari en juli-augustus zijn het hoogseizoen.',
    },
  ];

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Hotels op Gran Canaria
          </h1>
          <p className="text-xl text-gray-600">
            Ontdek onze handgeselecteerde collectie van de beste accommodaties op Gran
            Canaria. Van luxe resorts tot budgetvriendelijke opties.
          </p>
        </div>

        {/* Pros & Cons */}
        <ProsConsList pros={hotelChoicePros} cons={hotelChoiceCons} />

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 mt-12">
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <SearchFilterSidebar />
          </aside>

          {/* Hotel Listings */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold text-foreground">{hotels.length}</span>{' '}
                hotels gevonden
              </p>
              <select className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                <option>Aanbevolen</option>
                <option>Prijs: Laag - Hoog</option>
                <option>Prijs: Hoog - Laag</option>
                <option>Beoordeling</option>
              </select>
            </div>

            <div className="space-y-6">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.slug} {...hotel} />
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <button className="bg-white hover:bg-gray-50 border-2 border-primary text-primary font-semibold px-8 py-3 rounded-lg transition-colors">
                Toon meer hotels
              </button>
            </div>
          </div>
        </div>

        {/* Expert Tips Section */}
        <section className="mt-16 bg-accent/5 border-l-4 border-accent rounded-r-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
            <span className="bg-accent text-white px-3 py-1 rounded-lg text-sm">TIP</span>
            Expert Advies voor Hotelkeuze
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              Bij het kiezen van een hotel op Gran Canaria zijn er een paar belangrijke
              factoren om rekening mee te houden:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Locatie:</strong> Het zuiden (Maspalomas, Playa del Inglés) heeft
                meer zon en is levendiger. Het noorden (Las Palmas) is authentieker en
                cultureler.
              </li>
              <li>
                <strong>Seizoen:</strong> Prijzen variëren sterk per seizoen. November en
                januari-februari zijn vaak goedkoper maar nog steeds aangenaam.
              </li>
              <li>
                <strong>Verblijfsduur:</strong> Bij een verblijf van 7+ dagen kunt u vaak
                onderhandelen over betere tarieven of upgrades.
              </li>
              <li>
                <strong>Transfer:</strong> Check of het hotel dicht bij de luchthaven ligt
                of goede verbindingen heeft. Dit scheelt reistijd en kosten.
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <FAQ items={faqItems} title="Veelgestelde Vragen over Hotels" />
      </div>
    </div>
  );
}
