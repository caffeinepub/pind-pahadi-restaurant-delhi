import { Link } from '@tanstack/react-router';
import { CalendarDays, MapPin, Heart, Award, Users, Leaf } from 'lucide-react';

const values = [
  {
    icon: <Leaf className="w-6 h-6 text-green-600" />,
    title: 'Fresh & Authentic',
    desc: 'Every dish is prepared fresh daily using traditional recipes passed down through generations.',
  },
  {
    icon: <Heart className="w-6 h-6 text-brand-red" />,
    title: 'Made with Love',
    desc: 'Our chefs pour their heart into every plate, ensuring you taste the warmth of home cooking.',
  },
  {
    icon: <Users className="w-6 h-6 text-brand-brown" />,
    title: 'Family-Friendly',
    desc: 'A welcoming space for families, friends, and colleagues to share great food and memories.',
  },
  {
    icon: <Award className="w-6 h-6 text-brand-mustard" />,
    title: '4.8 Star Rated',
    desc: 'Consistently rated 4.8 stars by our guests — quality and satisfaction are our top priorities.',
  },
];

const team = [
  { name: 'Chef Ramesh', role: 'Head Chef', specialty: 'Pahadi & Punjabi Cuisine' },
  { name: 'Suresh Kumar', role: 'Restaurant Manager', specialty: 'Guest Experience' },
  { name: 'Anita Devi', role: 'Kitchen Supervisor', specialty: 'Traditional Recipes' },
];

export default function AboutUs() {
  return (
    <div className="pb-16 lg:pb-0">
      {/* Page Header */}
      <div className="bg-brand-brown py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">About Us</h1>
          <p className="font-devanagari text-brand-mustard text-xl mb-4">हमारे बारे में</p>
          <p className="text-white/70 max-w-xl mx-auto">
            The story behind Pind Pahadi Restaurant Delhi
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-brand-mustard font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-brown mt-2 mb-6">
                From the Mountains to Your Table
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Pind Pahadi Restaurant Delhi was born from a deep love for the authentic flavours of the Pahadi hills and the rich culinary traditions of Punjab. Our founders, originally from the mountain regions of North India, wanted to bring the true taste of home to the people of Delhi.
                </p>
                <p>
                  Nestled conveniently at Gate No. 2 of Najafgarh Metro Station, we have been serving the local community with warmth, authenticity, and a commitment to quality that has earned us a 4.8-star rating from over 51 satisfied customers.
                </p>
                <p>
                  Every dish on our menu tells a story — from the slow-cooked Dal Makhani that simmers for hours, to the freshly steamed Veg Momos that have become a neighbourhood favourite. We believe food is not just nourishment; it is an experience, a memory, a connection.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-card-hover">
                <img
                  src="/assets/generated/ambience.dim_400x300.png"
                  alt="Pind Pahadi Restaurant Ambience"
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-brand-mustard text-brand-brown rounded-2xl p-4 shadow-lg">
                <div className="text-3xl font-black">4.8⭐</div>
                <div className="text-xs font-semibold">51 Reviews</div>
              </div>
              <div className="absolute -top-4 -right-4 bg-brand-red text-white rounded-2xl p-4 shadow-lg">
                <div className="text-2xl font-black">₹400</div>
                <div className="text-xs font-semibold">Per Person</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-20 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-brown mb-3">Our Values</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The principles that guide everything we do at Pind Pahadi.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow text-center">
                <div className="w-12 h-12 rounded-full bg-brand-cream flex items-center justify-center mx-auto mb-4">
                  {v.icon}
                </div>
                <h3 className="font-bold text-brand-brown mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-brown mb-3">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The passionate people behind every delicious dish.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="bg-brand-cream rounded-2xl p-6 text-center shadow-card hover:shadow-card-hover transition-shadow">
                <div className="w-16 h-16 rounded-full bg-brand-brown flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white font-bold">{member.name[0]}</span>
                </div>
                <h3 className="font-bold text-brand-brown">{member.name}</h3>
                <p className="text-brand-red text-sm font-semibold mt-0.5">{member.role}</p>
                <p className="text-xs text-muted-foreground mt-2">{member.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Highlight */}
      <section className="py-12 bg-brand-brown">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MapPin className="w-10 h-10 text-brand-mustard mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Easy to Find, Hard to Forget</h3>
          <p className="text-white/70 mb-6">
            Gate No 2, Metro Station, Nangli, Najafgarh, New Delhi, Delhi 110043
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-brand-mustard text-brand-brown px-8 py-3.5 rounded-full font-semibold hover:bg-brand-mustard-light transition-all shadow-lg hover:-translate-y-0.5"
          >
            <CalendarDays className="w-5 h-5" />
            Book a Table
          </Link>
        </div>
      </section>
    </div>
  );
}
