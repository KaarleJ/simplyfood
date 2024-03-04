import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/recipes');

  await expect(page).toHaveTitle(
    'SimplyFood - Recipes'
  );
});

test('Renders showing all recipes', async ({ page }) => {
  await page.goto('/recipes');

  await expect(page.getByText('Showing all recipes')).toBeVisible();
  await expect(page.getByText('Spring Rolls').first()).toBeVisible();
  await expect(page.getByText('Pasta Carbonara').first()).toBeVisible();
  await expect(page.getByText('Chocolate Chip Cookies').first()).toBeVisible();
  await expect(page.getByText('Caprese Salad').first()).toBeVisible();
  await expect(page.getByText('Chicken Curry').first()).toBeVisible();
});

test('Renders search bar', async ({ page }) => {
  await page.goto('/recipes');

  await expect(page.getByPlaceholder('search recipes...')).toBeVisible();
});
