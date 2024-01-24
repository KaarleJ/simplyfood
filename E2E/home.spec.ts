import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(
    'SimplyFood - The home of the most delicious recipes on the web!'
  );
});

test('Renders Most Popular Recipes', async ({ page }) => {
  await page.goto('/');

  expect(page.getByText('Most popular recipes')).toBeTruthy();
  expect(page.getByText('Spring Rolls')).toBeTruthy();
  expect(page.getByText('Pasta Carbonara')).toBeTruthy();
  expect(page.getByText('Chocolate Chip Cookies')).toBeTruthy();
  expect(page.getByText('Caprese Salad')).toBeTruthy();
  expect(page.getByText('Chicken Curry')).toBeTruthy();
});

test('Renders Most Recent Recipes', async ({ page }) => {
  await page.goto('/');

  expect(page.getByText('Most recent recipes')).toBeTruthy();
  expect(page.getByText('Spring Rolls')).toBeTruthy();
  expect(page.getByText('Pasta Carbonara')).toBeTruthy();
  expect(page.getByText('Chocolate Chip Cookies')).toBeTruthy();
  expect(page.getByText('Caprese Salad')).toBeTruthy();
  expect(page.getByText('Chicken Curry')).toBeTruthy();
});

test('NavBar is rendered and can be navigated', async ({ page }) => {
  await page.goto('/');

  const navbar = page.getByRole('navigation');
  expect(navbar).toBeTruthy();
  const recipesLink = page.getByRole('link', { name: 'Recipes' });
  expect(recipesLink).toBeTruthy();
  await recipesLink.click();
  await page.waitForURL('**/recipes');
  expect(page.url()).toBe('http://127.0.0.1:3000/recipes');
});
