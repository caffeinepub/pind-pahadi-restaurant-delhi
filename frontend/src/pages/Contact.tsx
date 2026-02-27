import { useState } from 'react';
import { Phone, MapPin, Clock, CheckCircle, Loader2, Navigation } from 'lucide-react';
import { useSubmitBooking } from '../hooks/useQueries';

const PHONE = '+91-9999999999';
const PHONE_DISPLAY = '+91-99999 99999';
const ADDRESS = 'Gate No 2, Metro Station, Nangli, Najafgarh, New Delhi, Delhi 110043';
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`;
const MAPS_EMBED_URL = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.0!2d76.9798!3d28.6092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzMzLjEiTiA3NsKwNTgnNDcuMyJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin`;

interface FormData {
  name: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
  specialRequest: string;
}

const initialForm: FormData = {
  name: '',
  phone: '',
  guests: '2',
  date: '',
  time: '',
  specialRequest: '',
};

export default function Contact() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const { mutate: submitBooking, isPending, isSuccess, isError } = useSubmitBooking();

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[+\d\s-]{8,15}$/.test(form.phone)) newErrors.phone = 'Enter a valid phone number';
    if (!form.guests || parseInt(form.guests) < 1) newErrors.guests = 'At least 1 guest required';
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.time) newErrors.time = 'Time is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    submitBooking({
      name: form.name,
      phone: form.phone,
      guests: parseInt(form.guests),
      date: form.date,
      time: form.time,
      specialRequest: form.specialRequest,
    });
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
  };

  // Generate time slots — explicitly typed as string[]
  const timeSlots: string[] = [];
  for (let h = 10; h <= 21; h++) {
    timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
    if (h < 21) timeSlots.push(`${h.toString().padStart(2, '0')}:30`);
  }

  // Min date = today
  const today = new Date().toISOString().split('T')[0];

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-brown/30 ${
      errors[field]
        ? 'border-brand-red bg-red-50 focus:border-brand-red'
        : 'border-border bg-white focus:border-brand-brown'
    }`;

  return (
    <div className="pb-16 lg:pb-0">
      {/* Page Header */}
      <div className="bg-brand-brown py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">Book a Table</h1>
          <p className="font-devanagari text-brand-mustard text-xl mb-4">टेबल बुक करें</p>
          <p className="text-white/70 max-w-xl mx-auto">
            Reserve your spot and we'll make sure everything is ready for you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Booking Form */}
          <div>
            <div className="bg-white rounded-3xl shadow-card p-6 sm:p-8">
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-brown mb-2">Booking Received!</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Thank you! Our team will call you shortly to confirm your booking.
                  </p>
                  <div className="bg-brand-cream rounded-2xl p-4 text-sm text-left space-y-2 mb-6">
                    <p><span className="font-semibold text-brand-brown">Name:</span> {form.name}</p>
                    <p><span className="font-semibold text-brand-brown">Phone:</span> {form.phone}</p>
                    <p><span className="font-semibold text-brand-brown">Guests:</span> {form.guests}</p>
                    <p><span className="font-semibold text-brand-brown">Date:</span> {form.date}</p>
                    <p><span className="font-semibold text-brand-brown">Time:</span> {form.time}</p>
                    {form.specialRequest && (
                      <p><span className="font-semibold text-brand-brown">Note:</span> {form.specialRequest}</p>
                    )}
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-brand-brown font-semibold text-sm hover:underline"
                  >
                    Make another booking
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-brand-brown mb-6">Reserve Your Table</h2>
                  {isError && (
                    <div className="mb-4 p-3 bg-red-50 border border-brand-red/30 rounded-xl text-sm text-brand-red">
                      Something went wrong. Please try again or call us directly.
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-brand-brown mb-1.5">
                        Full Name <span className="text-brand-red">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={inputClass('name')}
                      />
                      {errors.name && <p className="text-xs text-brand-red mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-brand-brown mb-1.5">
                        Phone Number <span className="text-brand-red">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className={inputClass('phone')}
                      />
                      {errors.phone && <p className="text-xs text-brand-red mt-1">{errors.phone}</p>}
                    </div>

                    {/* Guests + Date */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-brand-brown mb-1.5">
                          Guests <span className="text-brand-red">*</span>
                        </label>
                        <select
                          name="guests"
                          value={form.guests}
                          onChange={handleChange}
                          className={inputClass('guests')}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                          ))}
                          <option value="11">10+ Guests</option>
                        </select>
                        {errors.guests && <p className="text-xs text-brand-red mt-1">{errors.guests}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-brand-brown mb-1.5">
                          Date <span className="text-brand-red">*</span>
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={form.date}
                          onChange={handleChange}
                          min={today}
                          className={inputClass('date')}
                        />
                        {errors.date && <p className="text-xs text-brand-red mt-1">{errors.date}</p>}
                      </div>
                    </div>

                    {/* Time */}
                    <div>
                      <label className="block text-sm font-semibold text-brand-brown mb-1.5">
                        Preferred Time <span className="text-brand-red">*</span>
                      </label>
                      <select
                        name="time"
                        value={form.time}
                        onChange={handleChange}
                        className={inputClass('time')}
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {errors.time && <p className="text-xs text-brand-red mt-1">{errors.time}</p>}
                    </div>

                    {/* Special Request */}
                    <div>
                      <label className="block text-sm font-semibold text-brand-brown mb-1.5">
                        Special Request <span className="text-muted-foreground font-normal">(optional)</span>
                      </label>
                      <textarea
                        name="specialRequest"
                        value={form.specialRequest}
                        onChange={handleChange}
                        placeholder="Any dietary requirements, occasion, or special arrangements..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-brown/30 focus:border-brand-brown resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full flex items-center justify-center gap-2 bg-brand-red text-white py-4 rounded-xl font-bold text-base hover:bg-brand-red-light transition-all shadow-cta hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Reserving...
                        </>
                      ) : (
                        'Reserve My Table'
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Contact Info + Map */}
          <div className="space-y-6">
            {/* Info Cards */}
            <div className="bg-white rounded-3xl shadow-card p-6 space-y-5">
              <h2 className="text-xl font-bold text-brand-brown">Contact & Location</h2>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-brand-red" />
                </div>
                <div>
                  <p className="font-semibold text-brand-brown text-sm">Address</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{ADDRESS}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-brand-red" />
                </div>
                <div>
                  <p className="font-semibold text-brand-brown text-sm">Phone</p>
                  <a href={`tel:${PHONE}`} className="text-sm text-brand-red hover:underline font-medium">
                    {PHONE_DISPLAY}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-brand-red" />
                </div>
                <div>
                  <p className="font-semibold text-brand-brown text-sm">Hours</p>
                  <p className="text-sm text-muted-foreground">Open daily — Closes 10 PM</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-brown text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-brown-light transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  Directions
                </a>
                <a
                  href={`tel:${PHONE}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-red text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-red-light transition-all"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-3xl overflow-hidden shadow-card h-64">
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
          </div>
        </div>
      </div>
    </div>
  );
}
