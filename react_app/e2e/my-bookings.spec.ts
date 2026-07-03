import { test, expect } from '@playwright/test';

// Full My Bookings flows require an authenticated session (Firebase) and
// live/seeded backend data. These are skipped until test credentials and
// seeded booking data are available in CI, mirroring auth.spec.ts and
// venues.spec.ts.

test('/my-bookings redirects to /login when not authenticated', async ({ page }) => {
  await page.goto('/my-bookings');
  await expect(page).toHaveURL(/\/login$/);
});

test.skip('My Bookings tab shows bookings after login', async () => {
  // Requires an authenticated session with seeded booking data.
});

test.skip('skeleton briefly visible on slow network', async () => {
  // Requires an authenticated session and network throttling.
});

test.skip('empty state shown when no bookings', async () => {
  // Requires an authenticated session with no seeded bookings.
});

test.skip('clicking cancel opens confirm modal', async () => {
  // Requires an authenticated session with seeded booking data.
});

test.skip('keeping booking closes modal without change', async () => {
  // Requires an authenticated session with seeded booking data.
});

test.skip('confirming cancel removes booking from list', async () => {
  // Requires an authenticated session and a live backend accepting DELETE /bookings/{id}/.
});

test.skip('cache banner shows on offline mode', async () => {
  // Requires an authenticated session with a prior successful fetch cached in localStorage.
});

test.skip('cached bookings visible in offline mode', async () => {
  // Requires an authenticated session with a prior successful fetch cached in localStorage.
});

test.skip('refresh button refetches when back online', async () => {
  // Requires an authenticated session and network toggling.
});
