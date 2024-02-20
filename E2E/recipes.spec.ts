import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/recipes');

  await expect(page).toHaveTitle(
    'SimplyFood - Recipes'
  );
});

test('Renders showing all recipes', async ({ page }) => {
  await page.goto('/recipes');

  expect(page.getByText('Showing all recipes')).toBeTruthy();
  expect(page.getByText('Spring Rolls')).toBeTruthy();
  expect(page.getByText('Pasta Carbonara')).toBeTruthy();
  expect(page.getByText('Chocolate Chip Cookies')).toBeTruthy();
  expect(page.getByText('Caprese Salad')).toBeTruthy();
  expect(page.getByText('Chicken Curry')).toBeTruthy();
});

test('Renders search bar', async ({ page }) => {
  await page.goto('/recipes');

  expect(page.getByPlaceholder('search recipes...')).toBeTruthy();
});
