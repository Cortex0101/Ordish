# Playwright Testing Guide for Authentication Flow

This guide covers the comprehensive Playwright test suite for the authentication system, including signup, login, and logout functionality.

## Test Structure

```
tests/
├── fixtures/
│   └── auth-fixtures.ts     # Shared test utilities and mocks
└── auth/
    ├── login.spec.ts        # Login functionality tests
    ├── signup.spec.ts       # Signup functionality tests
    ├── profile.spec.ts      # Profile page tests
    └── e2e.spec.ts         # End-to-end authentication flows
```

## Test Categories

### 1. Login Tests (`login.spec.ts`)
- **Form Validation**: Tests email validation, password requirements
- **Authentication Flow**: Tests successful and failed login attempts
- **UI States**: Tests loading states, error messages, form disabling
- **Navigation**: Tests links to signup page
- **Social Login**: Tests social authentication buttons
- **Accessibility**: Tests keyboard navigation and form labels
- **Responsive Design**: Tests mobile viewport compatibility

### 2. Signup Tests (`signup.spec.ts`)
- **Form Validation**: Tests email, username, and password validation
- **Registration Flow**: Tests successful and failed signup attempts
- **Email Existence Check**: Tests existing email handling
- **UI States**: Tests loading states, error messages
- **Navigation**: Tests links to login page
- **Social Signup**: Tests social registration buttons
- **Accessibility**: Tests form accessibility features
- **Responsive Design**: Tests mobile compatibility

### 3. Profile Tests (`profile.spec.ts`)
- **User Display**: Tests user information rendering
- **Authentication Guard**: Tests access control
- **Logout Functionality**: Tests logout process
- **Loading States**: Tests loading spinners for data fetching
- **Responsive Design**: Tests mobile profile view

### 4. End-to-End Tests (`e2e.spec.ts`)
- **Complete Flows**: Tests full signup → login → logout sequences
- **Navigation**: Tests seamless navigation between auth pages
- **Persistence**: Tests authentication state across page reloads
- **Protected Routes**: Tests access control for authenticated pages
- **Error Handling**: Tests network and server error scenarios

## Test Utilities

### AuthHelper Class
Provides common methods for authentication testing:

```typescript
class AuthHelper {
  // Mock API responses
  mockEmailCheck(exists: boolean)
  mockLogin(success: boolean)
  mockRegister(success: boolean)
  mockLogout()
  
  // Form interactions
  fillLoginForm(email: string, password: string)
  fillSignupForm(email: string, username: string, password: string)
  submitLoginForm()
  submitSignupForm()
}
```

### Test Data
- `testUsers`: Contains predefined user data for consistent testing
- `selectors`: CSS selectors for UI elements
- `apiEndpoints`: API endpoint constants

## Running Tests

### All Tests
```bash
npm run test
```

### Specific Test Suites
```bash
# Run only authentication tests
npm run test:auth

# Run specific test file
npx playwright test tests/auth/login.spec.ts
```

### Interactive Testing
```bash
# Run tests with UI interface
npm run test:ui

# Run tests in headed mode (visible browser)
npm run test:headed

# Debug tests step by step
npm run test:debug
```

### Test Reports
```bash
# Generate and view HTML report
npm run test:report
```

## Test Configuration

### Browser Support
Tests run on multiple browsers:
- Chrome/Chromium
- Firefox
- Safari/WebKit
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### Mocking Strategy
Tests use Playwright's route mocking to:
- Mock API responses for consistent testing
- Test error scenarios without affecting real backend
- Control timing for loading state tests
- Test edge cases and error conditions

### Key Features
- **Parallel Execution**: Tests run in parallel for faster execution
- **Automatic Retries**: Failed tests retry automatically in CI
- **Visual Testing**: Screenshots and videos on failure
- **Trace Recording**: Detailed execution traces for debugging

## Best Practices

### 1. Page Object Pattern
Each test file focuses on a specific page/component with dedicated selectors.

### 2. API Mocking
All API calls are mocked to ensure:
- Tests are independent of backend state
- Consistent test data
- Fast test execution
- Reliable error scenario testing

### 3. Accessibility Testing
Tests include accessibility checks:
- Keyboard navigation
- Form labels and ARIA attributes
- Focus management

### 4. Responsive Testing
Dedicated mobile viewport tests ensure compatibility across devices.

### 5. Error Scenarios
Comprehensive error testing covers:
- Network failures
- Server errors
- Validation errors
- Authentication failures

## Maintenance

### Adding New Tests
1. Create test files in appropriate directories
2. Use `AuthHelper` for common operations
3. Follow naming conventions: `feature.spec.ts`
4. Include accessibility and mobile tests

### Updating Selectors
Update selectors in `auth-fixtures.ts` when UI changes.

### Mock API Changes
Update mock responses in `AuthHelper` when API contracts change.

## CI/CD Integration

Tests are configured to run in CI environments with:
- Headless execution
- Retry logic for flaky tests
- HTML report generation
- Screenshot/video artifacts on failure

## Debugging Tips

1. **Use `--debug` flag** for step-by-step debugging
2. **Check test reports** for failure screenshots
3. **Use `page.pause()`** to pause execution for inspection
4. **Enable trace recording** for detailed execution analysis
5. **Run single tests** to isolate issues

## Example Test Commands

```bash
# Run all tests
npm run test

# Run specific browser
npx playwright test --project=chromium

# Run tests with specific tag
npx playwright test --grep "login"

# Run tests in headed mode
npm run test:headed

# Generate test reports
npx playwright test && npm run test:report
```

This testing strategy ensures comprehensive coverage of your authentication system while maintaining fast, reliable, and maintainable tests.
