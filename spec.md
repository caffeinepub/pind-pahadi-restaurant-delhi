# Specification

## Summary
**Goal:** Fix the table booking flow so that submitted bookings are correctly saved in the backend and appear in the admin dashboard, and add Confirm/Reject actions for each booking.

**Planned changes:**
- Fix `bookTable` in `backend/main.mo` to use a stable variable and correctly append submitted bookings so they persist across calls and canister upgrades
- Fix `useSubmitBooking` mutation in `frontend/src/hooks/useQueries.ts` to call the correct backend method with the correct argument shape; surface errors and success feedback to the user on the booking form
- Fix `useGetBookings` query and the Admin dashboard (`frontend/src/pages/Admin.tsx`) to correctly fetch all bookings using an authenticated actor and display them in the reservations table; Refresh button re-fetches data
- Update summary counters (Total Bookings, Total Guests, Total Deposits, Today) to reflect actual fetched booking data
- Add Confirm and Reject action buttons to each booking row in the admin dashboard, calling backend methods to update booking status
- Add a status badge (Pending / Confirmed / Rejected) to each booking row; disable action buttons for already-confirmed or already-rejected bookings
- Add backend methods to update booking status and ensure status is stored in stable state

**User-visible outcome:** Table booking form submissions are reliably saved and immediately visible in the admin dashboard. Admins can confirm or reject each booking, with status badges reflecting the current state in real time.
