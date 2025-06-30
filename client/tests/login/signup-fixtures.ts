import { Page, Locator } from '@playwright/test';
import { signUpTestIds } from '../../src/pages/login/SignUp.testIds';

export class SignUpPage {
  readonly page: Page;
  
  // Main container
  readonly container: Locator;
  readonly pageTitle: Locator;
  
  // Error/Success messages
  readonly errorAlert: Locator;
  
  // Form
  readonly form: Locator;
  
  // Email field
  readonly emailGroup: Locator;
  readonly emailLabel: Locator;
  readonly emailInput: Locator;
  
  // Username field
  readonly usernameGroup: Locator;
  readonly usernameLabel: Locator;
  readonly usernameInput: Locator;
  
  // Password field
  readonly passwordGroup: Locator;
  readonly passwordLabel: Locator;
  readonly passwordInput: Locator;
  readonly passwordHelpText: Locator;
  
  // Submit button
  readonly submitButtonGroup: Locator;
  readonly submitButton: Locator;
  readonly submitButtonSpinner: Locator;
  readonly submitButtonText: Locator;
  
  // Sign in link
  readonly signInLinkGroup: Locator;
  readonly signInLinkText: Locator;
  readonly signInLink: Locator;
  
  // Divider
  readonly divider: Locator;
  readonly dividerText: Locator;
  
  // Social login buttons
  readonly socialButtonsSection: Locator;
  readonly facebookButton: Locator;
  readonly appleButton: Locator;
  readonly googleButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Main container
    this.container = page.getByTestId(signUpTestIds.container);
    this.pageTitle = page.getByTestId(signUpTestIds.pageTitle);
    
    // Error/Success messages
    this.errorAlert = page.getByTestId(signUpTestIds.errorAlert);
    
    // Form
    this.form = page.getByTestId(signUpTestIds.form);
    
    // Email field
    this.emailGroup = page.getByTestId(signUpTestIds.emailGroup);
    this.emailLabel = page.getByTestId(signUpTestIds.emailLabel);
    this.emailInput = page.getByTestId(signUpTestIds.emailInput);
    
    // Username field
    this.usernameGroup = page.getByTestId(signUpTestIds.usernameGroup);
    this.usernameLabel = page.getByTestId(signUpTestIds.usernameLabel);
    this.usernameInput = page.getByTestId(signUpTestIds.usernameInput);
    
    // Password field
    this.passwordGroup = page.getByTestId(signUpTestIds.passwordGroup);
    this.passwordLabel = page.getByTestId(signUpTestIds.passwordLabel);
    this.passwordInput = page.getByTestId(signUpTestIds.passwordInput);
    this.passwordHelpText = page.getByTestId(signUpTestIds.passwordHelpText);
    
    // Submit button
    this.submitButtonGroup = page.getByTestId(signUpTestIds.submitButtonGroup);
    this.submitButton = page.getByTestId(signUpTestIds.submitButton);
    this.submitButtonSpinner = page.getByTestId(signUpTestIds.submitButtonSpinner);
    this.submitButtonText = page.getByTestId(signUpTestIds.submitButtonText);
    
    // Sign in link
    this.signInLinkGroup = page.getByTestId(signUpTestIds.signInLinkGroup);
    this.signInLinkText = page.getByTestId(signUpTestIds.signInLinkText);
    this.signInLink = page.getByTestId(signUpTestIds.signInLink);
    
    // Divider
    this.divider = page.getByTestId(signUpTestIds.divider);
    this.dividerText = page.getByTestId(signUpTestIds.dividerText);
    
    // Social login buttons
    this.socialButtonsSection = page.getByTestId(signUpTestIds.socialButtonsSection);
    this.facebookButton = page.getByTestId(signUpTestIds.facebookButton);
    this.appleButton = page.getByTestId(signUpTestIds.appleButton);
    this.googleButton = page.getByTestId(signUpTestIds.googleButton);
  }

  async goto() {
    await this.page.goto('/signup');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillForm(email: string, username: string, password: string) {
    await this.fillEmail(email);
    await this.fillUsername(username);
    await this.fillPassword(password);
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async signUp(email: string, username: string, password: string) {
    await this.fillForm(email, username, password);
    await this.submitForm();
  }

  async clickSignInLink() {
    await this.signInLink.click();
  }

  async clickSocialLogin(provider: 'facebook' | 'apple' | 'google') {
    switch (provider) {
      case 'facebook':
        await this.facebookButton.click();
        break;
      case 'apple':
        await this.appleButton.click();
        break;
      case 'google':
        await this.googleButton.click();
        break;
    }
  }

  async waitForError() {
    await this.errorAlert.waitFor({ state: 'visible' });
  }

  async waitForLoading() {
    await this.submitButtonSpinner.waitFor({ state: 'visible' });
  }

  async waitForLoadingToComplete() {
    await this.submitButtonSpinner.waitFor({ state: 'hidden' });
  }

  async getErrorMessage() {
    return await this.errorAlert.textContent();
  }

  async isSubmitButtonDisabled() {
    return await this.submitButton.isDisabled();
  }

  async isFormDisabled() {
    const emailDisabled = await this.emailInput.isDisabled();
    const usernameDisabled = await this.usernameInput.isDisabled();
    const passwordDisabled = await this.passwordInput.isDisabled();
    return emailDisabled && usernameDisabled && passwordDisabled;
  }
}

// Test data utilities
export const testUsers = {
  valid: {
    email: 'test@example.com',
    username: 'testuser',
    password: 'TestPass123'
  },
  validAlternate: {
    email: 'john.doe@example.com',
    username: 'johndoe',
    password: 'SecurePass456'
  },
  invalidEmail: {
    email: 'invalid-email',
    username: 'testuser',
    password: 'TestPass123'
  },
  shortUsername: {
    email: 'test@example.com',
    username: 'ab',
    password: 'TestPass123'
  },
  weakPassword: {
    email: 'test@example.com',
    username: 'testuser',
    password: 'weak'
  },
  existingEmail: {
    email: 'existing@example.com',
    username: 'testuser',
    password: 'TestPass123'
  }
};

// Mock API responses
export const mockApiResponses = {
  emailCheckSuccess: {
    exists: false,
    requiresPassword: false,
    hasSocialAccounts: false
  },
  emailCheckExists: {
    exists: true,
    requiresPassword: true,
    hasSocialAccounts: false
  },
  registerSuccess: {
    user: {
      id: 1,
      email: 'test@example.com',
      username: 'testuser'
    },
    preferences: {
      theme: 'auto',
      language: 'en',
      timezone: 'UTC'
    }
  },
  registerError: {
    error: 'Registration failed'
  }
};
