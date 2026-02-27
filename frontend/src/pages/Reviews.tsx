import { Link } from '@tanstack/react-router';
import { CalendarDays, ThumbsUp, MessageSquare } from 'lucide-react';
import StarRating from '../components/StarRating';

const testimonials = [
  {
    name: 'Rahul Sharma',
    initials: 'RS',
    date: 'January 2025',
    rating: 5,
    text: 'Authentic food and variety of dishes.',
    detail: 'The Punjabi Thali was absolutely amazing — reminded me of home-cooked food. The portions are generous and the taste is spot on. Will definitely visit again!',
  },
  {
    name: 'Priya Mehta',
    initials: 'PM',
    date: 'December 2024',
    rating: 5,
    text: 'Professional staff and overall great food.',
    detail: 'The staff was very welcoming and attentive. The Veg Momos were perfectly steamed and the chutney was delicious. Great value for money at ₹400–600 per person.',
  },
  {
    name: 'Amit Kumar',
    initials: 'AK',
    date: 'November 2024',
    rating: 5,
    text: 'Friendly and warm ambience.',
    detail: 'Loved the cozy atmosphere. Perfect place for a family dinner. The Dal Makhani was rich and creamy, and the Butter Naan was soft and fresh from the tandoor.',
  },
  {
    name: 'Sunita Verma',
    initials: 'SV',
    date: 'October 2024',
    rating: 5,
    text: 'Best Pahadi food in Najafgarh!',
    detail: 'Finally found a place that serves authentic Pahadi cuisine in Delhi. The Rajma Chawal was exactly how my grandmother used to make it. Highly recommended!',
  },
  {
    name: 'Deepak Singh',
    initials: 'DS',
    date: 'September 2024',
    rating: 5,
    text: 'Convenient location near metro.',
    detail: 'Right at Gate No. 2 of Najafgarh Metro — so easy to reach. Quick service, great food, and very affordable. The Student Combo is a steal!',
  },
  {
    name: 'Kavita Joshi',
    initials: 'KJ',
    date: 'August 2024',
    rating: 4,
    text: 'Great family dining experience.',
    detail: 'Took my family here for lunch and everyone loved it. The kids enjoyed the Veg Burgers and we adults had the Thali. Clean, hygienic, and well-maintained.',
  },
];

export default function Reviews() {
  return (
    <div className="pb-16 lg:pb-0">
      {/* Page Header */}
      <div className="bg-brand-brown py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">Customer Reviews</h1>
          <p className="font-devanagari text-brand-mustard text-xl mb-4">ग्राहक समीक्षाएं</p>
          <p className="text-white/70 max-w-xl mx-auto">
            Real experiences from our valued guests
          </p>
        </div>
      </div>

      {/* Rating Summary */}
      <section className="py-12 bg-brand-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 shadow-card text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <div>
                <div className="text-7xl font-black text-brand-brown">4.8</div>
                <StarRating rating={4.8} size="lg" />
                <p className="text-muted-foreground text-sm mt-2">out of 5</p>
              </div>
              <div className="hidden sm:block w-px h-24 bg-border" />
              <div className="space-y-2 text-left">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = star === 5 ? 46 : star === 4 ? 4 : star === 3 ? 1 : 0;
                  const pct = Math.round((count / 51) * 100);
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-4">{star}</span>
                      <span className="text-brand-mustard text-sm">★</span>
                      <div className="w-32 h-2 bg-brand-cream rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-mustard rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{count}</span>
                    </div>
                  );
                })}
              </div>
              <div className="hidden sm:block w-px h-24 bg-border" />
              <div className="text-center">
                <div className="flex items-center gap-2 text-brand-brown mb-1">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-2xl font-bold">51</span>
                </div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <div className="flex items-center gap-2 text-green-600 mt-3">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">98% Positive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-brand-cream rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-brand-brown flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{t.initials}</span>
                  </div>
                  <div>
                    <p className="font-bold text-brand-brown text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                  </div>
                </div>
                <StarRating rating={t.rating} size="sm" />
                <p className="mt-3 font-semibold text-brand-brown text-sm">"{t.text}"</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-brand-brown">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Join Our Happy Customers</h3>
          <p className="text-white/70 mb-6">
            Experience the authentic taste of Pahadi & Punjabi cuisine for yourself.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-brand-mustard text-brand-brown px-8 py-3.5 rounded-full font-semibold hover:bg-brand-mustard-light transition-all shadow-lg hover:-translate-y-0.5"
          >
            <CalendarDays className="w-5 h-5" />
            Book Your Visit Today
          </Link>
        </div>
      </section>
    </div>
  );
}
