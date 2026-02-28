# Specification

## Summary
**Goal:** Fix admin dashboard bookings visibility, restore payment details in the booking form, and add a screenshot/download option on the booking confirmation screen.

**Planned changes:**
- Fix the booking submission flow so that new table bookings submitted by users appear immediately and persistently in the admin dashboard booking list
- Restore the payment details section in the booking form (advance payment amount, payment method, UPI/bank details), storing payment info with each booking record
- Display payment details alongside each booking entry in the admin dashboard
- Add a "Save / Screenshot" button on the booking confirmation screen that captures and downloads a formatted confirmation card (booking ID, guest name, date, time, party size, payment details) as an image, using no external services

**User-visible outcome:** Users can complete a booking with payment details and immediately download a confirmation card. Admins can log in and see all submitted bookings including payment information without any manual refresh.
