import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';

interface IslandCardProps {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  highlights: string[];
}

export default function IslandCard({ name, slug, description, imageUrl, highlights }: IslandCardProps) {
  return (
    <Link
      href={`/${slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5" />
            <h3 className="text-2xl font-bold">{name}</h3>
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-700 mb-4 line-clamp-2">{description}</p>
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-600 mb-2">Hoogtepunten:</p>
          <ul className="space-y-1">
            {highlights.slice(0, 3).map((highlight, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
          <span>Ontdek {name}</span>
          <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
