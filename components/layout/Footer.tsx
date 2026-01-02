import Link from 'next/link';
import { MapPin, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-accent" />
              <div>
                <h3 className="text-xl font-bold text-white">Canarische Eilanden</h3>
                <p className="text-sm text-gray-400">Expertise in Canarische Reizen</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-md mb-4">
              Uw betrouwbare specialist voor reizen naar de Canarische Eilanden.
              Ontdek de mooiste hotels, stranden en bezienswaardigheden op Gran Canaria,
              Tenerife, Lanzarote en Fuerteventura.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-accent transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Eilanden</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/gran-canaria" className="text-sm hover:text-accent transition-colors">
                  Gran Canaria
                </Link>
              </li>
              <li>
                <Link href="/tenerife" className="text-sm hover:text-accent transition-colors">
                  Tenerife
                </Link>
              </li>
              <li>
                <Link href="/lanzarote" className="text-sm hover:text-accent transition-colors">
                  Lanzarote
                </Link>
              </li>
              <li>
                <Link href="/fuerteventura" className="text-sm hover:text-accent transition-colors">
                  Fuerteventura
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Informatie</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/reisadvies" className="text-sm hover:text-accent transition-colors">
                  Reisadvies
                </Link>
              </li>
              <li>
                <Link href="/beste-reistijd" className="text-sm hover:text-accent transition-colors">
                  Beste Reistijd
                </Link>
              </li>
              <li>
                <Link href="/over-ons" className="text-sm hover:text-accent transition-colors">
                  Over Ons
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Canarische Eilanden Specialist. Alle rechten voorbehouden.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-accent transition-colors">
              Privacy
            </Link>
            <Link href="/voorwaarden" className="text-sm text-gray-400 hover:text-accent transition-colors">
              Voorwaarden
            </Link>
            <Link href="/cookies" className="text-sm text-gray-400 hover:text-accent transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
