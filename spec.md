# Specification

## Summary
**Goal:** Add a "Send to WhatsApp" button on the booking confirmation screen and fix the admin dashboard so bookings reliably appear after submission.

**Planned changes:**
- Add a "Send to WhatsApp" button to the BookingConfirmation component that captures a screenshot of the confirmation card using html2canvas, auto-downloads it as a PNG, and opens a WhatsApp chat (via wa.me) pre-filled with booking reference, guest name, date/time, party size, payment details, and a prompt to attach the downloaded screenshot.
- Fix the React Query hook in useQueries.ts to properly invalidate/refetch the bookings list after any booking submission, confirmation, rejection, or deletion.
- Ensure the Admin page correctly calls the bookings query and renders up-to-date results without requiring a manual page reload.

**User-visible outcome:** After confirming a booking, users can tap "Send to WhatsApp" to download their confirmation screenshot and share booking details via WhatsApp. Admins will see newly submitted and updated bookings reflected in the dashboard immediately.
