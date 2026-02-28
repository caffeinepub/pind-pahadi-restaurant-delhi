import { MessageCircle } from 'lucide-react';

export const RESTAURANT_WHATSAPP_NUMBER = '919891142585';

export default function WhatsAppButton() {
  const message = encodeURIComponent(
    'Hello! I would like to make a reservation or inquiry at Pind Pahadi Restaurant.'
  );
  const url = `https://wa.me/${RESTAURANT_WHATSAPP_NUMBER}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="hidden group-hover:inline text-sm font-medium pr-1">WhatsApp</span>
    </a>
  );
}
