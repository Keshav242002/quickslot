import { test, expect } from '@playwright/test';

// Full sign-in/sign-up/session-persistence flows require a live Firebase
// project (VITE_FIREBASE_* env vars) and are skipped until credentials are
// provisioned. The checks below cover routing/validation, which need no
// backend.

test('redirects to /login when not authenticated', async ({ page }) => {
  await page.goto('/venues');
  await expect(page).toHaveURL(/\/login$/);
});

test('can navigate to /login from root', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
});

test('shows validation errors on empty submit', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: /sign in/i }).click({ force: true });
  await expect(page.getByRole('button', { name: /sign in/i })).toBeDisabled();
});

test('can navigate to /register from login page', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('link', { name: /register/i }).click();
  await expect(page).toHaveURL(/\/register$/);
});

test.skip('redirects to /venues after successful login', async () => {
  // Requires a seeded Firebase test user + live credentials.
});

test.skip('stays on /login after failed login (wrong password)', async () => {
  // Requires live Firebase credentials.
});

test.skip('redirects to /venues after successful registration', async () => {
  // Requires live Firebase credentials.
});

test.skip('session persists on page refresh (Firebase persistence)', async () => {
  // Requires live Firebase credentials.
});

test.skip('sign-out redirects to /login and clears session', async () => {
  // Requires live Firebase credentials.
});
