import { test, expect } from '@playwright/test';

test('NavBar is rendered', async ({ page, isMobile }) => {
  await page.goto('/');

  const navbar = page.getByTestId('navbar');
  await expect(navbar).toBeVisible();
});

test.describe('Mobile view', () => {
  test('Menu is rendered and desktop navbar is not', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'This test is only for mobile view');
    await page.goto('/');
    const menu = page.getByTestId('mobile-navbar');
    const navbar = page.getByTestId('desktop-navbar');

    await expect(navbar).not.toBeVisible();
    await expect(menu).toBeVisible();
  });

  test('Menu is expanded and links can be navigated', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'This test is only for mobile view');
    await page.goto('/');
    const menu = page.getByTestId('mobile-navbar');
    await menu.click();

    await expect(menu.getByText('Home')).toBeVisible();
    await expect(menu.getByText('Recipes')).toBeVisible();
    await expect(menu.getByText('SignIn')).toBeVisible();

    await menu.getByText('SignIn').click();
    await page.waitForURL('**/api/auth/signin');
    await page.goto('/');
    await menu.click();
    await menu.getByText('Recipes').click();
    await page.waitForURL('**/recipes');
    await page.goto('/');
    await menu.click();
    await menu.getByText('Home').click();
    await page.waitForURL('**/');
  });
});

test.describe('Desktop view', () => {
  test('Menu is not rendered and desktop navbar is', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'This test is only for desktop view');
    await page.goto('/');
    const menu = page.getByTestId('mobile-navbar');
    const navbar = page.getByTestId('desktop-navbar');

    await expect(navbar).toBeVisible();
    await expect(menu).not.toBeVisible();
  });

  test('Links are rendered and can be navigated', async ({ page, isMobile }) => {
    test.skip(isMobile, 'This test is only for desktop view');
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
});
