import { test, expect } from '@playwright/test';
import { AuthHelper, testUsers, selectors } from '../fixtures/auth-fixtures';

/*
test.describe('Profile Page', () => {
  let authHelper: AuthHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    
    // Mock authenticated user
    await authHelper.mockLogin(true);
    await page.route('/api/auth/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          email: testUsers.validUser.email,
          username: testUsers.validUser.username,
          avatar_url: null
        })
      });
    });
    
    await page.goto('/profile');
  });

  test('should display user profile correctly', async ({ page }) => {
    // Check that profile container is visible
    await expect(page.locator(selectors.profile.container)).toBeVisible();
    
    // Check that user information is displayed
    await expect(page.locator(`text=${testUsers.validUser.username}`)).toBeVisible();
  });

  test('should show user banner with correct information', async ({ page }) => {
    // Check banner component exists
    const banner = page.locator(selectors.profile.banner);
    await expect(banner).toBeVisible();
    
    // Check user information in banner
    await expect(page.locator(`text=${testUsers.validUser.username}`)).toBeVisible();
  });

  test('should handle logout functionality', async ({ page }) => {
    await authHelper.mockLogout();
    
    // Look for logout button (adjust selector based on your implementation)
    const logoutButton = page.locator(selectors.profile.logoutButton);
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      
      // Should redirect to login page after logout
      await expect(page).toHaveURL('/login');
    }
  });

  test('should show loading spinner when user data is not available', async ({ page }) => {
    // Navigate to profile without user data
    await page.route('/api/auth/me', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Unauthorized' })
      });
    });
    
    await page.goto('/profile');
    
    // Should show loading spinner
    await expect(page.locator('.spinner-border')).toBeVisible();
  });
});

test.describe('Profile Authentication Guard', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    // Mock unauthenticated state
    await page.route('/api/auth/me', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Unauthorized' })
      });
    });
    
    await page.goto('/profile');
    
    // Should redirect to login page or show login prompt
    await expect(page).toHaveURL(/\/login|\/$/);
  });
});

test.describe('Profile Mobile View', () => {
  test.use({ viewport: { width: 375, height: 667 } });
  
  test('should be responsive on mobile', async ({ page }) => {
    const authHelper = new AuthHelper(page);
    
    // Mock authenticated user
    await authHelper.mockLogin(true);
    await page.route('/api/auth/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          email: testUsers.validUser.email,
          username: testUsers.validUser.username,
          avatar_url: null
        })
      });
    });
    
    await page.goto('/profile');
    
    // Profile should be visible and properly sized on mobile
    await expect(page.locator(selectors.profile.container)).toBeVisible();
    
    // Check that content doesn't overflow
    const container = page.locator(selectors.profile.container);
    const boundingBox = await container.boundingBox();
    expect(boundingBox?.width).toBeLessThanOrEqual(375);
  });
});
*/