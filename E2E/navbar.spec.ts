import { test, expect } from '@playwright/test';

test('NavBar is rendered', async ({ page }) => {
  await page.goto('/');

  const navbar = page.getByRole('navigation');
  expect(navbar).toBeDefined();
});

test('Links are rendered and can be navigated', async ({ page }) => {
  await page.goto('/');

  const homeLink = page.getByRole('link', { name: 'Home' });
  const recipesLink = page.getByRole('link', { name: 'Recipes' });
  const signInLink = page.getByRole('link', { name: 'SignIn' });
  expect(homeLink).toBeAttached();
  expect(recipesLink).toBeAttached();
  expect(signInLink).toBeAttached();

  await signInLink.click();
  await page.waitForURL('**/api/auth/signin');
  await page.goto('/');
  await recipesLink.click();
  await page.waitForURL('**/recipes');
  await homeLink.click();
  await page.waitForURL('**/');
});