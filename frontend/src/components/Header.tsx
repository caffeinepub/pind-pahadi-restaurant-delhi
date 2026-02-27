import { useState } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { Phone, Menu, X, UtensilsCrossed } from 'lucide-react';

const PHONE = '+91-9999999999';
const PHONE_DISPLAY = '+91-99999 99999';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'About Us', to: '/about' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Book Table', to: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  return (
    <header className="sticky top-0 z-50 bg-brand-brown shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 rounded-full bg-brand-mustard flex items-center justify-center flex-shrink-0 shadow-sm">
              <UtensilsCrossed className="w-5 h-5 text-brand-brown" />
            </div>
            <div className="leading-tight">
              <div className="text-white font-bold text-sm sm:text-base leading-tight tracking-wide">
                Pind Pahadi
              </div>
              <div className="text-brand-mustard font-devanagari text-xs leading-tight">
                पिंड पहाड़ी रेस्टोरेंट
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPath === link.to
                    ? 'bg-brand-mustard text-brand-brown'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Phone + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${PHONE}`}
              className="hidden sm:flex items-center gap-2 bg-brand-mustard text-brand-brown px-3 py-2 rounded-full text-sm font-semibold hover:bg-brand-mustard-light transition-colors shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden md:inline">{PHONE_DISPLAY}</span>
              <span className="md:hidden">Call</span>
            </a>
            <button
              className="lg:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-brand-brown border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  currentPath === link.to
                    ? 'bg-brand-mustard text-brand-brown'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${PHONE}`}
              className="flex items-center gap-2 px-4 py-3 text-brand-mustard font-semibold text-sm"
            >
              <Phone className="w-4 h-4" />
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
