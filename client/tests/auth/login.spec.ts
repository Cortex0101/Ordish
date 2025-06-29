import { test, expect } from '@playwright/test';
import { AuthHelper, testUsers, selectors } from '../fixtures/auth-fixtures';

test.describe('Login Flow', () => {
  let authHelper: AuthHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    await page.goto('/login');
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await authHelper.fillLoginForm('invalid-email', testUsers.validUser.password);
    await authHelper.submitLoginForm();
    
    // Should not proceed with invalid email
    await expect(page.locator(selectors.login.errorAlert)).toBeVisible();
  });

  test('should show validation error for short password', async ({ page }) => {
    await authHelper.fillLoginForm(testUsers.validUser.email, '123');
    await authHelper.submitLoginForm();
    
    // Should show password too short error
    await expect(page.locator(selectors.login.errorAlert)).toBeVisible();
  });

  test('should show error for non-existent email', async ({ page }) => {
    await authHelper.mockEmailCheck(false);
    
    await authHelper.fillLoginForm(testUsers.invalidUser.email, testUsers.validUser.password);
    await authHelper.submitLoginForm();
    
    // Should show email doesn't exist error
    await expect(page.locator(selectors.login.errorAlert)).toBeVisible();
  });

  test('should show error for wrong credentials', async ({ page }) => {
    await authHelper.mockEmailCheck(true);
    await authHelper.mockLogin(false);
    
    await authHelper.fillLoginForm(testUsers.validUser.email, 'wrongpassword');
    await authHelper.submitLoginForm();
    
    // Should show wrong credentials error
    await expect(page.locator(selectors.login.errorAlert)).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await authHelper.mockEmailCheck(true);
    await authHelper.mockLogin(true);
    
    await authHelper.fillLoginForm(testUsers.validUser.email, testUsers.validUser.password);
    await authHelper.submitLoginForm();
    
    // Should redirect to home page
    await expect(page).toHaveURL('/');
  });

  test('should show loading state during login', async ({ page }) => {
    await authHelper.mockEmailCheck(true);
    await authHelper.mockLogin(true);
    
    await authHelper.fillLoginForm(testUsers.validUser.email, testUsers.validUser.password);
    
    // Click login and immediately check for loading state
    await page.click(selectors.login.loginButton);
    await expect(page.locator(selectors.login.loadingSpinner)).toBeVisible();
  });

  test('should disable form during loading', async ({ page }) => {
    await authHelper.mockEmailCheck(true);
    await authHelper.mockLogin(true);
    
    await authHelper.fillLoginForm(testUsers.validUser.email, testUsers.validUser.password);
    
    // Click login and check that form is disabled
    await page.click(selectors.login.loginButton);
    await expect(page.locator(selectors.login.emailInput)).toBeDisabled();
    await expect(page.locator(selectors.login.passwordInput)).toBeDisabled();
    await expect(page.locator(selectors.login.loginButton)).toBeDisabled();
  });

  test('should navigate to signup page when clicking signup link', async ({ page }) => {
    await page.click(selectors.login.signupLink);
    await expect(page).toHaveURL('/signup');
  });

  test('should handle social login buttons', async ({ page }) => {
    const facebookButton = page.locator('button:has-text("Facebook")');
    const googleButton = page.locator('button:has-text("Google")');
    const appleButton = page.locator('button:has-text("Apple")');
    
    await expect(facebookButton).toBeVisible();
    await expect(googleButton).toBeVisible();
    await expect(appleButton).toBeVisible();
    
    // Test that clicking shows "not configured" message
    await facebookButton.click();
    await expect(page.locator(selectors.login.errorAlert)).toBeVisible();
  });
});

test.describe('Login Accessibility', () => {
  test('should be accessible', async ({ page }) => {
    await page.goto('/login');
    
    // Check for proper form labels
    await expect(page.locator('label[for*="email"], label:has-text("Email")')).toBeVisible();
    await expect(page.locator('label[for*="password"], label:has-text("Password")')).toBeVisible();
    
    // Check keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(selectors.login.emailInput)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator(selectors.login.passwordInput)).toBeFocused();
  });
});

test.describe('Login Mobile View', () => {
  test.use({ viewport: { width: 375, height: 667 } });
  
  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/login');
    
    // Form should be visible and properly sized on mobile
    await expect(page.locator(selectors.login.emailInput)).toBeVisible();
    await expect(page.locator(selectors.login.passwordInput)).toBeVisible();
    await expect(page.locator(selectors.login.loginButton)).toBeVisible();
    
    // Check that container is properly sized
    const container = page.locator('.container-sm');
    await expect(container).toBeVisible();
  });
});
