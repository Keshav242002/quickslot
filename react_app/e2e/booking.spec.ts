import { test, expect } from '@playwright/test';

// Full booking flows require an authenticated session (Firebase) and live/
// seeded backend data (venues + slots). These are skipped until test
// credentials and seeded data are available in CI, mirroring auth.spec.ts
// and venues.spec.ts.

test('/venues/:id redirects to /login when not authenticated', async ({ page }) => {
  await page.goto('/venues/1');
  await expect(page).toHaveURL(/\/login$/);
});

test.skip('venue detail page loads with slot grid', async () => {
  // Requires an authenticated session with seeded venue + slot data.
});

test.skip('slot tiles are visible', async () => {
  // Requires an authenticated session with seeded venue + slot data.
});

test.skip('clicking an available slot selects it (visual change)', async () => {
  // Requires an authenticated session with seeded venue + slot data.
});

test.skip('"Book Now" button appears after slot selection', async () => {
  // Requires an authenticated session with seeded venue + slot data.
});

test.skip('clicking "Book Now" opens booking modal', async () => {
  // Requires an authenticated session with seeded venue + slot data.
});

test.skip('modal shows correct venue, date, time, price', async () => {
  // Requires an authenticated session with seeded venue + slot data.
});

test.skip('confirming booking shows success toast', async () => {
  // Requires an authenticated session and a live backend accepting POST /bookings/.
});

test.skip('after success, navigates back to venues', async () => {
  // Requires an authenticated session and a live backend accepting POST /bookings/.
});

test.skip('booking a 409 slot shows conflict modal', async () => {
  // Requires a slot that becomes booked concurrently by another session.
});

test.skip('after conflict modal close, slot grid refreshes', async () => {
  // Requires a slot that becomes booked concurrently by another session.
});

test.skip('time filter "Morning" hides afternoon slots', async () => {
  // Requires an authenticated session with seeded venue + slot data.
});

test.skip('time filter "All" shows all slots', async () => {
  // Requires an authenticated session with seeded venue + slot data.
});

test.skip('changing date resets selected slot and fetches new slots', async () => {
  // Requires an authenticated session with seeded venue + slot data.
});
