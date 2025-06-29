import { test as base, expect, Page, Route } from '@playwright/test';

// Test data for authentication
export const testUsers = {
  validUser: {
    email: 'test@example.com',
    username: 'testuser',
    password: 'password123'
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  },
  newUser: {
    email: 'newuser@example.com',
    username: 'newuser',
    password: 'newpassword123'
  }
};

// API endpoints
export const apiEndpoints = {
  checkEmail: '/api/auth/check-email',
  login: '/api/auth/login',
  register: '/api/auth/register',
  logout: '/api/auth/logout',
  me: '/api/auth/me'
};

// Page selectors
export const selectors = {
  // Login page
  login: {
    emailInput: 'input[type="email"]',
    passwordInput: 'input[type="password"]',
    loginButton: 'button[type="submit"]',
    signupLink: 'a[href="/signup"]',
    errorAlert: '.alert-danger',
    loadingSpinner: '.spinner-border'
  },
  
  // Signup page
  signup: {
    emailInput: 'input[type="email"]',
    usernameInput: 'input[id*="username"]',
    passwordInput: 'input[type="password"]',
    signupButton: 'button[type="submit"]',
    loginLink: 'a[href="/login"]',
    errorAlert: '.alert-danger',
    loadingSpinner: '.spinner-border'
  },

  // Profile page
  profile: {
    container: '.profile-container',
    banner: '.banner', // Adjust based on your Banner component
    logoutButton: 'button:has-text("Logout")', // Adjust based on your logout implementation
    userInfo: '.user-info' // Adjust based on your user info display
  },

  // Navigation
  nav: {
    profileLink: 'a[href="/profile"]',
    loginLink: 'a[href="/login"]',
    signupLink: 'a[href="/signup"]'
  }
};

// Custom fixture for authenticated user
type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Mock successful authentication
    await page.route(apiEndpoints.me, async route => {
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

    await page.goto('/');
    await use(page);
  }
});

// Helper functions for common test operations
export class AuthHelper {
  constructor(private page: Page) {}

  async mockEmailCheck(exists: boolean, requiresPassword: boolean = true) {
    await this.page.route(apiEndpoints.checkEmail, async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          exists,
          requiresPassword,
          hasSocialAccounts: false
        })
      });
    });
  }

  async mockLogin(success: boolean = true) {
    await this.page.route(apiEndpoints.login, async (route: Route) => {
      if (success) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            user: {
              id: 1,
              email: testUsers.validUser.email,
              username: testUsers.validUser.username
            }
          })
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Invalid credentials' })
        });
      }
    });
  }

  async mockRegister(success: boolean = true) {
    await this.page.route(apiEndpoints.register, async (route: Route) => {
      if (success) {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            user: {
              id: 2,
              email: testUsers.newUser.email,
              username: testUsers.newUser.username
            }
          })
        });
      } else {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Email already exists' })
        });
      }
    });
  }

  async mockLogout() {
    await this.page.route(apiEndpoints.logout, async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Logged out successfully' })
      });
    });
  }

  async fillLoginForm(email: string, password: string) {
    await this.page.fill(selectors.login.emailInput, email);
    await this.page.fill(selectors.login.passwordInput, password);
  }

  async fillSignupForm(email: string, username: string, password: string) {
    await this.page.fill(selectors.signup.emailInput, email);
    await this.page.fill(selectors.signup.usernameInput, username);
    await this.page.fill(selectors.signup.passwordInput, password);
  }

  async submitLoginForm() {
    await this.page.click(selectors.login.loginButton);
  }

  async submitSignupForm() {
    await this.page.click(selectors.signup.signupButton);
  }
}

export { expect };
