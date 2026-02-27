import { Link } from '@tanstack/react-router';
import { Phone, MapPin, CalendarDays } from 'lucide-react';

const PHONE = '+91-9999999999';
const ADDRESS = 'Gate No 2, Metro Station, Nangli, Najafgarh, New Delhi, Delhi 110043';
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`;

export default function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-brand-brown border-t-2 border-brand-mustard shadow-2xl">
      <div className="grid grid-cols-3 divide-x divide-white/20">
        <a
          href={`tel:${PHONE}`}
          className="flex flex-col items-center justify-center py-3 gap-1 text-white hover:bg-white/10 transition-colors active:bg-white/20"
        >
          <Phone className="w-5 h-5 text-brand-mustard" />
          <span className="text-xs font-medium">Call</span>
        </a>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-3 gap-1 text-white hover:bg-white/10 transition-colors active:bg-white/20"
        >
          <MapPin className="w-5 h-5 text-brand-mustard" />
          <span className="text-xs font-medium">Directions</span>
        </a>
        <Link
          to="/contact"
          className="flex flex-col items-center justify-center py-3 gap-1 text-white hover:bg-white/10 transition-colors active:bg-white/20"
        >
          <CalendarDays className="w-5 h-5 text-brand-mustard" />
          <span className="text-xs font-medium">Book Table</span>
        </Link>
      </div>
    </div>
  );
}
