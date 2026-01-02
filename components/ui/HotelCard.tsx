import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Euro } from 'lucide-react';

interface HotelCardProps {
  name: string;
  slug: string;
  location: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  stars: number;
  isPopular?: boolean;
}

export default function HotelCard({
  name,
  slug,
  location,
  description,
  imageUrl,
  rating,
  reviewCount,
  pricePerNight,
  stars,
  isPopular = false,
}: HotelCardProps) {
  return (
    <Link
      href={`/accommodaties/${slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative w-full h-64 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {isPopular && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-1.5 text-xs font-bold rounded-md shadow-lg uppercase">
            POPULAIR!
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-3">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(stars)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
            {name}
          </h3>
          <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{description}</p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white px-2.5 py-1 rounded-lg font-bold text-sm">
              {rating.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">
              <div className="font-semibold">Uitstekend</div>
              <div>{reviewCount} reviews</div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Vanaf</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary">€ {pricePerNight}</span>
                <span className="text-sm text-gray-500">/nacht</span>
              </div>
            </div>
            <div className="text-primary font-semibold text-sm group-hover:underline">
              Bekijk →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
