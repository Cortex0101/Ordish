import { test, expect } from '@playwright/test';

test.describe('Basic Application Tests', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads successfully
    await expect(page).toHaveTitle(/Ordish|Home/i);
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    // Look for login link and navigate
    const loginLink = page.locator('a[href="/login"]');
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL('/login');
    } else {
      // If no login link visible, try direct navigation
      await page.goto('/login');
      await expect(page).toHaveURL('/login');
    }
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/');
    
    // Look for signup link and navigate
    const signupLink = page.locator('a[href="/signup"]');
    if (await signupLink.isVisible()) {
      await signupLink.click();
      await expect(page).toHaveURL('/signup');
    } else {
      // If no signup link visible, try direct navigation
      await page.goto('/signup');
      await expect(page).toHaveURL('/signup');
    }
  });
});
