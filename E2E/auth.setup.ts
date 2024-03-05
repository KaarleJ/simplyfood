import { test as setup } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const authFile = 'E2E/.auth/user.json';

setup.use({ storageState: { cookies: [], origins: [] } });

setup('authenticate', async ({ page }) => {
  const username = process.env.GITHUB_USERNAME;
  const password = process.env.GITHUB_PASSWORD;
  if (!username || !password) {
    throw new Error('GITHUB_USERNAME and GITHUB_PASSWORD environment variables must be set');
  }
  console.log('Authenticating');
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Signin' }).click();
  await page.waitForURL('http://localhost:3000/api/auth/signin');
  await page.getByRole('button', { name: 'Sign in with GitHub' }).click();
  await page.getByLabel('Username or email address').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();

  await page.waitForURL('https://github.com/login/oauth/**');
  const authorize = page.getByRole('button', { name: 'Authorize' });
  if (await authorize.isVisible()) {
    await authorize.click();
  }
  await page.waitForTimeout(4000);

  await page.context().storageState({ path: authFile });

  console.log('Authenticated');
});
