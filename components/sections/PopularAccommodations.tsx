'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import HotelCard from '@/components/ui/HotelCard';
import { getAccommodations, type Accommodation } from '@/lib/accommodations';

export default function PopularAccommodations() {
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);

    useEffect(() => {
        // This runs on client side only, after mount
        // Ensure we are in browser environment if needed, but useEffect guarantees that.
        const allAccommodations = getAccommodations();
        const published = allAccommodations.filter(acc => acc.status === 'Gepubliceerd');

        // Get accommodations with homePageOrder set, sorted by order
        const featured = published
            .filter(acc => acc.homePageOrder !== null && acc.homePageOrder !== undefined)
            .sort((a, b) => (a.homePageOrder || 0) - (b.homePageOrder || 0))
            .slice(0, 6);

        setAccommodations(featured);
    }, []);

    return (
        <section className="py-16 bg-white w-full">
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
    );
}
