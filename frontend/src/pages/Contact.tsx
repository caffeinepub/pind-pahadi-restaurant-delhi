import { useState, useRef } from 'react';
import { Phone, MapPin, Clock, CheckCircle, Loader2, Navigation, Copy, Check, ImageUp, Wifi } from 'lucide-react';
import { useSubmitBooking } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';

const PHONE = '+91-9891142585';
const PHONE_DISPLAY = '+91-98911 42585';
const ADDRESS = 'Gate No 2, Metro Station, Nangli, Najafgarh, New Delhi, Delhi 110043';
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`;
const MAPS_EMBED_URL = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.0!2d76.9798!3d28.6092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzMzLjEiTiA3NsKwNTgnNDcuMyJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin`;

const DEPOSIT_PER_GUEST = 100;
const UPI_ID = 'anshu14092028@okhdfcbank';

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
  const [errors, setErrors] = useState<Partial<FormData & { screenshot: string }>>({});
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [upiCopied, setUpiCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // useActor only exposes { actor, isFetching }
  const { actor, isFetching: actorFetching } = useActor();
  const { mutate: submitBooking, isPending, isSuccess, isError, error: mutationError } = useSubmitBooking();

  const isActorReady = !!actor && !actorFetching;

  const validate = (): boolean => {
    const newErrors: Partial<FormData & { screenshot: string }> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[+\d\s-]{8,15}$/.test(form.phone)) newErrors.phone = 'Enter a valid phone number';
    if (!form.guests || parseInt(form.guests) < 1) newErrors.guests = 'At least 1 guest required';
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.time) newErrors.time = 'Time is required';
    if (!screenshotFile) newErrors.screenshot = 'Please upload your UPI payment screenshot';
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setScreenshotFile(file);
    if (file) {
      setErrors((prev) => ({ ...prev, screenshot: undefined }));
    }
  };

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    } catch {
      // fallback: select text
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
      screenshotFileName: screenshotFile?.name ?? null,
    });
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    setScreenshotFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Generate time slots
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

  // Calculate deposit for current guest count
  const guestCount = parseInt(form.guests) || 0;
  const depositAmount = guestCount * DEPOSIT_PER_GUEST;

  // Determine error message to show
  const errorMessage = (() => {
    if (!isError) return null;
    const msg = mutationError instanceof Error ? mutationError.message : '';
    if (msg.includes('Connection not ready')) {
      return 'Still connecting to the server. Please wait a moment and try again.';
    }
    return 'Something went wrong. Please try again or call us directly.';
  })();

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
                  <div className="bg-brand-cream rounded-2xl p-4 text-sm text-left space-y-2 mb-4">
                    <p><span className="font-semibold text-brand-brown">Name:</span> {form.name}</p>
                    <p><span className="font-semibold text-brand-brown">Phone:</span> {form.phone}</p>
                    <p><span className="font-semibold text-brand-brown">Guests:</span> {form.guests}</p>
                    <p><span className="font-semibold text-brand-brown">Date:</span> {form.date}</p>
                    <p><span className="font-semibold text-brand-brown">Time:</span> {form.time}</p>
                    {form.specialRequest && (
                      <p><span className="font-semibold text-brand-brown">Note:</span> {form.specialRequest}</p>
                    )}
                    {screenshotFile && (
                      <p>
                        <span className="font-semibold text-brand-brown">Payment Screenshot:</span>{' '}
                        <span className="text-green-700 font-medium">{screenshotFile.name}</span>
                      </p>
                    )}
                  </div>
                  {/* Deposit confirmation notice */}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-left mb-6">
                    <p className="font-bold text-brand-brown mb-1">
                      💰 Booking Deposit: ₹{parseInt(form.guests) * DEPOSIT_PER_GUEST}
                    </p>
                    <p className="text-brand-brown/70 text-xs leading-relaxed">
                      ₹{DEPOSIT_PER_GUEST} × {form.guests} {parseInt(form.guests) === 1 ? 'guest' : 'guests'} = ₹{parseInt(form.guests) * DEPOSIT_PER_GUEST} will be collected at arrival and fully deducted from your final bill.
                      In case of cancellation, only 50% (₹{Math.round(parseInt(form.guests) * DEPOSIT_PER_GUEST * 0.5)}) is refundable.
                    </p>
                    {screenshotFile && (
                      <p className="text-green-700 text-xs mt-2 font-medium">
                        ✓ Payment screenshot received: {screenshotFile.name}
                      </p>
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

                  {/* Actor connecting state — shown while actor is initializing */}
                  {actorFetching && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                      <span>Connecting to server, please wait…</span>
                    </div>
                  )}

                  {/* Submission error */}
                  {isError && (
                    <div className="mb-4 p-3 bg-red-50 border border-brand-red/30 rounded-xl text-sm text-brand-red flex items-center gap-2">
                      <Wifi className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
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
                        Special Request <span className="text-brand-brown/40 font-normal">(optional)</span>
                      </label>
                      <textarea
                        name="specialRequest"
                        value={form.specialRequest}
                        onChange={handleChange}
                        placeholder="Any dietary requirements, occasion, seating preference…"
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-brown/30 focus:border-brand-brown resize-none"
                      />
                    </div>

                    {/* UPI Payment Section */}
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">💰</span>
                        <div>
                          <p className="font-bold text-brand-brown text-sm">
                            Booking Deposit Required: ₹{depositAmount}
                          </p>
                          <p className="text-xs text-brand-brown/70 mt-0.5">
                            ₹{DEPOSIT_PER_GUEST} × {guestCount} {guestCount === 1 ? 'guest' : 'guests'} — deducted from your final bill.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-3 border border-amber-200">
                        <p className="text-xs font-semibold text-brand-brown mb-1">Pay via UPI:</p>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-brand-brown flex-1 break-all">{UPI_ID}</code>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="flex-shrink-0 p-1.5 rounded-lg bg-brand-mustard/20 hover:bg-brand-mustard/40 transition-colors"
                            title="Copy UPI ID"
                          >
                            {upiCopied ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-brand-brown" />
                            )}
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-brand-brown/60 leading-relaxed">
                        After paying, upload the screenshot below. 50% refundable on cancellation.
                      </p>
                    </div>

                    {/* Screenshot Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-brand-brown mb-1.5">
                        UPI Payment Screenshot <span className="text-brand-red">*</span>
                      </label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full px-4 py-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors flex flex-col items-center gap-2 ${
                          errors.screenshot
                            ? 'border-brand-red bg-red-50'
                            : screenshotFile
                            ? 'border-green-400 bg-green-50'
                            : 'border-border hover:border-brand-brown/50 bg-white'
                        }`}
                      >
                        {screenshotFile ? (
                          <>
                            <Check className="w-6 h-6 text-green-600" />
                            <p className="text-sm text-green-700 font-medium text-center break-all">{screenshotFile.name}</p>
                            <p className="text-xs text-green-600">Tap to change</p>
                          </>
                        ) : (
                          <>
                            <ImageUp className="w-6 h-6 text-brand-brown/50" />
                            <p className="text-sm text-brand-brown/60">Tap to upload payment screenshot</p>
                            <p className="text-xs text-brand-brown/40">JPG, PNG, PDF accepted</p>
                          </>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {errors.screenshot && <p className="text-xs text-brand-red mt-1">{errors.screenshot}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full py-4 rounded-2xl bg-brand-brown text-white font-bold text-base transition-all hover:bg-brand-brown/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-cta"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting…
                        </>
                      ) : actorFetching ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Connecting…
                        </>
                      ) : (
                        'Confirm Booking'
                      )}
                    </button>

                    {/* Connection status note — shown when actor is not yet ready but not actively fetching */}
                    {!isActorReady && !actorFetching && (
                      <p className="text-xs text-center text-brand-brown/50 flex items-center justify-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Initializing connection…
                      </p>
                    )}
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Contact Info + Map */}
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="bg-white rounded-3xl shadow-card p-6 sm:p-8 space-y-5">
              <h2 className="text-2xl font-bold text-brand-brown">Contact Us</h2>

              <a
                href={`tel:${PHONE}`}
                className="flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-mustard/20 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-mustard/40 transition-colors">
                  <Phone className="w-5 h-5 text-brand-brown" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Phone</p>
                  <p className="font-bold text-brand-brown group-hover:text-brand-red transition-colors">{PHONE_DISPLAY}</p>
                  <p className="text-xs text-muted-foreground">Tap to call</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-mustard/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-brand-brown" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Address</p>
                  <p className="font-semibold text-brand-brown leading-snug">{ADDRESS}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-mustard/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-brand-brown" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Hours</p>
                  <p className="font-semibold text-brand-brown">Mon – Sun: 10:00 AM – 10:00 PM</p>
                  <p className="text-xs text-muted-foreground">Open all days</p>
                </div>
              </div>

              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full py-3 px-4 rounded-xl bg-brand-brown text-white font-semibold text-sm hover:bg-brand-brown/90 transition-colors justify-center"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
            </div>

            {/* Map Embed */}
            <div className="rounded-3xl overflow-hidden shadow-card">
              <iframe
                src={MAPS_EMBED_URL}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Restaurant Location"
              />
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-brand-cream rounded-3xl p-6 text-center">
              <p className="font-bold text-brand-brown mb-1">Prefer WhatsApp?</p>
              <p className="text-sm text-brand-brown/70 mb-4">
                Send us a message and we'll confirm your booking instantly.
              </p>
              <a
                href={`https://wa.me/919891142585?text=${encodeURIComponent('Hi! I would like to book a table at Pind Pahadi Restaurant.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
