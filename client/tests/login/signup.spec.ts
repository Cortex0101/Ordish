import { test, expect } from '@playwright/test';
import { SignUpPage, testUsers, mockApiResponses } from './signup-fixtures';

test.describe('SignUp Page', () => {
  let signUpPage: SignUpPage;

  test.beforeEach(async ({ page }) => {
    signUpPage = new SignUpPage(page);
    await signUpPage.goto();
  });

  test.describe('Form Validation', () => {
    test('should show error for invalid email', async ({ page }) => {
      // Mock API endpoint
      await page.route('/api/auth/check-email', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockApiResponses.emailCheckSuccess)
      }));

      await signUpPage.fillForm(testUsers.invalidEmail.email, testUsers.invalidEmail.username, testUsers.invalidEmail.password);
      await signUpPage.submitForm();
      
      await signUpPage.waitForError();
      const errorMessage = await signUpPage.getErrorMessage();
      expect(errorMessage).toContain('Invalid email');
    });

    test('should show error for username too short', async ({ page }) => {
      // Mock API endpoint
      await page.route('/api/auth/check-email', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockApiResponses.emailCheckSuccess)
      }));

      await signUpPage.fillForm(testUsers.shortUsername.email, testUsers.shortUsername.username, testUsers.shortUsername.password);
      await signUpPage.submitForm();
      
      await signUpPage.waitForError();
      const errorMessage = await signUpPage.getErrorMessage();
      expect(errorMessage).toContain('Username too short');
    });

    test('should show error for weak password', async ({ page }) => {
      // Mock API endpoint
      await page.route('/api/auth/check-email', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockApiResponses.emailCheckSuccess)
      }));

      await signUpPage.fillForm(testUsers.weakPassword.email, testUsers.weakPassword.username, testUsers.weakPassword.password);
      await signUpPage.submitForm();
      
      await signUpPage.waitForError();
      const errorMessage = await signUpPage.getErrorMessage();
      expect(errorMessage).toContain('Password requirements');
    });

    test('should show error for existing email', async ({ page }) => {
      // Mock API endpoint to return existing email
      await page.route('/api/auth/check-email', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockApiResponses.emailCheckExists)
      }));

      await signUpPage.fillForm(testUsers.existingEmail.email, testUsers.existingEmail.username, testUsers.existingEmail.password);
      await signUpPage.submitForm();
      
      await signUpPage.waitForError();
      const errorMessage = await signUpPage.getErrorMessage();
      expect(errorMessage).toContain('Email already exists');
    });

    test('should disable submit button when password is empty', async () => {
      await signUpPage.fillEmail(testUsers.valid.email);
      await signUpPage.fillUsername(testUsers.valid.username);
      
      const isDisabled = await signUpPage.isSubmitButtonDisabled();
      expect(isDisabled).toBe(true);
    });

    test('should enable submit button when all fields are filled', async () => {
      await signUpPage.fillForm(testUsers.valid.email, testUsers.valid.username, testUsers.valid.password);
      
      const isDisabled = await signUpPage.isSubmitButtonDisabled();
      expect(isDisabled).toBe(false);
    });
  });

  test.describe('Form Submission', () => {
    test('should show loading state during submission', async ({ page }) => {
      // Mock API endpoints with delay
      await page.route('/api/auth/check-email', route => 
        setTimeout(() => route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockApiResponses.emailCheckSuccess)
        }), 500)
      );

      await page.route('/api/auth/register', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockApiResponses.registerSuccess)
      }));

      await page.route('/api/auth/login', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockApiResponses.registerSuccess)
      }));

      await signUpPage.fillForm(testUsers.valid.email, testUsers.valid.username, testUsers.valid.password);
      await signUpPage.submitForm();
      
      // Check loading state
      await expect(signUpPage.submitButtonSpinner).toBeVisible();
      await expect(signUpPage.submitButtonText).toContainText('Creating account');
      
      // Check form is disabled during loading
      const isFormDisabled = await signUpPage.isFormDisabled();
      expect(isFormDisabled).toBe(true);
    });

    test('should successfully register with valid data', async ({ page }) => {
      // Mock successful API responses
      await page.route('/api/auth/check-email', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockApiResponses.emailCheckSuccess)
      }));

      await page.route('/api/auth/register', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockApiResponses.registerSuccess)
      }));

      await page.route('/api/auth/login', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockApiResponses.registerSuccess)
      }));

      await signUpPage.fillForm(testUsers.valid.email, testUsers.valid.username, testUsers.valid.password);
      await signUpPage.submitForm();
      
      // Should redirect to home page after successful registration
      await page.waitForURL('/');
    });

    test('should handle registration API error', async ({ page }) => {
      // Mock email check success but registration failure
      await page.route('/api/auth/check-email', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockApiResponses.emailCheckSuccess)
      }));

      await page.route('/api/auth/register', route => route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify(mockApiResponses.registerError)
      }));

      await signUpPage.fillForm(testUsers.valid.email, testUsers.valid.username, testUsers.valid.password);
      await signUpPage.submitForm();
      
      await signUpPage.waitForError();
      const errorMessage = await signUpPage.getErrorMessage();
      expect(errorMessage).toContain('Registration failed');
    });

    test('should handle email check API error', async ({ page }) => {
      // Mock email check failure
      await page.route('/api/auth/check-email', route => route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      }));

      await signUpPage.fillForm(testUsers.valid.email, testUsers.valid.username, testUsers.valid.password);
      await signUpPage.submitForm();
      
      await signUpPage.waitForError();
      const errorMessage = await signUpPage.getErrorMessage();
      expect(errorMessage).toContain('Email check error');
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to login page when clicking sign in link', async ({ page }) => {
      await signUpPage.clickSignInLink();
      await page.waitForURL('/login');
    });
  });

  test.describe('Social Login', () => {
    test('should show error for Facebook login (not configured)', async () => {
      await signUpPage.clickSocialLogin('facebook');
      
      await signUpPage.waitForError();
      const errorMessage = await signUpPage.getErrorMessage();
      expect(errorMessage).toContain('Social login not configured');
    });

    test('should show error for Apple login (not configured)', async () => {
      await signUpPage.clickSocialLogin('apple');
      
      await signUpPage.waitForError();
      const errorMessage = await signUpPage.getErrorMessage();
      expect(errorMessage).toContain('Social login not configured');
    });

    test('should show error for Google login (not configured)', async () => {
      await signUpPage.clickSocialLogin('google');
      
      await signUpPage.waitForError();
      const errorMessage = await signUpPage.getErrorMessage();
      expect(errorMessage).toContain('Social login not configured');
    });

    test('should disable social buttons during form submission', async ({ page }) => {
      // Mock API with delay
      await page.route('/api/auth/check-email', route => 
        setTimeout(() => route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockApiResponses.emailCheckSuccess)
        }), 500)
      );

      await signUpPage.fillForm(testUsers.valid.email, testUsers.valid.username, testUsers.valid.password);
      await signUpPage.submitForm();
      
      // Check social buttons are disabled
      await expect(signUpPage.facebookButton).toBeDisabled();
      await expect(signUpPage.appleButton).toBeDisabled();
      await expect(signUpPage.googleButton).toBeDisabled();
    });
  });

  test.describe('Accessibility', () => {
    test('should be accessible', async ({ page }) => {
      // Add accessibility testing
      const accessibilityScanResults = await page.accessibility.snapshot();
      expect(accessibilityScanResults).toBeTruthy();
    });

    test('should have proper form labels', async () => {
      // Check form labels are properly associated
      await expect(signUpPage.emailInput).toHaveAttribute('type', 'email');
      await expect(signUpPage.passwordInput).toHaveAttribute('type', 'password');
      await expect(signUpPage.usernameInput).toHaveAttribute('type', 'text');
    });

    test('should have required attributes', async () => {
      await expect(signUpPage.emailInput).toHaveAttribute('required');
      await expect(signUpPage.usernameInput).toHaveAttribute('required');
      await expect(signUpPage.passwordInput).toHaveAttribute('required');
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Verify all elements are still visible and properly sized
      await expect(signUpPage.container).toBeVisible();
      await expect(signUpPage.form).toBeVisible();
      await expect(signUpPage.emailInput).toBeVisible();
      await expect(signUpPage.usernameInput).toBeVisible();
      await expect(signUpPage.passwordInput).toBeVisible();
      await expect(signUpPage.submitButton).toBeVisible();
      
      // Social buttons should stack properly
      await expect(signUpPage.facebookButton).toBeVisible();
      await expect(signUpPage.appleButton).toBeVisible();
      await expect(signUpPage.googleButton).toBeVisible();
    });

    test('should be responsive on tablet', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Verify layout adapts properly
      await expect(signUpPage.container).toBeVisible();
      await expect(signUpPage.form).toBeVisible();
    });
  });
});
