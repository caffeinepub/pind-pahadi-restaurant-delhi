# Specification

## Summary
**Goal:** Build a full multi-page website for Pind Pahadi Restaurant Delhi with an authentic Punjabi aesthetic, menu showcase, table booking, and local SEO.

**Planned changes:**
- Apply site-wide visual theme: earthy Punjabi color palette (rustic brown #6B3A2A, mustard yellow #E8A020, warm red #C0392B, off-white #FAF7F2), Poppins/Inter font, high-contrast CTA buttons.
- Build a persistent header with bilingual restaurant name (English + Hindi), click-to-call phone number, and nav links (Home, Menu, About Us, Reviews, Contact/Book Table) with mobile hamburger menu.
- Create Home page with: full-width hero section (hero-bg image, bilingual name, tagline, Call Now / Book a Table / View Menu CTAs), "Why Choose Us" five-card section, "Featured Dishes" five-card section (veg momos, veg burger, coffee, Punjabi thali, ambience images), "Reviews" section (3 testimonials, 4.8 stars, 51 reviews, CTA), and Location section (embedded Google Maps iframe, address, hours, price range, Get Directions + Call Now buttons).
- Build Menu page with category tab filter (Starters, Main Course, Beverages, Combos), hard-coded items showing name, description, ₹ price, and Order Now button.
- Build About Us page with restaurant story, values, staff highlight, and CTA to booking page.
- Build Reviews page with all three testimonials, 4.8-star rating, 51 reviews count, and Book Your Visit Today CTA.
- Build Contact / Book Table page with booking form (Name, Phone, Guests, Date, Time, Special Request), Reserve My Table submit button, inline confirmation message, address, phone, and embedded Google Maps iframe.
- Implement Motoko backend actor with `submitBooking(name, phone, guests, date, time, specialRequest) : async Bool` storing bookings in a stable array.
- Add mobile sticky bottom bar (≤768px) with Call, Directions, and Book Table buttons on all pages.
- Add WhatsApp floating chat button (bottom-right desktop, above sticky bar mobile) linking to wa.me placeholder number.
- Add SEO meta title, meta description, and JSON-LD LocalBusiness schema markup in the HTML head.

**User-visible outcome:** Visitors can browse the restaurant's menu, read about the restaurant and reviews, view the location on a map, submit a table booking request with confirmation, call or get directions via sticky/floating buttons, and chat on WhatsApp — all within a polished, mobile-responsive Punjabi-themed website.
