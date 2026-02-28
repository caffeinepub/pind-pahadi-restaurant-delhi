import { useState, useMemo } from 'react';
import { ShoppingCart, Plus, Minus, X, Send } from 'lucide-react';
import { RESTAURANT_WHATSAPP_NUMBER } from '../components/WhatsAppButton';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  image?: string;
  category: string;
}

const menuData: MenuItem[] = [
  // Starters
  { id: 's1', name: 'Veg Momos', description: 'Steamed dumplings stuffed with spiced vegetables', price: 120, isVeg: true, image: '/assets/generated/veg-momos.dim_400x300.png', category: 'Starters' },
  { id: 's2', name: 'Paneer Tikka', description: 'Marinated cottage cheese grilled in tandoor', price: 180, isVeg: true, image: '/assets/generated/paneer-tikka.dim_400x300.png', category: 'Starters' },
  { id: 's3', name: 'Aloo Tikki', description: 'Crispy potato patties with chutneys', price: 90, isVeg: true, image: '/assets/generated/aloo-paratha.dim_400x300.png', category: 'Starters' },
  { id: 's4', name: 'Veg Spring Rolls', description: 'Crispy rolls filled with mixed vegetables', price: 110, isVeg: true, image: '/assets/generated/veg-burger.dim_400x300.png', category: 'Starters' },
  { id: 's5', name: 'Corn Chaat', description: 'Spiced sweet corn with tangy masala', price: 80, isVeg: true, image: '/assets/generated/chole-bhature.dim_400x300.png', category: 'Starters' },

  // Main Course
  { id: 'm1', name: 'Punjabi Thali', description: 'Complete meal with dal, sabzi, roti, rice & dessert', price: 280, isVeg: true, image: '/assets/generated/punjabi-thali.dim_400x300.png', category: 'Main Course' },
  { id: 'm2', name: 'Dal Makhani', description: 'Slow-cooked black lentils in rich buttery gravy', price: 160, isVeg: true, image: '/assets/generated/dal-makhani.dim_400x300.png', category: 'Main Course' },
  { id: 'm3', name: 'Paneer Butter Masala', description: 'Cottage cheese in creamy tomato-based gravy', price: 200, isVeg: true, image: '/assets/generated/butter-chicken.dim_400x300.png', category: 'Main Course' },
  { id: 'm4', name: 'Sarson Ka Saag', description: 'Traditional mustard greens with makki roti', price: 180, isVeg: true, image: '/assets/generated/palak-paneer.dim_400x300.png', category: 'Main Course' },
  { id: 'm5', name: 'Chole Bhature', description: 'Spiced chickpeas with fluffy fried bread', price: 150, isVeg: true, image: '/assets/generated/chole-bhature.dim_400x300.png', category: 'Main Course' },
  { id: 'm6', name: 'Veg Biryani', description: 'Fragrant basmati rice with mixed vegetables & spices', price: 220, isVeg: true, image: '/assets/generated/rajma-chawal.dim_400x300.png', category: 'Main Course' },

  // Beverages
  { id: 'b1', name: 'Masala Chai', description: 'Spiced Indian tea with ginger & cardamom', price: 40, isVeg: true, image: '/assets/generated/masala-chai.dim_400x300.png', category: 'Beverages' },
  { id: 'b2', name: 'Lassi (Sweet)', description: 'Chilled yogurt drink with sugar & rose water', price: 80, isVeg: true, image: '/assets/generated/lassi.dim_400x300.png', category: 'Beverages' },
  { id: 'b3', name: 'Lassi (Salted)', description: 'Refreshing salted yogurt drink', price: 70, isVeg: true, image: '/assets/generated/lassi.dim_400x300.png', category: 'Beverages' },
  { id: 'b4', name: 'Fresh Lime Soda', description: 'Chilled lime juice with soda water', price: 60, isVeg: true, image: '/assets/generated/coffee.dim_400x300.png', category: 'Beverages' },
  { id: 'b5', name: 'Mango Shake', description: 'Thick mango milkshake with fresh mangoes', price: 100, isVeg: true, image: '/assets/generated/lassi.dim_400x300.png', category: 'Beverages' },

  // Combos
  { id: 'c1', name: 'Veg Burger Combo', description: 'Veg burger + fries + cold drink', price: 199, isVeg: true, image: '/assets/generated/veg-burger.dim_400x300.png', category: 'Combos' },
  { id: 'c2', name: 'Momos + Chai Combo', description: '6 momos + masala chai', price: 140, isVeg: true, image: '/assets/generated/veg-momos.dim_400x300.png', category: 'Combos' },
  { id: 'c3', name: 'Thali + Lassi Combo', description: 'Punjabi thali + sweet lassi', price: 320, isVeg: true, image: '/assets/generated/punjabi-thali.dim_400x300.png', category: 'Combos' },
  { id: 'c4', name: 'Snack Platter', description: 'Aloo tikki + spring rolls + corn chaat', price: 250, isVeg: true, image: '/assets/generated/paneer-tikka.dim_400x300.png', category: 'Combos' },
];

const categories = ['Starters', 'Main Course', 'Beverages', 'Combos'];

type CartItem = { item: MenuItem; quantity: number };

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('Starters');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  const filteredItems = useMemo(
    () => menuData.filter((item) => item.category === activeCategory),
    [activeCategory]
  );

  const cartItems: CartItem[] = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([id, quantity]) => ({
          item: menuData.find((m) => m.id === id)!,
          quantity,
        }))
        .filter((ci) => ci.item),
    [cart]
  );

  const totalItems = useMemo(
    () => Object.values(cart).reduce((sum, qty) => sum + qty, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0),
    [cartItems]
  );

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] ?? 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: next };
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const clearCart = () => setCart({});

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    const lines: string[] = [
      '🍽️ *New Food Order - Pind Pahadi Restaurant*',
      '',
      '*Order Details:*',
    ];

    cartItems.forEach((ci) => {
      const subtotal = ci.item.price * ci.quantity;
      lines.push(`• ${ci.item.name} x${ci.quantity} — ₹${subtotal}`);
    });

    lines.push('');
    lines.push(`*Total Amount: ₹${totalPrice}*`);
    lines.push('');
    lines.push('Please confirm my order. Thank you! 🙏');

    const message = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/${RESTAURANT_WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');
    setOrderSent(true);
    setTimeout(() => {
      setOrderSent(false);
      clearCart();
      setCartOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="bg-brown-800 text-cream-50 py-12 px-4 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">Our Menu</h1>
        <p className="text-cream-200 text-lg">हमारा मेनू — Authentic Punjabi Flavours</p>
      </section>

      {/* Sticky Category Tabs */}
      <div className="sticky top-0 z-30 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto py-3 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-brown-700 text-cream-50 shadow-md'
                  : 'bg-cream-100 text-brown-700 hover:bg-mustard-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8 pb-32">
        <h2 className="font-display text-2xl font-bold text-brown-800 mb-6">{activeCategory}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const qty = cart[item.id] ?? 0;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-card overflow-hidden flex flex-col border border-cream-200 hover:shadow-lg transition-shadow"
              >
                {/* Food Image - always shown, with fallback placeholder */}
                <div className="h-44 overflow-hidden bg-cream-100 relative">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.classList.add('flex', 'items-center', 'justify-center');
                          const fallback = document.createElement('span');
                          fallback.textContent = '🍽️';
                          fallback.className = 'text-5xl';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl">🍽️</span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-brown-800 text-base leading-tight">{item.name}</h3>
                    <span
                      className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                        item.isVeg ? 'border-green-600' : 'border-red-600'
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          item.isVeg ? 'bg-green-600' : 'bg-red-600'
                        }`}
                      />
                    </span>
                  </div>
                  <p className="text-sm text-brown-500 mb-3 flex-1">{item.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-mustard-600 font-bold text-lg">₹{item.price}</span>
                    {qty === 0 ? (
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="bg-brown-700 hover:bg-brown-800 text-cream-50 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 text-brown-700 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-bold text-brown-800">{qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-8 h-8 rounded-full bg-brown-700 hover:bg-brown-800 text-cream-50 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Cart Button */}
      {totalItems > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-40 bg-brown-700 hover:bg-brown-800 text-cream-50 px-6 py-3 rounded-full shadow-cta flex items-center gap-3 transition-all duration-300 animate-fade-in-up"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-semibold">{totalItems} item{totalItems > 1 ? 's' : ''} added</span>
          <span className="bg-mustard-500 text-brown-900 px-2 py-0.5 rounded-full text-sm font-bold">₹{totalPrice}</span>
        </button>
      )}

      {/* Cart Drawer / Panel */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setCartOpen(false)}
          />
          {/* Panel */}
          <div className="relative bg-white w-full md:max-w-lg md:rounded-2xl rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-brown-700" />
                <h2 className="font-display text-xl font-bold text-brown-800">Your Order</h2>
                <span className="bg-brown-700 text-cream-50 text-xs px-2 py-0.5 rounded-full">{totalItems}</span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="text-brown-500 hover:text-brown-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {cartItems.map((ci) => (
                <div key={ci.item.id} className="flex items-center gap-3 bg-cream-50 rounded-xl p-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-brown-800 text-sm truncate">{ci.item.name}</p>
                    <p className="text-xs text-brown-500">₹{ci.item.price} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(ci.item.id, -1)}
                      className="w-7 h-7 rounded-full bg-cream-200 hover:bg-cream-300 text-brown-700 flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-bold text-brown-800 text-sm">{ci.quantity}</span>
                    <button
                      onClick={() => updateQty(ci.item.id, 1)}
                      className="w-7 h-7 rounded-full bg-brown-700 text-cream-50 hover:bg-brown-800 flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-right min-w-[56px]">
                    <p className="font-bold text-mustard-600 text-sm">₹{ci.item.price * ci.quantity}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(ci.item.id)}
                    className="text-brown-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-cream-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-brown-600 font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-brown-800">₹{totalPrice}</span>
              </div>
              <p className="text-xs text-brown-400 text-center">
                Order will be sent via WhatsApp for confirmation
              </p>
              <button
                onClick={handlePlaceOrder}
                disabled={orderSent}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                {orderSent ? (
                  <>✅ Order Sent!</>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Place Order via WhatsApp
                  </>
                )}
              </button>
              <button
                onClick={clearCart}
                className="w-full text-brown-500 hover:text-red-500 text-sm py-1 transition-colors"
              >
                Clear all items
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
