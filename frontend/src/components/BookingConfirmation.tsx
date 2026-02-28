import React, { useRef } from 'react';
import { CheckCircle, Download, Calendar, Clock, Users, Phone, MessageSquare, CreditCard, Building2 } from 'lucide-react';

interface BookingConfirmationProps {
  bookingData: {
    name: string;
    phone: string;
    guests: string;
    date: string;
    time: string;
    specialRequest: string;
    paymentMethod: string;
    advanceAmount: string;
    upiId: string;
    bankDetails: string;
    screenshotFileName: string | null;
  };
  onBookAnother: () => void;
}

export default function BookingConfirmation({ bookingData, onBookAnother }: BookingConfirmationProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const bookingRef = `PPH-${Date.now().toString().slice(-8)}`;

  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Booking Confirmation - ${bookingRef}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Poppins', sans-serif;
              background: #fdf6ee;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 24px;
            }
            .card {
              background: white;
              border-radius: 16px;
              overflow: hidden;
              max-width: 480px;
              width: 100%;
              border: 2px solid rgba(101,56,22,0.2);
              box-shadow: 0 4px 24px rgba(101,56,22,0.12);
            }
            .card-header {
              background: #5c3317;
              color: white;
              padding: 24px;
              text-align: center;
            }
            .card-header .label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7; margin-bottom: 4px; }
            .card-header .restaurant { font-size: 22px; font-weight: 700; }
            .card-header .subtitle { font-size: 12px; opacity: 0.7; margin-top: 4px; }
            .ref-badge {
              display: inline-block;
              background: rgba(255,255,255,0.2);
              color: white;
              font-family: monospace;
              font-size: 13px;
              padding: 6px 18px;
              border-radius: 20px;
              margin-top: 12px;
            }
            .divider { border-top: 2px dashed rgba(101,56,22,0.2); margin: 0 24px; }
            .section { padding: 20px 24px; }
            .section-title {
              font-size: 10px;
              font-weight: 700;
              color: rgba(101,56,22,0.5);
              text-transform: uppercase;
              letter-spacing: 2px;
              margin-bottom: 14px;
            }
            .row {
              display: flex;
              align-items: flex-start;
              gap: 10px;
              margin-bottom: 10px;
            }
            .icon-circle {
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: #fdf6ee;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              font-size: 13px;
            }
            .icon-circle.payment { background: rgba(212,160,23,0.15); }
            .row-content { flex: 1; display: flex; justify-content: space-between; gap: 8px; }
            .row-label { color: rgba(101,56,22,0.6); font-size: 13px; }
            .row-value { font-weight: 600; color: #3d1f0a; font-size: 13px; text-align: right; }
            .row-value.bold { font-weight: 700; }
            .footer-note {
              background: #fdf6ee;
              margin: 0 24px 24px;
              border-radius: 12px;
              padding: 12px 16px;
              text-align: center;
              font-size: 12px;
              color: rgba(101,56,22,0.7);
            }
            .footer-note strong { color: #5c3317; }
            @media print {
              body { background: white; padding: 0; }
              .card { box-shadow: none; border: 1px solid #ccc; }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="card-header">
              <div class="label">Booking Confirmation</div>
              <div class="restaurant">🍽️ Pind Pahadi</div>
              <div class="subtitle">Authentic Punjabi Cuisine</div>
              <div class="ref-badge">Ref: ${bookingRef}</div>
            </div>

            <div class="divider"></div>

            <div class="section">
              <div class="section-title">Booking Details</div>
              <div class="row">
                <div class="icon-circle">👤</div>
                <div class="row-content">
                  <span class="row-label">Name</span>
                  <span class="row-value">${bookingData.name}</span>
                </div>
              </div>
              <div class="row">
                <div class="icon-circle">📞</div>
                <div class="row-content">
                  <span class="row-label">Phone</span>
                  <span class="row-value">${bookingData.phone}</span>
                </div>
              </div>
              <div class="row">
                <div class="icon-circle">👥</div>
                <div class="row-content">
                  <span class="row-label">Guests</span>
                  <span class="row-value">${bookingData.guests} ${parseInt(bookingData.guests) === 1 ? 'Guest' : 'Guests'}</span>
                </div>
              </div>
              <div class="row">
                <div class="icon-circle">📅</div>
                <div class="row-content">
                  <span class="row-label">Date</span>
                  <span class="row-value">${bookingData.date}</span>
                </div>
              </div>
              <div class="row">
                <div class="icon-circle">🕐</div>
                <div class="row-content">
                  <span class="row-label">Time</span>
                  <span class="row-value">${bookingData.time}</span>
                </div>
              </div>
              ${bookingData.specialRequest ? `
              <div class="row">
                <div class="icon-circle">💬</div>
                <div class="row-content">
                  <span class="row-label">Special Request</span>
                  <span class="row-value">${bookingData.specialRequest}</span>
                </div>
              </div>` : ''}
            </div>

            <div class="divider"></div>

            <div class="section">
              <div class="section-title">Payment Details</div>
              <div class="row">
                <div class="icon-circle payment">💳</div>
                <div class="row-content">
                  <span class="row-label">Advance Paid</span>
                  <span class="row-value bold">₹${bookingData.advanceAmount}</span>
                </div>
              </div>
              <div class="row">
                <div class="icon-circle payment">💳</div>
                <div class="row-content">
                  <span class="row-label">Method</span>
                  <span class="row-value">${bookingData.paymentMethod}</span>
                </div>
              </div>
              ${bookingData.upiId ? `
              <div class="row">
                <div class="icon-circle payment">🔗</div>
                <div class="row-content">
                  <span class="row-label">UPI / Txn ID</span>
                  <span class="row-value">${bookingData.upiId}</span>
                </div>
              </div>` : ''}
              ${bookingData.bankDetails ? `
              <div class="row">
                <div class="icon-circle payment">🏦</div>
                <div class="row-content">
                  <span class="row-label">Bank Ref</span>
                  <span class="row-value">${bookingData.bankDetails}</span>
                </div>
              </div>` : ''}
              ${bookingData.screenshotFileName ? `
              <div class="row">
                <div class="icon-circle payment">🖼️</div>
                <div class="row-content">
                  <span class="row-label">Screenshot</span>
                  <span class="row-value">${bookingData.screenshotFileName}</span>
                </div>
              </div>` : ''}
            </div>

            <div class="footer-note">
              Thank you for choosing Pind Pahadi! Your booking is <strong>pending confirmation</strong>. We'll reach out shortly.
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-brand-cream-light flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Success header */}
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-brand-brown font-poppins">Booking Submitted!</h2>
          <p className="text-brand-brown/60 text-sm mt-1">We'll confirm via WhatsApp or phone shortly.</p>
        </div>

        {/* Confirmation Card */}
        <div
          ref={cardRef}
          className="bg-white rounded-2xl shadow-card overflow-hidden border-2 border-brand-brown/20"
        >
          {/* Card Header */}
          <div className="bg-brand-brown text-white px-6 py-5 text-center">
            <p className="text-brand-cream/70 text-xs uppercase tracking-widest mb-1">Booking Confirmation</p>
            <h3 className="text-xl font-bold">🍽️ Pind Pahadi</h3>
            <p className="text-brand-cream/70 text-xs mt-1">Authentic Punjabi Cuisine</p>
            <div className="mt-3 inline-block bg-white/20 text-white text-xs font-mono px-4 py-1.5 rounded-full">
              Ref: {bookingRef}
            </div>
          </div>

          {/* Dashed divider */}
          <div className="border-t-2 border-dashed border-brand-brown/20 mx-6" />

          <div className="px-6 py-5 space-y-5">
            {/* Booking Details */}
            <div>
              <h4 className="text-xs font-bold text-brand-brown/50 uppercase tracking-widest mb-3">Booking Details</h4>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-cream flex items-center justify-center shrink-0">
                    <Users className="w-3.5 h-3.5 text-brand-brown" />
                  </div>
                  <div className="flex-1 flex justify-between">
                    <span className="text-brand-brown/60 text-sm">Name</span>
                    <span className="text-brand-brown font-semibold text-sm">{bookingData.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-cream flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-brand-brown" />
                  </div>
                  <div className="flex-1 flex justify-between">
                    <span className="text-brand-brown/60 text-sm">Phone</span>
                    <span className="text-brand-brown font-semibold text-sm">{bookingData.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-cream flex items-center justify-center shrink-0">
                    <Users className="w-3.5 h-3.5 text-brand-brown" />
                  </div>
                  <div className="flex-1 flex justify-between">
                    <span className="text-brand-brown/60 text-sm">Guests</span>
                    <span className="text-brand-brown font-semibold text-sm">
                      {bookingData.guests} {parseInt(bookingData.guests) === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-cream flex items-center justify-center shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-brand-brown" />
                  </div>
                  <div className="flex-1 flex justify-between">
                    <span className="text-brand-brown/60 text-sm">Date</span>
                    <span className="text-brand-brown font-semibold text-sm">{bookingData.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-cream flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5 text-brand-brown" />
                  </div>
                  <div className="flex-1 flex justify-between">
                    <span className="text-brand-brown/60 text-sm">Time</span>
                    <span className="text-brand-brown font-semibold text-sm">{bookingData.time}</span>
                  </div>
                </div>
                {bookingData.specialRequest && (
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-cream flex items-center justify-center shrink-0 mt-0.5">
                      <MessageSquare className="w-3.5 h-3.5 text-brand-brown" />
                    </div>
                    <div className="flex-1 flex justify-between gap-2">
                      <span className="text-brand-brown/60 text-sm shrink-0">Special Request</span>
                      <span className="text-brand-brown font-semibold text-sm text-right">{bookingData.specialRequest}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dashed divider */}
            <div className="border-t-2 border-dashed border-brand-brown/20" />

            {/* Payment Details */}
            <div>
              <h4 className="text-xs font-bold text-brand-brown/50 uppercase tracking-widest mb-3">Payment Details</h4>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-mustard/20 flex items-center justify-center shrink-0">
                    <CreditCard className="w-3.5 h-3.5 text-brand-brown" />
                  </div>
                  <div className="flex-1 flex justify-between">
                    <span className="text-brand-brown/60 text-sm">Advance Paid</span>
                    <span className="text-brand-brown font-bold text-sm">₹{bookingData.advanceAmount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-mustard/20 flex items-center justify-center shrink-0">
                    <CreditCard className="w-3.5 h-3.5 text-brand-brown" />
                  </div>
                  <div className="flex-1 flex justify-between">
                    <span className="text-brand-brown/60 text-sm">Payment Method</span>
                    <span className="text-brand-brown font-semibold text-sm">{bookingData.paymentMethod}</span>
                  </div>
                </div>
                {bookingData.upiId && (
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-mustard/20 flex items-center justify-center shrink-0">
                      <CreditCard className="w-3.5 h-3.5 text-brand-brown" />
                    </div>
                    <div className="flex-1 flex justify-between gap-2">
                      <span className="text-brand-brown/60 text-sm shrink-0">UPI / Txn ID</span>
                      <span className="text-brand-brown font-semibold text-sm text-right break-all">{bookingData.upiId}</span>
                    </div>
                  </div>
                )}
                {bookingData.bankDetails && (
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-mustard/20 flex items-center justify-center shrink-0">
                      <Building2 className="w-3.5 h-3.5 text-brand-brown" />
                    </div>
                    <div className="flex-1 flex justify-between gap-2">
                      <span className="text-brand-brown/60 text-sm shrink-0">Bank Ref</span>
                      <span className="text-brand-brown font-semibold text-sm text-right break-all">{bookingData.bankDetails}</span>
                    </div>
                  </div>
                )}
                {bookingData.screenshotFileName && (
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-mustard/20 flex items-center justify-center shrink-0">
                      <Download className="w-3.5 h-3.5 text-brand-brown" />
                    </div>
                    <div className="flex-1 flex justify-between gap-2">
                      <span className="text-brand-brown/60 text-sm shrink-0">Screenshot</span>
                      <span className="text-brand-brown font-semibold text-sm text-right break-all">{bookingData.screenshotFileName}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer note */}
            <div className="bg-brand-cream rounded-xl px-4 py-3 text-center">
              <p className="text-brand-brown/70 text-xs">
                Thank you for choosing Pind Pahadi! Your booking is{' '}
                <span className="font-semibold text-brand-brown">pending confirmation</span>. We'll reach out shortly.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-brown text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-brown/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Save / Screenshot
          </button>
          <button
            onClick={onBookAnother}
            className="flex-1 flex items-center justify-center gap-2 border-2 border-brand-brown text-brand-brown px-6 py-3 rounded-full font-semibold hover:bg-brand-brown/5 transition-colors"
          >
            Book Another Table
          </button>
        </div>
      </div>
    </div>
  );
}
