# Specification

## Summary
**Goal:** Change the admin dashboard URL path from `/admin` to a less obvious route `/pindpahadi-manage-2024` to make it harder to discover.

**Planned changes:**
- Update the frontend router route definition from `/admin` to `/pindpahadi-manage-2024`
- Update all internal links, programmatic navigations, and redirects that referenced `/admin` to use `/pindpahadi-manage-2024`
- Ensure navigating to `/admin` no longer loads the admin dashboard (404 or redirect to home)

**User-visible outcome:** The admin dashboard is only accessible at `/pindpahadi-manage-2024`; visiting `/admin` no longer works. The new path remains hidden from all visible navigation elements.
