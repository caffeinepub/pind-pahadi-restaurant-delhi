import { Link } from '@tanstack/react-router';
import { Phone, CalendarDays, UtensilsCrossed, Star, MapPin, Clock, IndianRupee, Navigation } from 'lucide-react';
import StarRating from '../components/StarRating';

const PHONE = '+91-9999999999';
const ADDRESS = 'Gate No 2, Metro Station, Nangli, Najafgarh, New Delhi, Delhi 110043';
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`;
const MAPS_EMBED_URL = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.0!2d76.9798!3d28.6092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzMzLjEiTiA3NsKwNTgnNDcuMyJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin`;

const whyChooseUs = [
  { icon: '⭐', title: '4.8 Rated', desc: 'Loved by 51+ happy customers' },
  { icon: '🥘', title: 'Authentic Cuisine', desc: 'Pahadi & Punjabi dishes made fresh daily' },
  { icon: '👨‍🍳', title: 'Expert Staff', desc: 'Professional, polite & welcoming team' },
  { icon: '🚇', title: 'Metro Accessible', desc: 'Right at Najafgarh Metro Gate No. 2' },
  { icon: '🛵', title: 'Multiple Options', desc: 'Dine-in, Pickup & Delivery available' },
];

const featuredDishes = [
  {
    image: '/assets/generated/veg-momos.dim_400x300.png',
    name: 'Veg Momos',
    desc: 'Steamed dumplings with spicy chutney — a crowd favourite',
    price: '₹120',
  },
  {
    image: '/assets/generated/veg-burger.dim_400x300.png',
    name: 'Veg Burger',
    desc: 'Crispy, fresh & loaded with flavour',
    price: '₹90',
  },
  {
    image: '/assets/generated/coffee.dim_400x300.png',
    name: 'Hot Coffee',
    desc: 'Rich, frothy coffee to warm your soul',
    price: '₹60',
  },
  {
    image: '/assets/generated/punjabi-thali.dim_400x300.png',
    name: 'Punjabi Thali',
    desc: 'Complete meal with dal, sabzi, roti, rice & pickle',
    price: '₹280',
  },
  {
    image: '/assets/generated/ambience.dim_400x300.png',
    name: 'Our Ambience',
    desc: 'Warm, cozy & family-friendly dining space',
    price: null,
  },
];

const testimonials = [
  { name: 'Rahul S.', text: 'Authentic food and variety of dishes.', rating: 5 },
  { name: 'Priya M.', text: 'Professional staff and overall great food.', rating: 5 },
  { name: 'Amit K.', text: 'Friendly and warm ambience.', rating: 5 },
];

export default function Home() {
  return (
    <div className="pb-16 lg:pb-0">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/generated/hero-bg.dim_1400x800.png')" }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-mustard/20 border border-brand-mustard/40 text-brand-mustard px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <Star className="w-4 h-4 fill-brand-mustard" />
            4.8 Rated · 51 Reviews · Near Metro Gate No. 2
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white text-shadow-hero leading-tight mb-2">
            Pind Pahadi
          </h1>
          <p className="font-devanagari text-2xl sm:text-3xl text-brand-mustard text-shadow-hero mb-4">
            पिंड पहाड़ी रेस्टोरेंट दिल्ली
          </p>
          <p className="text-lg sm:text-xl text-white/90 text-shadow-hero mb-10 max-w-2xl mx-auto leading-relaxed">
            Authentic Taste of Pahadi & Punjabi Flavours in Najafgarh
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href={`tel:${PHONE}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-red text-white px-7 py-3.5 rounded-full font-semibold text-base hover:bg-brand-red-light transition-all shadow-cta hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
            <Link
              to="/contact"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-mustard text-brand-brown px-7 py-3.5 rounded-full font-semibold text-base hover:bg-brand-mustard-light transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <CalendarDays className="w-5 h-5" />
              Book a Table
            </Link>
            <Link
              to="/menu"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm border border-white/40 text-white px-7 py-3.5 rounded-full font-semibold text-base hover:bg-white/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <UtensilsCrossed className="w-5 h-5" />
              View Menu
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-20 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-brown mb-3">Why Choose Us?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We bring the authentic taste of the mountains and Punjab right to your table.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {whyChooseUs.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-5 text-center shadow-card hover:shadow-card-hover transition-shadow group"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-brand-brown text-sm mb-1 group-hover:text-brand-red transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-brown mb-3">Featured Dishes</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A taste of what awaits you — crafted with love and authentic spices.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {featuredDishes.map((dish) => (
              <div
                key={dish.name}
                className="bg-brand-cream rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 group"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-brand-brown text-sm mb-1">{dish.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{dish.desc}</p>
                  {dish.price && (
                    <span className="text-brand-red font-bold text-sm">{dish.price}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-brand-brown text-white px-8 py-3.5 rounded-full font-semibold hover:bg-brand-brown-light transition-all shadow-card hover:shadow-card-hover hover:-translate-y-0.5"
            >
              <UtensilsCrossed className="w-5 h-5" />
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 lg:py-20 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <StarRating rating={4.8} size="lg" />
              <span className="text-3xl font-black text-brand-brown">4.8</span>
            </div>
            <p className="text-muted-foreground mb-2">Based on 51 Google Reviews</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-brown">What Our Guests Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
                <StarRating rating={t.rating} size="sm" />
                <p className="mt-3 text-foreground font-medium leading-relaxed">"{t.text}"</p>
                <p className="mt-3 text-sm text-muted-foreground font-semibold">— {t.name}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-brand-red text-white px-8 py-3.5 rounded-full font-semibold hover:bg-brand-red-light transition-all shadow-cta hover:shadow-lg hover:-translate-y-0.5"
            >
              <CalendarDays className="w-5 h-5" />
              Book Your Visit Today
            </Link>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-brown mb-3">Find Us</h2>
            <p className="text-muted-foreground">Conveniently located near Najafgarh Metro Station</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-card h-72 lg:h-96">
              <iframe
                title="Pind Pahadi Restaurant Location"
                src={MAPS_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            {/* Info */}
            <div className="space-y-5">
              <div className="bg-brand-cream rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-red mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-brand-brown text-sm mb-0.5">Address</p>
                    <p className="text-sm text-muted-foreground">{ADDRESS}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-brand-red flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-brand-brown text-sm mb-0.5">Hours</p>
                    <p className="text-sm text-muted-foreground">Open daily — Closes 10 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <IndianRupee className="w-5 h-5 text-brand-red flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-brand-brown text-sm mb-0.5">Price Range</p>
                    <p className="text-sm text-muted-foreground">₹400–600 per person</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-brown text-white px-5 py-3 rounded-full font-semibold text-sm hover:bg-brand-brown-light transition-all shadow-card hover:-translate-y-0.5"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
                <a
                  href={`tel:${PHONE}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-red text-white px-5 py-3 rounded-full font-semibold text-sm hover:bg-brand-red-light transition-all shadow-cta hover:-translate-y-0.5"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
