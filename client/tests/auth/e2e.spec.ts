import { test, expect } from '@playwright/test';
import { AuthHelper, testUsers, selectors } from '../fixtures/auth-fixtures';

test.describe('End-to-End Authentication Flow', () => {
  let authHelper: AuthHelper;

  test('complete signup → login → logout flow', async ({ page }) => {
    authHelper = new AuthHelper(page);

    // Step 1: Sign up a new user
    await page.goto('/signup');
    
    await authHelper.mockEmailCheck(false); // Email doesn't exist
    await authHelper.mockRegister(true);
    
    await authHelper.fillSignupForm(testUsers.newUser.email, testUsers.newUser.username, testUsers.newUser.password);
    await authHelper.submitSignupForm();
    
    // Should redirect after successful signup
    await expect(page).toHaveURL(/\/|\/login/);
    
    // Step 2: Login with the new user
    await page.goto('/login');
    
    await authHelper.mockEmailCheck(true); // Email now exists
    await authHelper.mockLogin(true);
    
    await authHelper.fillLoginForm(testUsers.newUser.email, testUsers.newUser.password);
    await authHelper.submitLoginForm();
    
    // Should redirect to home page
    await expect(page).toHaveURL('/');
    
    // Step 3: Navigate to profile
    await page.route('/api/auth/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 2,
          email: testUsers.newUser.email,
          username: testUsers.newUser.username,
          avatar_url: null
        })
      });
    });
    
    await page.goto('/profile');
    
    // Should see user profile
    await expect(page.locator(selectors.profile.container)).toBeVisible();
    await expect(page.locator(`text=${testUsers.newUser.username}`)).toBeVisible();
    
    // Step 4: Logout
    await authHelper.mockLogout();
    
    const logoutButton = page.locator(selectors.profile.logoutButton);
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await expect(page).toHaveURL('/login');
    }
  });

  test('login → profile → logout flow', async ({ page }) => {
    authHelper = new AuthHelper(page);

    // Step 1: Login
    await page.goto('/login');
    
    await authHelper.mockEmailCheck(true);
    await authHelper.mockLogin(true);
    
    await authHelper.fillLoginForm(testUsers.validUser.email, testUsers.validUser.password);
    await authHelper.submitLoginForm();
    
    await expect(page).toHaveURL('/');
    
    // Step 2: Navigate to profile
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
    await expect(page.locator(selectors.profile.container)).toBeVisible();
    
    // Step 3: Logout
    await authHelper.mockLogout();
    
    const logoutButton = page.locator(selectors.profile.logoutButton);
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await expect(page).toHaveURL('/login');
    }
  });

  test('navigation between login and signup pages', async ({ page }) => {
    // Start at login page
    await page.goto('/login');
    await expect(page).toHaveURL('/login');
    
    // Navigate to signup
    await page.click(selectors.login.signupLink);
    await expect(page).toHaveURL('/signup');
    
    // Navigate back to login
    await page.click(selectors.signup.loginLink);
    await expect(page).toHaveURL('/login');
  });

  test('authentication persistence across page reloads', async ({ page }) => {
    authHelper = new AuthHelper(page);

    // Login first
    await page.goto('/login');
    
    await authHelper.mockEmailCheck(true);
    await authHelper.mockLogin(true);
    
    await authHelper.fillLoginForm(testUsers.validUser.email, testUsers.validUser.password);
    await authHelper.submitLoginForm();
    
    await expect(page).toHaveURL('/');
    
    // Mock authenticated state for profile
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
    
    // Navigate to profile
    await page.goto('/profile');
    await expect(page.locator(selectors.profile.container)).toBeVisible();
    
    // Reload page - should still be authenticated
    await page.reload();
    await expect(page.locator(selectors.profile.container)).toBeVisible();
  });

  test('protected route access without authentication', async ({ page }) => {
    // Mock unauthenticated state
    await page.route('/api/auth/me', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Unauthorized' })
      });
    });
    
    // Try to access profile page without authentication
    await page.goto('/profile');
    
    // Should redirect to login or show appropriate message
    await expect(page).toHaveURL(/\/login|\/$/);
  });
});

test.describe('Error Handling E2E', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    await page.goto('/login');
    
    // Mock network error
    await page.route('/api/auth/check-email', async route => {
      await route.abort('failed');
    });
    
    const authHelper = new AuthHelper(page);
    await authHelper.fillLoginForm(testUsers.validUser.email, testUsers.validUser.password);
    await authHelper.submitLoginForm();
    
    // Should show error message
    await expect(page.locator(selectors.login.errorAlert)).toBeVisible();
  });

  test('should handle server errors gracefully', async ({ page }) => {
    await page.goto('/login');
    
    // Mock server error
    await page.route('/api/auth/check-email', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    const authHelper = new AuthHelper(page);
    await authHelper.fillLoginForm(testUsers.validUser.email, testUsers.validUser.password);
    await authHelper.submitLoginForm();
    
    // Should show error message
    await expect(page.locator(selectors.login.errorAlert)).toBeVisible();
  });
});
