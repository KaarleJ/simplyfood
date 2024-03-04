import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(
    'SimplyFood - The home of the most delicious recipes on the web!'
  );
});

test('Renders Most Popular Recipes', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Most popular recipes')).toBeVisible();
  await expect(page.getByText('Spring Rolls').first()).toBeVisible();
  await expect(page.getByText('Pasta Carbonara').first()).toBeVisible();
  await expect(page.getByText('Chocolate Chip Cookies').first()).toBeVisible();
  await expect(page.getByText('Caprese Salad').first()).toBeVisible();
  await expect(page.getByText('Chicken Curry').first()).toBeVisible();
});

test('Renders Most Recent Recipes', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Most recent recipes')).toBeVisible();
  await expect(page.getByText('Spring Rolls').first()).toBeVisible();
  await expect(page.getByText('Pasta Carbonara').first()).toBeVisible();
  await expect(page.getByText('Chocolate Chip Cookies').first()).toBeVisible();
  await expect(page.getByText('Caprese Salad').first()).toBeVisible();
  await expect(page.getByText('Chicken Curry').first()).toBeVisible();
});
