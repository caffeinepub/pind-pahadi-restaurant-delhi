# Specification

## Summary
**Goal:** Fix the backend canister connection issues on the Contact page booking form so it connects reliably after deployment.

**Planned changes:**
- Fix the backend canister actor initialization so it connects correctly on page load without requiring a manual refresh
- Add retry logic that automatically retries connecting to the backend at least 3 times before showing an error
- Add a user-friendly loading state (spinner or "Connecting..." message) while the backend actor is initializing
- Replace the current connection error message with a friendly message that suggests refreshing if the connection ultimately fails

**User-visible outcome:** The booking form on the Contact page loads and connects to the backend canister reliably after deployment, showing a friendly loading indicator during warm-up and automatically retrying the connection instead of immediately displaying an error.
