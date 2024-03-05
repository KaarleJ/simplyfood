import { test, expect } from '@playwright/test';

test.describe('Mobile view', () => {
  test('Authed links can be navigated', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is only for mobile view');
    await page.goto('http://localhost:3000/');
    const menu = page.getByTestId('mobile-navbar');
    await menu.click();

    await menu.getByText('Profile').click();
    await page.waitForURL('**/profile');
    await page.goto('http://localhost:3000/');
    await menu.click();
    await menu.getByText('Create').click();
    await page.waitForURL('**/create');
    await page.goto('http://localhost:3000/');
    await menu.click();
    await menu.getByText('SignOut').click();
    await page.waitForURL('**/api/auth/signout');
  });
});

test.describe('Desktop view', () => {
  test('Authed links can be navigated', async ({ page, isMobile }) => {
    test.skip(isMobile, 'This test is only for desktop view');
    await page.goto('http://localhost:3000/');

    const create = page.getByTestId('create-button');
    await expect(create).toBeVisible();
    await create.click();
    await page.waitForURL('**/create');
    await page.goto('http://localhost:3000/');

    const profile = page.getByTestId('profile-menu');
    await profile.click();
    await profile.getByRole('link', { name: 'Profile' }).click();
    await page.waitForURL('**/profile');
    await page.goto('http://localhost:3000/');

    await profile.click();
    await profile.getByRole('link', { name: 'SignOut' }).click();
    await page.waitForURL('**/api/auth/signout');
  });
});
