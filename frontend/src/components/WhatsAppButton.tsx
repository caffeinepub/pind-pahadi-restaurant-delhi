import { SiWhatsapp } from 'react-icons/si';

const WHATSAPP_NUMBER = '919999999999';
const WHATSAPP_MESSAGE = encodeURIComponent('Hi! I would like to make a reservation at Pind Pahadi Restaurant.');
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-4 bottom-20 lg:bottom-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
      style={{ backgroundColor: '#25D366' }}
    >
      <SiWhatsapp className="w-7 h-7 text-white" />
    </a>
  );
}
