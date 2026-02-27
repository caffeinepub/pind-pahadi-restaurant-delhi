import { useState } from 'react';
import { Phone } from 'lucide-react';

const PHONE = '+91-9999999999';

type Category = 'Starters' | 'Main Course' | 'Beverages' | 'Combos';

interface MenuItem {
  name: string;
  desc: string;
  price: string;
  veg: boolean;
  popular?: boolean;
}

const menuData: Record<Category, MenuItem[]> = {
  Starters: [
    { name: 'Veg Momos (6 pcs)', desc: 'Steamed dumplings stuffed with spiced vegetables, served with red chutney', price: '₹120', veg: true, popular: true },
    { name: 'Fried Momos (6 pcs)', desc: 'Crispy fried dumplings with tangy dipping sauce', price: '₹140', veg: true },
    { name: 'Veg Spring Rolls', desc: 'Crunchy rolls filled with stir-fried vegetables and noodles', price: '₹110', veg: true },
    { name: 'Paneer Tikka', desc: 'Marinated cottage cheese grilled in tandoor with mint chutney', price: '₹220', veg: true, popular: true },
    { name: 'Aloo Tikki Chaat', desc: 'Crispy potato patties topped with chutneys, yogurt & sev', price: '₹90', veg: true },
    { name: 'Corn Cheese Balls', desc: 'Golden fried balls stuffed with sweet corn and melted cheese', price: '₹130', veg: true },
  ],
  'Main Course': [
    { name: 'Punjabi Thali', desc: 'Complete meal: dal makhani, paneer sabzi, 4 rotis, rice, salad & pickle', price: '₹280', veg: true, popular: true },
    { name: 'Dal Makhani', desc: 'Slow-cooked black lentils in rich buttery tomato gravy', price: '₹180', veg: true },
    { name: 'Palak Paneer', desc: 'Fresh cottage cheese in creamy spinach gravy with aromatic spices', price: '₹200', veg: true },
    { name: 'Pahadi Rajma Chawal', desc: 'Mountain-style kidney bean curry served with steamed basmati rice', price: '₹160', veg: true, popular: true },
    { name: 'Chole Bhature', desc: 'Spiced chickpea curry with two fluffy deep-fried bhature', price: '₹150', veg: true },
    { name: 'Veg Biryani', desc: 'Fragrant basmati rice cooked with seasonal vegetables and whole spices', price: '₹180', veg: true },
    { name: 'Butter Naan (2 pcs)', desc: 'Soft leavened bread baked in tandoor, brushed with butter', price: '₹60', veg: true },
  ],
  Beverages: [
    { name: 'Hot Coffee', desc: 'Rich, frothy coffee made with premium beans', price: '₹60', veg: true, popular: true },
    { name: 'Masala Chai', desc: 'Traditional spiced tea brewed with ginger, cardamom & milk', price: '₹30', veg: true },
    { name: 'Mango Lassi', desc: 'Thick, creamy yogurt drink blended with fresh Alphonso mango', price: '₹80', veg: true, popular: true },
    { name: 'Sweet Lassi', desc: 'Chilled yogurt drink sweetened with sugar and rose water', price: '₹60', veg: true },
    { name: 'Fresh Lime Soda', desc: 'Refreshing lime juice with soda, sweet or salted', price: '₹50', veg: true },
    { name: 'Cold Coffee', desc: 'Chilled blended coffee with milk and ice cream', price: '₹90', veg: true },
  ],
  Combos: [
    { name: 'Student Combo', desc: 'Veg Momos (4 pcs) + Masala Chai — perfect for a quick bite', price: '₹130', veg: true, popular: true },
    { name: 'Family Thali Combo', desc: '2 Punjabi Thalis + 2 Mango Lassi — great value for families', price: '₹680', veg: true, popular: true },
    { name: 'Snack & Sip Combo', desc: 'Paneer Tikka + Cold Coffee — a premium snack experience', price: '₹290', veg: true },
    { name: 'Lunch Special', desc: 'Chole Bhature + Sweet Lassi + Gulab Jamun — complete lunch deal', price: '₹220', veg: true },
    { name: 'Evening Treat', desc: 'Veg Spring Rolls + Hot Coffee — ideal evening snack', price: '₹160', veg: true },
  ],
};

const categories: Category[] = ['Starters', 'Main Course', 'Beverages', 'Combos'];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<Category>('Starters');

  const handleOrderNow = () => {
    window.location.href = `tel:${PHONE}`;
  };

  return (
    <div className="pb-16 lg:pb-0">
      {/* Page Header */}
      <div className="bg-brand-brown py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">Our Menu</h1>
          <p className="font-devanagari text-brand-mustard text-xl mb-4">हमारा मेनू</p>
          <p className="text-white/70 max-w-xl mx-auto">
            Authentic Pahadi & Punjabi flavours crafted with love. All prices inclusive of taxes.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-16 lg:top-20 z-30 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-1 py-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-brown text-white shadow-sm'
                    : 'text-brand-brown hover:bg-brand-cream'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-brand-brown">{activeCategory}</h2>
          <p className="text-muted-foreground text-sm mt-1">{menuData[activeCategory].length} items</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {menuData[activeCategory].map((item) => (
            <div
              key={item.name}
              className="bg-white border border-border rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5 flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-sm border-2 flex-shrink-0 ${
                      item.veg ? 'border-green-600' : 'border-red-600'
                    }`}
                  >
                    <span
                      className={`block w-2 h-2 rounded-full m-0.5 ${
                        item.veg ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    />
                  </span>
                  <h3 className="font-bold text-brand-brown text-sm leading-tight">{item.name}</h3>
                </div>
                {item.popular && (
                  <span className="flex-shrink-0 bg-brand-mustard/20 text-brand-brown text-xs font-semibold px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">{item.desc}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-brand-red font-black text-lg">{item.price}</span>
                <button
                  onClick={handleOrderNow}
                  className="flex items-center gap-1.5 bg-brand-brown text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-brand-brown-light transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Phone className="w-3 h-3" />
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-brand-cream py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-brand-brown mb-3">Ready to Order?</h3>
          <p className="text-muted-foreground mb-6">Call us directly or visit us at Najafgarh Metro Gate No. 2</p>
          <a
            href={`tel:${PHONE}`}
            className="inline-flex items-center gap-2 bg-brand-red text-white px-8 py-3.5 rounded-full font-semibold hover:bg-brand-red-light transition-all shadow-cta hover:-translate-y-0.5"
          >
            <Phone className="w-5 h-5" />
            Call to Order
          </a>
        </div>
      </div>
    </div>
  );
}
