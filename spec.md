# Specification

## Summary
**Goal:** Fix cross-device table reservation functionality and update the canonical/public URL to the correct domain.

**Planned changes:**
- Update all hardcoded domain references from `pindpahadirestrurent.caffeine.xyz` to `pindpahadirestrurent.caffein.xyz` (canonical URL meta tag, Open Graph og:url, JSON-LD Restaurant schema URL) in `frontend/index.html`
- Fix the table reservation/booking flow so it works on any device by ensuring the anonymous actor is correctly initialized for unauthenticated users on fresh devices, without relying on device-local session state or cached actor instances
- Investigate and resolve issues in `frontend/src/pages/Contact.tsx` and `frontend/src/hooks/useQueries.ts` related to actor initialization, anonymous identity mismatches, or session setup for unauthenticated booking submissions

**User-visible outcome:** Users on any device or browser can successfully submit a table reservation from the Contact/Book Table page, and all bookings appear correctly in the admin dashboard regardless of which device initiated them.
