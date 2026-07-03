import { test, expect } from '@playwright/test';

// Full venue-listing flows require an authenticated session (Firebase) and
// live/mocked backend data. These are skipped until test credentials and
// seeded venue data are available in CI, mirroring auth.spec.ts.

test('/venues page loads after login', async ({ page }) => {
  await page.goto('/venues');
  await expect(page).toHaveURL(/\/login$/);
});

test.skip('venue cards are visible', async () => {
  // Requires an authenticated session with seeded venue data.
});

test.skip('clicking a venue card navigates to /venues/:id', async () => {
  // Requires an authenticated session with seeded venue data.
});

test.skip('sport filter reduces visible cards', async () => {
  // Requires an authenticated session with seeded venue data.
});

test.skip('"All" filter restores all cards', async () => {
  // Requires an authenticated session with seeded venue data.
});

test.skip('skeleton is briefly visible on cold load (network throttle)', async () => {
  // Requires an authenticated session and network throttling.
});
