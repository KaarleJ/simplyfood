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
