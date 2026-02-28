import React, { useRef, useState } from 'react';
import { CheckCircle, Download, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Same WhatsApp number used in WhatsAppButton.tsx
const RESTAURANT_WHATSAPP_NUMBER = '919891142585';

interface PaymentDetails {
  advanceAmount: bigint;
  paymentMethod: string;
  upiDetails: string;
  bankDetails: string;
}

interface BookingConfirmationProps {
  name: string;
  phone: string;
  guests: bigint;
  date: string;
  time: string;
  specialRequest: string;
  paymentDetails: PaymentDetails;
  screenshotFileName?: string | null;
  reference: string;
  onClose?: () => void;
}

export default function BookingConfirmation({
  name,
  phone,
  guests,
  date,
  time,
  specialRequest,
  paymentDetails,
  screenshotFileName,
  reference,
  onClose,
}: BookingConfirmationProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handlePrintSave = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Booking Confirmation – ${reference}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #fdf6ec; display: flex; justify-content: center; align-items: flex-start; padding: 40px 20px; }
    .card { background: #fff; border: 2px solid #c8a96e; border-radius: 12px; max-width: 480px; width: 100%; padding: 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.10); }
    .header { text-align: center; margin-bottom: 24px; }
    .header h1 { font-size: 22px; color: #5c3d1e; font-weight: 700; }
    .header p { color: #8b6340; font-size: 13px; margin-top: 4px; }
    .badge { display: inline-block; background: #e8f5e9; color: #2e7d32; border-radius: 20px; padding: 4px 16px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
    .ref { text-align: center; font-size: 12px; color: #999; margin-bottom: 20px; }
    .section { margin-bottom: 16px; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #c8a96e; font-weight: 700; margin-bottom: 8px; border-bottom: 1px solid #f0e0c0; padding-bottom: 4px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .label { color: #8b6340; font-size: 13px; }
    .value { color: #3d2b1a; font-size: 13px; font-weight: 600; }
    .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #aaa; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>🍽️ Pind Pahadi Restaurant</h1>
      <p>Authentic Punjabi Cuisine</p>
    </div>
    <div style="text-align:center">
      <span class="badge">✓ Booking Confirmed</span>
    </div>
    <div class="ref">Booking Reference: <strong>${reference}</strong></div>
    <div class="section">
      <div class="section-title">Guest Details</div>
      <div class="row"><span class="label">Name</span><span class="value">${name}</span></div>
      <div class="row"><span class="label">Phone</span><span class="value">${phone}</span></div>
      <div class="row"><span class="label">Guests</span><span class="value">${guests.toString()}</span></div>
    </div>
    <div class="section">
      <div class="section-title">Reservation Details</div>
      <div class="row"><span class="label">Date</span><span class="value">${formatDate(date)}</span></div>
      <div class="row"><span class="label">Time</span><span class="value">${time}</span></div>
      ${specialRequest ? `<div class="row"><span class="label">Special Request</span><span class="value">${specialRequest}</span></div>` : ''}
    </div>
    <div class="section">
      <div class="section-title">Payment Details</div>
      <div class="row"><span class="label">Method</span><span class="value">${paymentDetails.paymentMethod}</span></div>
      <div class="row"><span class="label">Advance Paid</span><span class="value">₹${paymentDetails.advanceAmount.toString()}</span></div>
      ${paymentDetails.upiDetails ? `<div class="row"><span class="label">UPI Ref</span><span class="value">${paymentDetails.upiDetails}</span></div>` : ''}
      ${paymentDetails.bankDetails ? `<div class="row"><span class="label">Bank Ref</span><span class="value">${paymentDetails.bankDetails}</span></div>` : ''}
    </div>
    <div class="footer">Thank you for choosing Pind Pahadi! We look forward to serving you.<br/>Please arrive 10 minutes before your reservation time.</div>
  </div>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  const handleSendWhatsApp = async () => {
    setSendingWhatsApp(true);
    try {
      // First trigger the print/save so user can download the screenshot
      handlePrintSave();

      // Small delay to let print dialog open, then open WhatsApp
      await new Promise(resolve => setTimeout(resolve, 800));

      const message = [
        `🍽️ *Pind Pahadi Restaurant – Booking Confirmation*`,
        ``,
        `📋 *Booking Reference:* ${reference}`,
        ``,
        `👤 *Guest Details*`,
        `• Name: ${name}`,
        `• Phone: ${phone}`,
        `• Guests: ${guests.toString()}`,
        ``,
        `📅 *Reservation Details*`,
        `• Date: ${formatDate(date)}`,
        `• Time: ${time}`,
        specialRequest ? `• Special Request: ${specialRequest}` : null,
        ``,
        `💳 *Payment Details*`,
        `• Method: ${paymentDetails.paymentMethod}`,
        `• Advance Paid: ₹${paymentDetails.advanceAmount.toString()}`,
        paymentDetails.upiDetails ? `• UPI Ref: ${paymentDetails.upiDetails}` : null,
        paymentDetails.bankDetails ? `• Bank Ref: ${paymentDetails.bankDetails}` : null,
        ``,
        `📎 _Please attach the booking confirmation screenshot (just saved/printed) to this message._`,
        ``,
        `Thank you for choosing Pind Pahadi! 🙏`,
      ]
        .filter(line => line !== null)
        .join('\n');

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${RESTAURANT_WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    } finally {
      setSendingWhatsApp(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div ref={cardRef} className="bg-white rounded-2xl shadow-card border border-mustard/30 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-brown text-white p-6 text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-mustard" />
          <h2 className="text-2xl font-bold font-poppins">Booking Submitted!</h2>
          <p className="text-white/80 text-sm mt-1">We'll confirm your reservation shortly</p>
        </div>

        {/* Reference */}
        <div className="bg-mustard/10 border-b border-mustard/20 px-6 py-3 text-center">
          <p className="text-xs text-brown/60 uppercase tracking-wider font-semibold">Booking Reference</p>
          <p className="text-brown font-bold text-lg font-mono">{reference}</p>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          {/* Guest Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-mustard mb-2 border-b border-mustard/20 pb-1">
              Guest Details
            </h3>
            <div className="space-y-1.5">
              <DetailRow label="Name" value={name} />
              <DetailRow label="Phone" value={phone} />
              <DetailRow label="Guests" value={`${guests.toString()} person${Number(guests) > 1 ? 's' : ''}`} />
            </div>
          </div>

          {/* Reservation Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-mustard mb-2 border-b border-mustard/20 pb-1">
              Reservation Details
            </h3>
            <div className="space-y-1.5">
              <DetailRow label="Date" value={formatDate(date)} />
              <DetailRow label="Time" value={time} />
              {specialRequest && <DetailRow label="Special Request" value={specialRequest} />}
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-mustard mb-2 border-b border-mustard/20 pb-1">
              Payment Details
            </h3>
            <div className="space-y-1.5">
              <DetailRow label="Method" value={paymentDetails.paymentMethod} />
              <DetailRow label="Advance Paid" value={`₹${paymentDetails.advanceAmount.toString()}`} />
              {paymentDetails.upiDetails && <DetailRow label="UPI Ref" value={paymentDetails.upiDetails} />}
              {paymentDetails.bankDetails && <DetailRow label="Bank Ref" value={paymentDetails.bankDetails} />}
              {screenshotFileName && <DetailRow label="Screenshot" value={screenshotFileName} />}
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mx-6 mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-amber-800 text-xs leading-relaxed">
            📞 Our team will call you on <strong>{phone}</strong> to confirm your booking. Please keep your phone reachable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 space-y-3">
          {/* Send to WhatsApp - Primary CTA */}
          <Button
            onClick={handleSendWhatsApp}
            disabled={sendingWhatsApp}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-base"
          >
            {sendingWhatsApp ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Opening WhatsApp…
              </>
            ) : (
              <>
                <MessageCircle className="w-5 h-5" />
                Send to WhatsApp
              </>
            )}
          </Button>

          <p className="text-center text-xs text-brown/50 -mt-1">
            Downloads confirmation screenshot &amp; opens WhatsApp with booking details
          </p>

          {/* Save / Screenshot */}
          <Button
            onClick={handlePrintSave}
            variant="outline"
            className="w-full border-brown/30 text-brown hover:bg-brown/5 font-medium py-2.5 rounded-xl flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Save / Screenshot
          </Button>

          {/* Close / New Booking */}
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full text-brown/60 hover:text-brown hover:bg-brown/5 font-medium py-2.5 rounded-xl"
            >
              Make Another Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className="text-brown/60 text-sm shrink-0">{label}</span>
      <span className="text-brown font-semibold text-sm text-right">{value}</span>
    </div>
  );
}
