import React, { useState, useRef } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSubmitBooking } from '../hooks/useQueries';
import {
  Phone, MapPin, Clock, Users, Calendar, MessageSquare,
  LogIn, AlertCircle, CreditCard, Building2, Upload, X
} from 'lucide-react';
import BookingConfirmation from '../components/BookingConfirmation';

// Restaurant payment info — update these as needed
const RESTAURANT_UPI = 'pindpahadi@upi';
const RESTAURANT_BANK = 'HDFC Bank | A/C: 1234567890 | IFSC: HDFC0001234';
const ADVANCE_AMOUNT = 500;

export default function Contact() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const [form, setForm] = useState({
    name: '',
    phone: '',
    guests: '2',
    date: '',
    time: '',
    specialRequest: '',
  });

  const [payment, setPayment] = useState({
    paymentMethod: 'UPI',
    upiId: '',
    bankDetails: '',
    advanceAmount: String(ADVANCE_AMOUNT),
  });

  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<typeof form & typeof payment & { screenshotFileName: string | null } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submitBooking = useSubmitBooking();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setPayment(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setScreenshotFile(file);
  };

  const handleRemoveFile = () => {
    setScreenshotFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setSubmitError(null);

    try {
      await submitBooking.mutateAsync({
        name: form.name.trim(),
        phone: form.phone.trim(),
        guests: BigInt(parseInt(form.guests)),
        date: form.date,
        time: form.time,
        specialRequest: form.specialRequest.trim(),
        screenshotFileName: screenshotFile ? screenshotFile.name : null,
        paymentDetails: {
          advanceAmount: BigInt(parseInt(payment.advanceAmount) || 0),
          paymentMethod: payment.paymentMethod,
          upiDetails: payment.upiId.trim(),
          bankDetails: payment.bankDetails.trim(),
        },
      });

      setSubmittedData({
        ...form,
        ...payment,
        screenshotFileName: screenshotFile ? screenshotFile.name : null,
      });
      setSubmitted(true);
      setForm({ name: '', phone: '', guests: '2', date: '', time: '', specialRequest: '' });
      setPayment({ paymentMethod: 'UPI', upiId: '', bankDetails: '', advanceAmount: String(ADVANCE_AMOUNT) });
      setScreenshotFile(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Unauthorized') || msg.includes('auth')) {
        setSubmitError('Authentication error. Please log in again and retry.');
      } else if (msg.includes('guests')) {
        setSubmitError('Number of guests must be between 1 and 10.');
      } else {
        setSubmitError('Failed to submit booking. Please try again.');
      }
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (submitted && submittedData) {
    return (
      <BookingConfirmation
        bookingData={{
          name: submittedData.name,
          phone: submittedData.phone,
          guests: submittedData.guests,
          date: submittedData.date,
          time: submittedData.time,
          specialRequest: submittedData.specialRequest,
          paymentMethod: submittedData.paymentMethod,
          advanceAmount: submittedData.advanceAmount,
          upiId: submittedData.upiId,
          bankDetails: submittedData.bankDetails,
          screenshotFileName: submittedData.screenshotFileName,
        }}
        onBookAnother={() => {
          setSubmitted(false);
          setSubmittedData(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream-light">
      {/* Hero */}
      <section className="bg-brand-brown text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-3">Book Your Table</h1>
        <p className="text-brand-cream/80 text-lg max-w-xl mx-auto">
          Reserve your spot for an authentic Punjabi dining experience
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-brand-brown font-poppins mb-4">Contact & Location</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-red mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-brand-brown">Phone</p>
                  <a href="tel:+919891142585" className="text-brand-brown/70 hover:text-brand-red transition-colors">
                    +91 98911 42585
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-red mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-brand-brown">Address</p>
                  <p className="text-brand-brown/70">Pind Pahadi Restaurant, Delhi NCR, India</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-red mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-brand-brown">Hours</p>
                  <p className="text-brand-brown/70">Mon–Sun: 11:00 AM – 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info Box */}
          <div className="bg-white rounded-2xl shadow-card p-6 border-l-4 border-brand-mustard">
            <h3 className="text-lg font-bold text-brand-brown font-poppins mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-mustard" />
              Advance Payment Info
            </h3>
            <p className="text-brand-brown/70 text-sm mb-4">
              An advance of <span className="font-bold text-brand-brown">₹{ADVANCE_AMOUNT}</span> is required to confirm your reservation. Pay via:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-brand-cream rounded-xl">
                <CreditCard className="w-4 h-4 text-brand-brown mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-brand-brown uppercase tracking-wide">UPI</p>
                  <p className="text-brand-brown/80 text-sm font-mono">{RESTAURANT_UPI}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-brand-cream rounded-xl">
                <Building2 className="w-4 h-4 text-brand-brown mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-brand-brown uppercase tracking-wide">Bank Transfer</p>
                  <p className="text-brand-brown/80 text-sm">{RESTAURANT_BANK}</p>
                </div>
              </div>
            </div>
            <p className="text-brand-brown/50 text-xs mt-3">
              * Please upload a payment screenshot in the booking form below.
            </p>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-card h-64">
            <iframe
              title="Restaurant Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d77.06889754725782!3d28.52758200617607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-card p-8">
          <h2 className="text-2xl font-bold text-brand-brown font-poppins mb-6">Reserve a Table</h2>

          {/* Auth status banner */}
          {!isAuthenticated ? (
            <div className="mb-6 p-4 bg-brand-cream rounded-xl border border-brand-brown/20 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-brand-brown">
                <AlertCircle className="w-5 h-5 text-brand-red shrink-0" />
                <p className="text-sm font-medium">Please log in to submit a booking</p>
              </div>
              <button
                onClick={login}
                disabled={isLoggingIn}
                className="flex items-center justify-center gap-2 bg-brand-brown text-white px-5 py-2.5 rounded-full font-semibold hover:bg-brand-brown/90 transition-colors disabled:opacity-60 text-sm"
              >
                <LogIn className="w-4 h-4" />
                {isLoggingIn ? 'Logging in…' : 'Log In to Book'}
              </button>
            </div>
          ) : (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-sm">
              <div className="w-4 h-4 rounded-full bg-green-500 shrink-0" />
              <span>Logged in — you can now submit your booking</span>
            </div>
          )}

          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-brand-brown mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={!isAuthenticated}
                  placeholder="Your name"
                  className="w-full border border-brand-brown/20 rounded-xl px-4 py-2.5 text-brand-brown placeholder-brand-brown/40 focus:outline-none focus:ring-2 focus:ring-brand-brown/30 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-brown mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  disabled={!isAuthenticated}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full border border-brand-brown/20 rounded-xl px-4 py-2.5 text-brand-brown placeholder-brand-brown/40 focus:outline-none focus:ring-2 focus:ring-brand-brown/30 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                />
              </div>
            </div>

            {/* Guests & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-brand-brown mb-1">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Guests *</span>
                </label>
                <select
                  name="guests"
                  value={form.guests}
                  onChange={handleChange}
                  required
                  disabled={!isAuthenticated}
                  className="w-full border border-brand-brown/20 rounded-xl px-4 py-2.5 text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-brown/30 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm bg-white"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-brown mb-1">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Date *</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  disabled={!isAuthenticated}
                  min={today}
                  className="w-full border border-brand-brown/20 rounded-xl px-4 py-2.5 text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-brown/30 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-semibold text-brand-brown mb-1">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Preferred Time *</span>
              </label>
              <select
                name="time"
                value={form.time}
                onChange={handleChange}
                required
                disabled={!isAuthenticated}
                className="w-full border border-brand-brown/20 rounded-xl px-4 py-2.5 text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-brown/30 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm bg-white"
              >
                <option value="">Select a time slot</option>
                {['11:00 AM','12:00 PM','01:00 PM','02:00 PM','03:00 PM','06:00 PM','07:00 PM','08:00 PM','09:00 PM','10:00 PM'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-semibold text-brand-brown mb-1">
                <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> Special Requests</span>
              </label>
              <textarea
                name="specialRequest"
                value={form.specialRequest}
                onChange={handleChange}
                disabled={!isAuthenticated}
                rows={2}
                placeholder="Dietary requirements, occasion, seating preference…"
                className="w-full border border-brand-brown/20 rounded-xl px-4 py-2.5 text-brand-brown placeholder-brand-brown/40 focus:outline-none focus:ring-2 focus:ring-brand-brown/30 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm resize-none"
              />
            </div>

            {/* Payment Details Section */}
            <div className="border-t border-brand-brown/10 pt-4">
              <h3 className="text-base font-bold text-brand-brown mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-mustard" />
                Payment Details
                <span className="text-xs font-normal text-brand-brown/50 ml-1">(Advance: ₹{ADVANCE_AMOUNT})</span>
              </h3>

              {/* Payment Method */}
              <div className="mb-3">
                <label className="block text-sm font-semibold text-brand-brown mb-1">Payment Method *</label>
                <select
                  name="paymentMethod"
                  value={payment.paymentMethod}
                  onChange={handlePaymentChange}
                  required
                  disabled={!isAuthenticated}
                  className="w-full border border-brand-brown/20 rounded-xl px-4 py-2.5 text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-brown/30 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm bg-white"
                >
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash (Pay at Restaurant)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* UPI ID (shown when UPI selected) */}
              {(payment.paymentMethod === 'UPI' || payment.paymentMethod === 'Other') && (
                <div className="mb-3">
                  <label className="block text-sm font-semibold text-brand-brown mb-1">
                    {payment.paymentMethod === 'UPI' ? 'Your UPI ID / Transaction ID' : 'Transaction Reference'}
                  </label>
                  <input
                    type="text"
                    name="upiId"
                    value={payment.upiId}
                    onChange={handlePaymentChange}
                    disabled={!isAuthenticated}
                    placeholder={payment.paymentMethod === 'UPI' ? 'e.g. yourname@upi or txn ID' : 'Transaction reference'}
                    className="w-full border border-brand-brown/20 rounded-xl px-4 py-2.5 text-brand-brown placeholder-brand-brown/40 focus:outline-none focus:ring-2 focus:ring-brand-brown/30 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                  />
                </div>
              )}

              {/* Bank Details (shown when Bank Transfer selected) */}
              {payment.paymentMethod === 'Bank Transfer' && (
                <div className="mb-3">
                  <label className="block text-sm font-semibold text-brand-brown mb-1">Transaction / Reference Number</label>
                  <input
                    type="text"
                    name="bankDetails"
                    value={payment.bankDetails}
                    onChange={handlePaymentChange}
                    disabled={!isAuthenticated}
                    placeholder="Bank transaction reference number"
                    className="w-full border border-brand-brown/20 rounded-xl px-4 py-2.5 text-brand-brown placeholder-brand-brown/40 focus:outline-none focus:ring-2 focus:ring-brand-brown/30 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                  />
                </div>
              )}

              {/* Advance Amount */}
              <div className="mb-3">
                <label className="block text-sm font-semibold text-brand-brown mb-1">Advance Amount Paid (₹)</label>
                <input
                  type="number"
                  name="advanceAmount"
                  value={payment.advanceAmount}
                  onChange={handlePaymentChange}
                  disabled={!isAuthenticated}
                  min="0"
                  placeholder="500"
                  className="w-full border border-brand-brown/20 rounded-xl px-4 py-2.5 text-brand-brown placeholder-brand-brown/40 focus:outline-none focus:ring-2 focus:ring-brand-brown/30 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                />
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-sm font-semibold text-brand-brown mb-1">
                  <span className="flex items-center gap-1"><Upload className="w-3.5 h-3.5" /> Payment Screenshot</span>
                </label>
                {screenshotFile ? (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-green-700 text-sm font-medium truncate">{screenshotFile.name}</p>
                      <p className="text-green-600 text-xs">{(screenshotFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1 rounded-full hover:bg-green-100 text-green-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-brand-brown/20 rounded-xl px-4 py-4 cursor-pointer hover:border-brand-brown/40 hover:bg-brand-cream/30 transition-colors ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Upload className="w-6 h-6 text-brand-brown/40" />
                    <span className="text-brand-brown/60 text-sm text-center">
                      Click to upload payment screenshot<br />
                      <span className="text-xs text-brand-brown/40">PNG, JPG up to 5MB</span>
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={!isAuthenticated}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!isAuthenticated || submitBooking.isPending}
              className="w-full bg-brand-brown text-white py-3 rounded-full font-bold text-base hover:bg-brand-brown/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitBooking.isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Submitting…
                </>
              ) : (
                'Confirm Reservation'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
