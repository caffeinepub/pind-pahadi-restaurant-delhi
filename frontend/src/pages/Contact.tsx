import React, { useState, useRef } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSubmitBooking } from '../hooks/useQueries';
import BookingConfirmation from '../components/BookingConfirmation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lock, Upload, X, Loader2 } from 'lucide-react';

function generateReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'PP-';
  for (let i = 0; i < 6; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

interface BookingFormData {
  name: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
  specialRequest: string;
  paymentMethod: string;
  upiTransactionId: string;
  bankReference: string;
  advanceAmount: string;
  screenshotFile: File | null;
}

const TIME_SLOTS = [
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM',
];

export default function Contact() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const submitBooking = useSubmitBooking();

  const [form, setForm] = useState<BookingFormData>({
    name: '',
    phone: '',
    guests: '2',
    date: '',
    time: '',
    specialRequest: '',
    paymentMethod: 'UPI',
    upiTransactionId: '',
    bankReference: '',
    advanceAmount: '500',
    screenshotFile: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<BookingFormData | null>(null);
  const [reference, setReference] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setField = (field: keyof BookingFormData, value: string | File | null) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) newErrors.phone = 'Valid 10-digit phone number required';
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.time) newErrors.time = 'Time is required';
    const guestsNum = parseInt(form.guests);
    if (isNaN(guestsNum) || guestsNum < 1 || guestsNum > 10) newErrors.guests = 'Guests must be between 1 and 10';
    const advance = parseInt(form.advanceAmount);
    if (isNaN(advance) || advance < 0) newErrors.advanceAmount = 'Enter a valid advance amount';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const ref = generateReference();

    try {
      await submitBooking.mutateAsync({
        name: form.name.trim(),
        phone: form.phone.trim(),
        guests: BigInt(parseInt(form.guests)),
        date: form.date,
        time: form.time,
        specialRequest: form.specialRequest.trim(),
        screenshotFileName: form.screenshotFile ? form.screenshotFile.name : null,
        paymentDetails: {
          advanceAmount: BigInt(parseInt(form.advanceAmount) || 0),
          paymentMethod: form.paymentMethod,
          upiDetails: form.upiTransactionId.trim(),
          bankDetails: form.bankReference.trim(),
        },
      });

      setReference(ref);
      setSubmittedData({ ...form });
      setSubmitted(true);
    } catch (err) {
      console.error('Booking submission error:', err);
    }
  };

  const handleNewBooking = () => {
    setSubmitted(false);
    setSubmittedData(null);
    setReference('');
    setForm({
      name: '',
      phone: '',
      guests: '2',
      date: '',
      time: '',
      specialRequest: '',
      paymentMethod: 'UPI',
      upiTransactionId: '',
      bankReference: '',
      advanceAmount: '500',
      screenshotFile: null,
    });
  };

  // Not logged in
  if (!identity) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-card border border-mustard/30 max-w-sm w-full p-8 text-center">
          <div className="w-16 h-16 bg-brown/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-brown" />
          </div>
          <h2 className="text-2xl font-bold text-brown font-poppins mb-2">Sign In to Book</h2>
          <p className="text-brown/60 text-sm mb-6">
            Please sign in with Internet Identity to make a reservation at Pind Pahadi.
          </p>
          <Button
            onClick={login}
            disabled={loginStatus === 'logging-in'}
            className="w-full bg-brown hover:bg-brown/90 text-white font-semibold py-3 rounded-xl"
          >
            {loginStatus === 'logging-in' ? 'Signing in…' : 'Sign In to Continue'}
          </Button>
        </div>
      </div>
    );
  }

  // Booking submitted successfully
  if (submitted && submittedData) {
    return (
      <BookingConfirmation
        name={submittedData.name}
        phone={submittedData.phone}
        guests={BigInt(parseInt(submittedData.guests))}
        date={submittedData.date}
        time={submittedData.time}
        specialRequest={submittedData.specialRequest}
        paymentDetails={{
          advanceAmount: BigInt(parseInt(submittedData.advanceAmount) || 0),
          paymentMethod: submittedData.paymentMethod,
          upiDetails: submittedData.upiTransactionId,
          bankDetails: submittedData.bankReference,
        }}
        screenshotFileName={submittedData.screenshotFile?.name ?? null}
        reference={reference}
        onClose={handleNewBooking}
      />
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-brown font-poppins mb-3">Book a Table</h1>
          <p className="text-brown/60">Reserve your spot for an authentic Punjabi dining experience</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card border border-mustard/20 overflow-hidden">
          {/* Guest Details */}
          <div className="p-6 border-b border-mustard/10">
            <h2 className="text-lg font-bold text-brown font-poppins mb-4">Guest Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-brown font-medium text-sm mb-1.5 block">Full Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  placeholder="Your full name"
                  className={`border-mustard/30 focus:ring-mustard/40 ${errors.name ? 'border-red-400' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="phone" className="text-brown font-medium text-sm mb-1.5 block">Phone Number *</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={e => setField('phone', e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={`border-mustard/30 focus:ring-mustard/40 ${errors.phone ? 'border-red-400' : ''}`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="p-6 border-b border-mustard/10">
            <h2 className="text-lg font-bold text-brown font-poppins mb-4">Reservation Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date" className="text-brown font-medium text-sm mb-1.5 block">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  min={today}
                  onChange={e => setField('date', e.target.value)}
                  className={`border-mustard/30 focus:ring-mustard/40 ${errors.date ? 'border-red-400' : ''}`}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <Label className="text-brown font-medium text-sm mb-1.5 block">Time *</Label>
                <Select value={form.time} onValueChange={v => setField('time', v)}>
                  <SelectTrigger className={`border-mustard/30 ${errors.time ? 'border-red-400' : ''}`}>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map(slot => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
              </div>
              <div>
                <Label className="text-brown font-medium text-sm mb-1.5 block">Guests *</Label>
                <Select value={form.guests} onValueChange={v => setField('guests', v)}>
                  <SelectTrigger className="border-mustard/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(10)].map((_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>{i + 1} {i === 0 ? 'person' : 'people'}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests}</p>}
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="specialRequest" className="text-brown font-medium text-sm mb-1.5 block">Special Requests</Label>
              <Textarea
                id="specialRequest"
                value={form.specialRequest}
                onChange={e => setField('specialRequest', e.target.value)}
                placeholder="Dietary requirements, occasion, seating preference…"
                rows={3}
                className="border-mustard/30 focus:ring-mustard/40 resize-none"
              />
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-6 border-b border-mustard/10">
            <h2 className="text-lg font-bold text-brown font-poppins mb-1">Payment Details</h2>
            <p className="text-brown/50 text-sm mb-4">Pay an advance to confirm your booking</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-brown font-medium text-sm mb-1.5 block">Payment Method</Label>
                <Select value={form.paymentMethod} onValueChange={v => setField('paymentMethod', v)}>
                  <SelectTrigger className="border-mustard/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cash">Cash (Pay at Restaurant)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="advanceAmount" className="text-brown font-medium text-sm mb-1.5 block">Advance Amount (₹)</Label>
                <Input
                  id="advanceAmount"
                  type="number"
                  value={form.advanceAmount}
                  onChange={e => setField('advanceAmount', e.target.value)}
                  min="0"
                  placeholder="500"
                  className={`border-mustard/30 focus:ring-mustard/40 ${errors.advanceAmount ? 'border-red-400' : ''}`}
                />
                {errors.advanceAmount && <p className="text-red-500 text-xs mt-1">{errors.advanceAmount}</p>}
              </div>
            </div>

            {form.paymentMethod === 'UPI' && (
              <div className="mt-4">
                <Label htmlFor="upiTransactionId" className="text-brown font-medium text-sm mb-1.5 block">UPI Transaction ID</Label>
                <Input
                  id="upiTransactionId"
                  value={form.upiTransactionId}
                  onChange={e => setField('upiTransactionId', e.target.value)}
                  placeholder="Enter UPI transaction ID"
                  className="border-mustard/30 focus:ring-mustard/40"
                />
              </div>
            )}

            {form.paymentMethod === 'Bank Transfer' && (
              <div className="mt-4">
                <Label htmlFor="bankReference" className="text-brown font-medium text-sm mb-1.5 block">Bank Reference Number</Label>
                <Input
                  id="bankReference"
                  value={form.bankReference}
                  onChange={e => setField('bankReference', e.target.value)}
                  placeholder="Enter bank reference number"
                  className="border-mustard/30 focus:ring-mustard/40"
                />
              </div>
            )}

            {/* Screenshot Upload */}
            {form.paymentMethod !== 'Cash' && (
              <div className="mt-4">
                <Label className="text-brown font-medium text-sm mb-1.5 block">Payment Screenshot (Optional)</Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-mustard/30 rounded-xl p-4 text-center cursor-pointer hover:border-mustard/60 hover:bg-mustard/5 transition-colors"
                >
                  {form.screenshotFile ? (
                    <div className="flex items-center justify-between">
                      <span className="text-brown text-sm font-medium">{form.screenshotFile.name}</span>
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setField('screenshotFile', null); }}
                        className="text-brown/40 hover:text-red-500 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="w-6 h-6 text-mustard" />
                      <span className="text-brown/60 text-sm">Click to upload payment screenshot</span>
                      <span className="text-brown/40 text-xs">PNG, JPG up to 5MB</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => setField('screenshotFile', e.target.files?.[0] ?? null)}
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="p-6">
            {submitBooking.isError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">Failed to submit booking. Please try again.</p>
              </div>
            )}
            <Button
              type="submit"
              disabled={submitBooking.isPending}
              className="w-full bg-brown hover:bg-brown/90 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2"
            >
              {submitBooking.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting Booking…
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
            <p className="text-center text-brown/40 text-xs mt-3">
              By booking, you agree to our cancellation policy. We'll call to confirm your reservation.
            </p>
          </div>
        </form>

        {/* Contact Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {[
            { icon: '📞', label: 'Call Us', value: '+91 98911 42585' },
            { icon: '📍', label: 'Location', value: 'Sector 18, Noida' },
            { icon: '🕐', label: 'Hours', value: '12 PM – 11 PM Daily' },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-xl border border-mustard/20 p-4 shadow-sm">
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="text-brown/60 text-xs font-medium uppercase tracking-wide">{item.label}</p>
              <p className="text-brown font-semibold text-sm mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
