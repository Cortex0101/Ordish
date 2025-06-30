import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('should show validation error for invalid email', async ({ page }) => {
        await page.fill('input[name="email"]', 'invalid-email');
        await page.fill('input[name="password"]', 'validPassword123');
        await page.click('button[type="submit"]');

        // Should not proceed with invalid email
        await expect(page.locator('.alert-danger')).toBeVisible();
    });
  });