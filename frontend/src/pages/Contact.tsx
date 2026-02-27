import { useState, useRef } from 'react';
import { Phone, MapPin, Clock, CheckCircle, Loader2, Navigation, Info, Copy, Check, ImageUp, Wifi } from 'lucide-react';
import { useSubmitBooking } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';

const PHONE = '+91-9999999999';
const PHONE_DISPLAY = '+91-99999 99999';
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
    if (!isActorReady) return;
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

                  {/* Actor loading indicator */}
                  {actorFetching && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                      <span>Connecting to server, please wait…</span>
                    </div>
                  )}

                  {isError && (
                    <div className="mb-4 p-3 bg-red-50 border border-brand-red/30 rounded-xl text-sm text-brand-red">
                      {errorMessage}
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

                    {/* Deposit Policy Notice */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-800 leading-relaxed space-y-1">
                          <p className="font-bold text-amber-900">
                            Booking Deposit: ₹{depositAmount} ({guestCount} {guestCount === 1 ? 'guest' : 'guests'} × ₹{DEPOSIT_PER_GUEST})
                          </p>
                          <p>
                            A deposit of <strong>₹{DEPOSIT_PER_GUEST} per guest</strong> is collected at the time of arrival. This amount is <strong>fully deducted from your final bill</strong>.
                          </p>
                          <p>
                            In case of cancellation, only <strong>50% of the deposit is refundable</strong>.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* UPI Payment Notice */}
                    <div className="bg-brand-cream border-2 border-brand-mustard/50 rounded-xl p-4">
                      <div className="flex items-start gap-2.5">
                        <span className="text-lg flex-shrink-0 mt-0.5">💳</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-brand-brown text-sm mb-1">
                            Pay Deposit via UPI
                          </p>
                          <p className="text-xs text-brand-brown/70 leading-relaxed mb-3">
                            Please pay <strong>₹{depositAmount}</strong> ({guestCount} {guestCount === 1 ? 'guest' : 'guests'} × ₹{DEPOSIT_PER_GUEST}) to the UPI ID below before submitting your booking. Then upload the payment screenshot.
                          </p>
                          <div className="flex items-center gap-2 bg-white border border-brand-mustard/40 rounded-lg px-3 py-2">
                            <span className="text-xs text-brand-brown/50 font-medium flex-shrink-0">UPI ID:</span>
                            <code className="text-sm font-bold text-brand-brown flex-1 select-all break-all">
                              {UPI_ID}
                            </code>
                            <button
                              type="button"
                              onClick={handleCopyUpi}
                              className="flex-shrink-0 p-1 rounded-md hover:bg-brand-mustard/20 transition-colors text-brand-brown/60 hover:text-brand-brown"
                              title="Copy UPI ID"
                            >
                              {upiCopied ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          {upiCopied && (
                            <p className="text-xs text-green-600 mt-1 font-medium">✓ UPI ID copied!</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Screenshot Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-brand-brown mb-1.5">
                        Upload Payment Screenshot <span className="text-brand-red">*</span>
                      </label>
                      <div
                        className={`relative w-full rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
                          errors.screenshot
                            ? 'border-brand-red bg-red-50'
                            : screenshotFile
                            ? 'border-green-400 bg-green-50'
                            : 'border-brand-mustard/50 bg-brand-cream/40 hover:border-brand-mustard hover:bg-brand-cream/70'
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                        <div className="flex flex-col items-center justify-center py-5 px-4 text-center">
                          {screenshotFile ? (
                            <>
                              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                              <p className="text-sm font-semibold text-green-700">{screenshotFile.name}</p>
                              <p className="text-xs text-green-600 mt-0.5">
                                {(screenshotFile.size / 1024).toFixed(0)} KB — tap to change
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 rounded-full bg-brand-mustard/20 flex items-center justify-center mb-2">
                                <ImageUp className="w-5 h-5 text-brand-brown" />
                              </div>
                              <p className="text-sm font-semibold text-brand-brown">Tap to upload screenshot</p>
                              <p className="text-xs text-brand-brown/50 mt-0.5">JPEG, PNG or WebP</p>
                            </>
                          )}
                        </div>
                      </div>
                      {errors.screenshot && (
                        <p className="text-xs text-brand-red mt-1">{errors.screenshot}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isPending || actorFetching}
                      className="w-full py-4 rounded-2xl bg-brand-brown text-white font-bold text-base transition-all hover:bg-brand-brown/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting Booking…
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

                    {!isActorReady && !actorFetching && (
                      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                        <Wifi className="w-3 h-3" />
                        Unable to connect. Please refresh the page and try again.
                      </p>
                    )}
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Contact Info + Map */}
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="bg-white rounded-3xl shadow-card p-6 sm:p-8">
              <h2 className="text-xl font-bold text-brand-brown mb-5">Contact & Location</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-cream flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-brand-brown" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-brown">Address</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{ADDRESS}</p>
                    <a
                      href={MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-brand-mustard font-semibold mt-1 hover:underline"
                    >
                      <Navigation className="w-3 h-3" /> Get Directions
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-cream flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-brand-brown" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-brown">Phone</p>
                    <a href={`tel:${PHONE}`} className="text-sm text-muted-foreground hover:text-brand-brown transition-colors">
                      {PHONE_DISPLAY}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-cream flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-brand-brown" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-brown">Hours</p>
                    <p className="text-sm text-muted-foreground">Open daily — 10:00 AM to 10:00 PM</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Map */}
            <div className="rounded-3xl overflow-hidden shadow-card">
              <iframe
                src={MAPS_EMBED_URL}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Pind Pahadi Restaurant Location"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
