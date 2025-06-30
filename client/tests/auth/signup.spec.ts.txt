import { test, expect } from '@playwright/test';
import { AuthHelper, testUsers, selectors } from '../fixtures/auth-fixtures';

test.describe('Signup Flow', () => {
  let authHelper: AuthHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    await page.goto('/signup');
  });

  test('should display signup form correctly', async ({ page }) => {
    // Check page title and form elements
    await expect(page.locator(selectors.signup.emailInput)).toBeVisible();
    await expect(page.locator(selectors.signup.usernameInput)).toBeVisible();
    await expect(page.locator(selectors.signup.passwordInput)).toBeVisible();
    await expect(page.locator(selectors.signup.signupButton)).toBeVisible();
  });

  /*
  test('should show validation error for invalid email', async ({ page }) => {
    await authHelper.fillSignupForm('invalid-email', testUsers.newUser.username, testUsers.newUser.password);
    await authHelper.submitSignupForm();
    
    // Should not proceed with invalid email
    await expect(page.locator(selectors.signup.errorAlert)).toBeVisible();
  });

  test('should show validation error for short password', async ({ page }) => {
    await authHelper.fillSignupForm(testUsers.newUser.email, testUsers.newUser.username, '123');
    await authHelper.submitSignupForm();
    
    // Should show password too short error
    await expect(page.locator(selectors.signup.errorAlert)).toBeVisible();
  });

  test('should show validation error for short username', async ({ page }) => {
    await authHelper.fillSignupForm(testUsers.newUser.email, 'ab', testUsers.newUser.password);
    await authHelper.submitSignupForm();
    
    // Should show username too short error
    await expect(page.locator(selectors.signup.errorAlert)).toBeVisible();
  });

  test('should show error for existing email', async ({ page }) => {
    await authHelper.mockEmailCheck(true);
    
    await authHelper.fillSignupForm(testUsers.validUser.email, testUsers.newUser.username, testUsers.newUser.password);
    await authHelper.submitSignupForm();
    
    // Should show email already exists error
    await expect(page.locator(selectors.signup.errorAlert)).toBeVisible();
  });

  test('should successfully signup with valid details', async ({ page }) => {
    await authHelper.mockEmailCheck(false);
    await authHelper.mockRegister(true);
    
    await authHelper.fillSignupForm(testUsers.newUser.email, testUsers.newUser.username, testUsers.newUser.password);
    await authHelper.submitSignupForm();
    
    // Should redirect to home page or login page
    await expect(page).toHaveURL(/\/|\/login/);
  });

  test('should show loading state during signup', async ({ page }) => {
    await authHelper.mockEmailCheck(false);
    await authHelper.mockRegister(true);
    
    await authHelper.fillSignupForm(testUsers.newUser.email, testUsers.newUser.username, testUsers.newUser.password);
    
    // Click signup and immediately check for loading state
    await page.click(selectors.signup.signupButton);
    await expect(page.locator(selectors.signup.loadingSpinner)).toBeVisible();
  });

  test('should disable form during loading', async ({ page }) => {
    await authHelper.mockEmailCheck(false);
    await authHelper.mockRegister(true);
    
    await authHelper.fillSignupForm(testUsers.newUser.email, testUsers.newUser.username, testUsers.newUser.password);
    
    // Click signup and check that form is disabled
    await page.click(selectors.signup.signupButton);
    await expect(page.locator(selectors.signup.emailInput)).toBeDisabled();
    await expect(page.locator(selectors.signup.usernameInput)).toBeDisabled();
    await expect(page.locator(selectors.signup.passwordInput)).toBeDisabled();
    await expect(page.locator(selectors.signup.signupButton)).toBeDisabled();
  });

  test('should navigate to login page when clicking login link', async ({ page }) => {
    await page.click(selectors.signup.loginLink);
    await expect(page).toHaveURL('/login');
  });

  test('should handle social signup buttons', async ({ page }) => {
    const facebookButton = page.locator('button:has-text("Facebook")');
    const googleButton = page.locator('button:has-text("Google")');
    const appleButton = page.locator('button:has-text("Apple")');
    
    await expect(facebookButton).toBeVisible();
    await expect(googleButton).toBeVisible();
    await expect(appleButton).toBeVisible();
    
    // Test that clicking shows "not configured" message
    await facebookButton.click();
    await expect(page.locator(selectors.signup.errorAlert)).toBeVisible();
  });

  test('should show password requirements', async ({ page }) => {
    // Check that password requirements are displayed
    const passwordHelp = page.locator('.text-muted');
    await expect(passwordHelp).toBeVisible();
  });
  */
});

test.describe('Signup Accessibility', () => {
  test('should be accessible', async ({ page }) => {
    await page.goto('/signup');
    
    // Check for proper form labels
    await expect(page.locator('label[for*="email"], label:has-text("Email")')).toBeVisible();
    await expect(page.locator('label[for*="username"], label:has-text("Username")')).toBeVisible();
    await expect(page.locator('label[for*="password"], label:has-text("Password")')).toBeVisible();
    
    // Check keyboard navigation
    // first click the email input to focus it
    await page.focus(selectors.signup.emailInput);
    await expect(page.locator(selectors.signup.emailInput)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator(selectors.signup.usernameInput)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator(selectors.signup.passwordInput)).toBeFocused();
  });
});

test.describe('Signup Mobile View', () => {
  test.use({ viewport: { width: 375, height: 667 } });
  
  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/signup');
    
    // Form should be visible and properly sized on mobile
    await expect(page.locator(selectors.signup.emailInput)).toBeVisible();
    await expect(page.locator(selectors.signup.usernameInput)).toBeVisible();
    await expect(page.locator(selectors.signup.passwordInput)).toBeVisible();
    await expect(page.locator(selectors.signup.signupButton)).toBeVisible();
    
    // Check that container is properly sized
    const container = page.locator('.container-sm');
    await expect(container).toBeVisible();
  });
});
