import { Link } from '@tanstack/react-router';
import { Phone, MapPin, Clock, Heart, UtensilsCrossed } from 'lucide-react';

const PHONE = '+91-9999999999';
const PHONE_DISPLAY = '+91-99999 99999';
const ADDRESS = 'Gate No 2, Metro Station, Nangli, Najafgarh, New Delhi, Delhi 110043';
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`;

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'pind-pahadi-restaurant');

  return (
    <footer className="bg-brand-brown text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-mustard flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-brand-brown" />
              </div>
              <div>
                <div className="font-bold text-lg leading-tight">Pind Pahadi</div>
                <div className="font-devanagari text-brand-mustard text-sm">पिंड पहाड़ी रेस्टोरेंट</div>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Authentic Pahadi & Punjabi flavours served with warmth and tradition in the heart of Najafgarh.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-brand-mustard mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'Menu', to: '/menu' },
                { label: 'About Us', to: '/about' },
                { label: 'Reviews', to: '/reviews' },
                { label: 'Book a Table', to: '/contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/70 hover:text-brand-mustard transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-brand-mustard mb-4 uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="w-4 h-4 text-brand-mustard mt-0.5 flex-shrink-0" />
                <span>{ADDRESS}</span>
              </li>
              <li>
                <a href={`tel:${PHONE}`} className="flex items-center gap-2 text-sm text-white/70 hover:text-brand-mustard transition-colors">
                  <Phone className="w-4 h-4 text-brand-mustard flex-shrink-0" />
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Clock className="w-4 h-4 text-brand-mustard flex-shrink-0" />
                Open daily — Closes 10 PM
              </li>
              <li>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-brand-mustard hover:underline"
                >
                  <MapPin className="w-3 h-3" /> Get Directions
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/50">
          <p>© {year} Pind Pahadi Restaurant Delhi. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-brand-mustard fill-brand-mustard" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-mustard hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
