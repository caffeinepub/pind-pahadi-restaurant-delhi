import React, { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Phone, Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About Us' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Book Table' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (to: string) => {
    if (to === '/') return currentPath === '/';
    return currentPath.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-brown shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo / Brand */}
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-white font-bold text-lg font-poppins tracking-wide">Pind Pahadi</span>
          <span className="text-brand-cream/70 text-xs font-devanagari">पिंड पहाड़ी</span>
        </Link>

        {/* Phone */}
        <a
          href="tel:+919891142585"
          className="hidden md:flex items-center gap-1.5 text-brand-cream/80 hover:text-white transition-colors text-sm"
        >
          <Phone className="w-4 h-4" />
          +91 98911 42585
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-brand-cream/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-brown border-t border-white/10 px-4 py-4 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-brand-cream/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="tel:+919891142585"
            className="flex items-center gap-2 px-4 py-3 text-brand-cream/70 hover:text-white text-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            +91 98911 42585
          </a>
        </div>
      )}
    </header>
  );
}
